import React, { useState } from 'react';
import { X } from 'lucide-react';

interface ScreenshotNoteModalProps {
  screenshotUrl: string;
  onSave: (note: string) => void;
  onSkip: () => void;
}

const ScreenshotNoteModal: React.FC<ScreenshotNoteModalProps> = ({ screenshotUrl, onSave, onSkip }) => {
  const [note, setNote] = useState('');

  const handleSave = () => {
    onSave(note);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Add note to screenshot</h3>
          <button
            onClick={onSkip}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div className="relative bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={screenshotUrl}
              alt="Screenshot"
              className="w-full h-48 object-contain"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your thoughts about this screenshot
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add your thoughts, observations, or questions about this screenshot..."
              rows={4}
              maxLength={500}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
            />
            <div className="text-xs text-gray-500 mt-1">
              {note.length} / 500 characters
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 p-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onSkip}
            className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Skip
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
          >
            Save Note
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScreenshotNoteModal;
