import React, { useState, useEffect, useRef } from 'react';
import { X, Plus, CreditCard as Edit2 } from 'lucide-react';
import { getUserTags, searchTags, createTag, updateTag, getOrCreateTag, Tag } from '../../lib/api/tags';

interface TagSelectorProps {
  selectedTags: string[];
  onChange: (tags: string[]) => void;
}

const PRESET_COLORS = [
  '#3B82F6', // blue
  '#EF4444', // red
  '#10B981', // green
  '#F59E0B', // amber
  '#8B5CF6', // purple
  '#EC4899', // pink
  '#14B8A6', // teal
  '#F97316', // orange
  '#6366F1', // indigo
  '#84CC16', // lime
];

const TagSelector: React.FC<TagSelectorProps> = ({ selectedTags, onChange }) => {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<Tag[]>([]);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0]);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadTags();
  }, []);

  useEffect(() => {
    if (inputValue.trim().length > 0) {
      performSearch(inputValue);
    } else {
      setSuggestions(allTags.slice(0, 10));
    }
  }, [inputValue, allTags]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        setShowColorPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadTags = async () => {
    try {
      const tags = await getUserTags();
      setAllTags(tags);
      setSuggestions(tags.slice(0, 10));
    } catch (error) {
      console.error('Failed to load tags:', error);
    }
  };

  const performSearch = async (query: string) => {
    try {
      const results = await searchTags(query);
      setSuggestions(results);
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setShowSuggestions(true);
  };

  const handleInputFocus = () => {
    setShowSuggestions(true);
  };

  const handleSelectTag = async (tagName: string) => {
    if (!selectedTags.includes(tagName)) {
      onChange([...selectedTags, tagName]);

      const tag = allTags.find(t => t.name === tagName);
      if (tag) {
        await updateTag(tag.id, { ...tag, usage_count: tag.usage_count + 1 });
      }
    }
    setInputValue('');
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleRemoveTag = (tagName: string) => {
    onChange(selectedTags.filter(t => t !== tagName));
  };

  const handleCreateTag = async () => {
    const trimmedValue = inputValue.trim();
    if (!trimmedValue) return;

    if (selectedTags.includes(trimmedValue)) {
      setInputValue('');
      return;
    }

    try {
      const tag = await getOrCreateTag(trimmedValue, selectedColor);
      onChange([...selectedTags, tag.name]);
      setInputValue('');
      setShowSuggestions(false);
      setShowColorPicker(false);
      await loadTags();
    } catch (error) {
      console.error('Failed to create tag:', error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();

      const exactMatch = suggestions.find(
        s => s.name.toLowerCase() === inputValue.toLowerCase()
      );

      if (exactMatch) {
        handleSelectTag(exactMatch.name);
      } else if (inputValue.trim()) {
        handleCreateTag();
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setShowColorPicker(false);
    }
  };

  const handleEditTagColor = (tag: Tag, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingTag(tag);
    setSelectedColor(tag.color);
    setShowColorPicker(true);
  };

  const handleUpdateTagColor = async (color: string) => {
    if (!editingTag) return;

    try {
      await updateTag(editingTag.id, { color });
      await loadTags();
      setShowColorPicker(false);
      setEditingTag(null);
    } catch (error) {
      console.error('Failed to update tag color:', error);
    }
  };

  const getTagColor = (tagName: string): string => {
    const tag = allTags.find(t => t.name === tagName);
    return tag?.color || PRESET_COLORS[0];
  };

  const exactMatch = suggestions.find(
    s => s.name.toLowerCase() === inputValue.toLowerCase()
  );
  const showCreateOption = inputValue.trim() && !exactMatch;

  return (
    <div ref={wrapperRef} className="space-y-3">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          placeholder="Type to search or create tags..."
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />

        {showSuggestions && (suggestions.length > 0 || showCreateOption) && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
            {suggestions.length > 0 && (
              <div className="py-1">
                <div className="px-3 py-2 text-xs text-gray-500 font-semibold uppercase">
                  Select an option or create one
                </div>
                {suggestions.map((tag) => (
                  <button
                    key={tag.id}
                    onClick={() => handleSelectTag(tag.name)}
                    disabled={selectedTags.includes(tag.name)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-left hover:bg-gray-50 ${
                      selectedTags.includes(tag.name) ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="px-2 py-1 rounded text-sm font-medium text-white"
                        style={{ backgroundColor: tag.color }}
                      >
                        {tag.name}
                      </span>
                      {tag.usage_count > 0 && (
                        <span className="text-xs text-gray-400">({tag.usage_count})</span>
                      )}
                    </div>
                    <button
                      onClick={(e) => handleEditTagColor(tag, e)}
                      className="p-1 hover:bg-gray-200 rounded"
                      title="Edit color"
                    >
                      <Edit2 size={14} className="text-gray-400" />
                    </button>
                  </button>
                ))}
              </div>
            )}

            {showCreateOption && (
              <div className="border-t border-gray-200 py-1">
                <button
                  onClick={() => setShowColorPicker(!showColorPicker)}
                  className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-blue-50 text-blue-600"
                >
                  <Plus size={16} />
                  <span className="font-medium">Create "{inputValue}"</span>
                </button>

                {showColorPicker && (
                  <div className="px-3 py-2 bg-gray-50">
                    <div className="text-xs text-gray-600 mb-2">Choose color:</div>
                    <div className="grid grid-cols-5 gap-2">
                      {PRESET_COLORS.map((color) => (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={`w-8 h-8 rounded-lg border-2 ${
                            selectedColor === color ? 'border-gray-900' : 'border-transparent'
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <button
                      onClick={handleCreateTag}
                      className="w-full mt-2 px-3 py-1.5 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700"
                    >
                      Create Tag
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {showColorPicker && editingTag && (
          <div className="absolute z-20 mt-1 p-3 bg-white border border-gray-200 rounded-lg shadow-lg">
            <div className="text-sm font-medium text-gray-700 mb-2">
              Edit color for "{editingTag.name}"
            </div>
            <div className="grid grid-cols-5 gap-2 mb-3">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-8 h-8 rounded-lg border-2 ${
                    selectedColor === color ? 'border-gray-900' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowColorPicker(false);
                  setEditingTag(null);
                }}
                className="flex-1 px-3 py-1.5 border border-gray-300 rounded text-sm hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleUpdateTagColor(selectedColor)}
                className="flex-1 px-3 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        )}
      </div>

      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedTags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium text-white"
              style={{ backgroundColor: getTagColor(tag) }}
            >
              {tag}
              <button
                onClick={() => handleRemoveTag(tag)}
                className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
              >
                <X size={14} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default TagSelector;
