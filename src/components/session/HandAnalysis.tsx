import React, { useState, useCallback, useRef } from 'react';
import { Tag, Brain, AlertTriangle, ChevronDown, ChevronUp, Image as ImageIcon, X } from 'lucide-react';
import Select from 'react-select';

interface HandAnalysisProps {
  index: number;
  expanded: boolean;
  onToggle: () => void;
}

const HandAnalysis: React.FC<HandAnalysisProps> = ({ index, expanded, onToggle }) => {
  const [handScreenshot, setHandScreenshot] = useState<string | null>(null);
  const [handDescription, setHandDescription] = useState('');
  const [initialThought, setInitialThought] = useState('');
  const [adaptiveThought, setAdaptiveThought] = useState('');
  const [forArguments, setForArguments] = useState('');
  const [againstArguments, setAgainstArguments] = useState('');
  const [theoryAttachments, setTheoryAttachments] = useState<Array<{ id: string; image: string; caption: string }>>([]);
  
  // Track which section is focused
  const [focusedSection, setFocusedSection] = useState<'handScreenshot' | 'theoryAttachments' | null>(null);
  
  // Refs for the drop zones
  const handScreenshotRef = useRef<HTMLDivElement>(null);
  const theoryAttachmentsRef = useRef<HTMLDivElement>(null);

  const spotTypes = [
    { value: 'srp', label: 'Single Raised Pot (SRP)' },
    { value: '3bet', label: '3-bet Pot' },
    { value: '4bet', label: '4-bet Pot' },
    { value: '5bet', label: '5-bet+/All-in Pot' }
  ];

  const positions = [
    { value: 'btn_bb', label: 'BTN vs BB' },
    { value: 'co_btn', label: 'CO vs BTN' },
    { value: 'mp_co', label: 'MP vs CO' }
  ];

  const priorities = [
    { value: 'high', label: 'High Priority', color: 'bg-red-100 text-red-800' },
    { value: 'medium', label: 'Medium Priority', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'low', label: 'Low Priority', color: 'bg-green-100 text-green-800' }
  ];

  const handleImagePaste = useCallback((event: ClipboardEvent) => {
    if (!focusedSection) return;
    
    const items = event.clipboardData?.items;
    if (!items) return;

    for (const item of Array.from(items)) {
      if (item.type.indexOf('image') !== -1) {
        const blob = item.getAsFile();
        if (blob) {
          const reader = new FileReader();
          reader.onload = (e) => {
            if (focusedSection === 'handScreenshot') {
              setHandScreenshot(e.target?.result as string);
            } else if (focusedSection === 'theoryAttachments') {
              const newAttachment = {
                id: Date.now().toString(),
                image: e.target?.result as string,
                caption: ''
              };
              setTheoryAttachments(prev => [...prev, newAttachment]);
            }
          };
          reader.readAsDataURL(blob);
        }
      }
    }
  }, [focusedSection]);

  const handleDrop = useCallback((event: React.DragEvent, section: 'handScreenshot' | 'theoryAttachments') => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (section === 'handScreenshot') {
            setHandScreenshot(e.target?.result as string);
          } else if (section === 'theoryAttachments') {
            const newAttachment = {
              id: Date.now().toString(),
              image: e.target?.result as string,
              caption: ''
            };
            setTheoryAttachments(prev => [...prev, newAttachment]);
          }
        };
        reader.readAsDataURL(file);
      }
    });
  }, []);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>, section: 'handScreenshot' | 'theoryAttachments') => {
    const files = Array.from(event.target.files || []);
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (section === 'handScreenshot') {
            setHandScreenshot(e.target?.result as string);
          } else if (section === 'theoryAttachments') {
            const newAttachment = {
              id: Date.now().toString(),
              image: e.target?.result as string,
              caption: ''
            };
            setTheoryAttachments(prev => [...prev, newAttachment]);
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const updateCaption = (id: string, caption: string) => {
    setTheoryAttachments(prev =>
      prev.map(attachment =>
        attachment.id === id ? { ...attachment, caption } : attachment
      )
    );
  };

  const removeTheoryAttachment = (id: string) => {
    setTheoryAttachments(prev => prev.filter(attachment => attachment.id !== id));
  };

  React.useEffect(() => {
    const handleFocus = (event: FocusEvent) => {
      const target = event.target as HTMLElement;
      
      if (handScreenshotRef.current?.contains(target)) {
        setFocusedSection('handScreenshot');
      } else if (theoryAttachmentsRef.current?.contains(target)) {
        setFocusedSection('theoryAttachments');
      } else {
        setFocusedSection(null);
      }
    };

    document.addEventListener('focusin', handleFocus);
    document.addEventListener('paste', handleImagePaste);

    return () => {
      document.removeEventListener('focusin', handleFocus);
      document.removeEventListener('paste', handleImagePaste);
    };
  }, [handleImagePaste]);

  return (
    <div className="border border-gray-200 rounded-lg mb-4">
      <div 
        className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50"
        onClick={onToggle}
      >
        <h3 className="font-medium">Hand #{index + 1}</h3>
        {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </div>

      {expanded && (
        <div className="p-4 border-t border-gray-200">
          {/* Hand Screenshot */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <ImageIcon size={16} className="mr-2 text-blue-600" />
              Hand Screenshot
            </label>
            
            {handScreenshot ? (
              <div className="relative">
                <img
                  src={handScreenshot}
                  alt="Hand screenshot"
                  className="max-h-64 rounded-lg object-contain bg-gray-50"
                />
                <button
                  onClick={() => setHandScreenshot(null)}
                  className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-sm hover:bg-gray-100"
                >
                  <X size={16} className="text-gray-500" />
                </button>
              </div>
            ) : (
              <div
                ref={handScreenshotRef}
                onDrop={(e) => handleDrop(e, 'handScreenshot')}
                onDragOver={(e) => e.preventDefault()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center"
                tabIndex={0}
              >
                <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">
                  Paste an image (Ctrl+V / Cmd+V), drag and drop, or click to upload
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  PNG, JPG, GIF up to 10MB
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileSelect(e, 'handScreenshot')}
                  className="hidden"
                  id={`hand-screenshot-${index}`}
                />
                <label
                  htmlFor={`hand-screenshot-${index}`}
                  className="mt-2 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
                >
                  Select File
                </label>
              </div>
            )}
          </div>

          {/* Hand Description */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hand Description
            </label>
            <textarea
              value={handDescription}
              onChange={(e) => setHandDescription(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              rows={2}
              placeholder="Describe what happened in the hand (positions, board, actions)"
            />
          </div>

          {/* Initial Thought */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Initial Thought
            </label>
            <textarea
              value={initialThought}
              onChange={(e) => setInitialThought(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              rows={2}
              placeholder="What were you thinking during the hand?"
            />
          </div>

          {/* Adaptive Thought */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Adaptive Thought
            </label>
            <textarea
              value={adaptiveThought}
              onChange={(e) => setAdaptiveThought(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              rows={2}
              placeholder="What would be a more correct or objective way to think?"
            />
          </div>

          {/* Arguments For Initial Thought */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Arguments For Your Initial Thought
            </label>
            <textarea
              value={forArguments}
              onChange={(e) => setForArguments(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              rows={2}
              placeholder="What made you believe this thought was correct at the time?"
            />
          </div>

          {/* Arguments Against Initial Thought */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Arguments Against Your Initial Thought
            </label>
            <textarea
              value={againstArguments}
              onChange={(e) => setAgainstArguments(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              rows={2}
              placeholder="What contradicts that thinking now that you reflect?"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Spot Type
              </label>
              <Select
                options={spotTypes}
                placeholder="Select spot type..."
                className="text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Position Dynamic
              </label>
              <Select
                options={positions}
                placeholder="Select positions..."
                className="text-sm"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <Tag size={16} className="mr-2" />
              Tags
            </label>
            <Select
              isMulti
              options={[
                { value: 'tilt', label: 'Tilt Decision' },
                { value: 'range', label: 'Range Misread' },
                { value: 'cooler', label: 'Cooler' },
                { value: 'bluff', label: 'Bluff Spot' },
                { value: 'value', label: 'Value Bet' }
              ]}
              placeholder="Add tags..."
              className="text-sm"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <AlertTriangle size={16} className="mr-2" />
              Priority Level
            </label>
            <div className="flex space-x-2">
              {priorities.map((priority) => (
                <button
                  key={priority.value}
                  className={`px-3 py-1 rounded-full text-sm ${priority.color}`}
                >
                  {priority.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <Brain size={16} className="mr-2" />
              Theory Attachments
            </label>
            
            {/* Theory Attachments Display */}
            <div className="space-y-4">
              {theoryAttachments.map((attachment) => (
                <div key={attachment.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <img
                      src={attachment.image}
                      alt="Theory attachment"
                      className="max-h-48 rounded-md"
                    />
                    <button
                      onClick={() => removeTheoryAttachment(attachment.id)}
                      className="p-1 hover:bg-gray-100 rounded-full"
                    >
                      <X size={16} className="text-gray-500" />
                    </button>
                  </div>
                  <textarea
                    value={attachment.caption}
                    onChange={(e) => updateCaption(attachment.id, e.target.value)}
                    placeholder="Add a caption for this image..."
                    className="w-full mt-2 p-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                    rows={2}
                  />
                </div>
              ))}
            </div>

            {/* Theory Upload Area */}
            <div
              ref={theoryAttachmentsRef}
              onDrop={(e) => handleDrop(e, 'theoryAttachments')}
              onDragOver={(e) => e.preventDefault()}
              className="mt-4 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center"
              tabIndex={0}
            >
              <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">
                Paste an image (Ctrl+V / Cmd+V), drag and drop, or click to upload
              </p>
              <p className="mt-1 text-xs text-gray-500">
                PNG, JPG, GIF up to 10MB
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileSelect(e, 'theoryAttachments')}
                className="hidden"
                id={`theory-upload-${index}`}
                multiple
              />
              <label
                htmlFor={`theory-upload-${index}`}
                className="mt-2 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
              >
                Select Files
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HandAnalysis;