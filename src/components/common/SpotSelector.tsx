import React, { useState, useEffect, useRef } from 'react';
import { getAllSpots, createSpot, Spot } from '../../lib/api/spots';

interface SpotSelectorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const SpotSelector: React.FC<SpotSelectorProps> = ({ value, onChange, placeholder = 'Type position/spot name...' }) => {
  const [spots, setSpots] = useState<Spot[]>([]);
  const [inputValue, setInputValue] = useState(value);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSpots, setFilteredSpots] = useState<Spot[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadSpots();
  }, []);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadSpots = async () => {
    try {
      const data = await getAllSpots();
      setSpots(data);
    } catch (error) {
      console.error('Failed to load spots:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    onChange(val);

    if (val.trim()) {
      const filtered = spots.filter(spot =>
        spot.name.toLowerCase().includes(val.toLowerCase())
      );
      setFilteredSpots(filtered);
      setShowSuggestions(true);
    } else {
      setFilteredSpots([]);
      setShowSuggestions(false);
    }
  };

  const handleSelectSpot = async (spotName: string) => {
    setInputValue(spotName);
    onChange(spotName);
    setShowSuggestions(false);

    try {
      await createSpot(spotName);
      await loadSpots();
    } catch (error) {
      console.error('Failed to update spot usage:', error);
    }
  };

  const handleInputFocus = () => {
    if (inputValue.trim()) {
      const filtered = spots.filter(spot =>
        spot.name.toLowerCase().includes(inputValue.toLowerCase())
      );
      setFilteredSpots(filtered);
      setShowSuggestions(true);
    }
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      setShowSuggestions(false);

      try {
        await createSpot(inputValue.trim());
        await loadSpots();
      } catch (error) {
        console.error('Failed to create spot:', error);
      }
    }
  };

  const exactMatch = spots.find(s => s.name.toLowerCase() === inputValue.toLowerCase());
  const shouldShowCreate = inputValue.trim() && !exactMatch && filteredSpots.length === 0;

  return (
    <div ref={containerRef} className="relative">
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />

      {showSuggestions && (filteredSpots.length > 0 || shouldShowCreate) && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {filteredSpots.map((spot) => (
            <button
              key={spot.id}
              onClick={() => handleSelectSpot(spot.name)}
              className="w-full px-4 py-2 text-left hover:bg-blue-50 flex items-center justify-between group"
            >
              <span className="text-gray-800">{spot.name}</span>
              <span className="text-xs text-gray-400 group-hover:text-gray-600">
                {spot.use_count} {spot.use_count === 1 ? 'use' : 'uses'}
              </span>
            </button>
          ))}

          {shouldShowCreate && (
            <button
              onClick={() => handleSelectSpot(inputValue.trim())}
              className="w-full px-4 py-2 text-left hover:bg-green-50 border-t border-gray-200"
            >
              <span className="text-green-600 font-medium">+ Create "{inputValue}"</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default SpotSelector;
