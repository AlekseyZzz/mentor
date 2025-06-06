import React, { useState } from 'react';
import { Brain, Plus, X } from 'lucide-react';
import AutoResizeTextArea from '../common/AutoResizeTextArea';

interface MentalGameNote {
  id: string;
  note_text: string;
}

interface MentalGameNotesProps {
  notes: MentalGameNote[];
  onAddNote: (note: string) => void;
  onRemoveNote: (id: string) => void;
}

const MentalGameNotes: React.FC<MentalGameNotesProps> = ({
  notes,
  onAddNote,
  onRemoveNote,
}) => {
  const [newNote, setNewNote] = useState('');
  const maxLength = 250;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newNote.trim()) {
      onAddNote(newNote.trim());
      setNewNote('');
    }
  };

  return (
    <div className="mb-6 bg-gray-50 rounded-lg p-6">
      <h3 className="text-lg font-medium mb-4 flex items-center">
        <Brain className="mr-2 text-blue-600" size={20} />
        Notable Mental Game Moments
      </h3>

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="relative">
          <AutoResizeTextArea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value.slice(0, maxLength))}
            placeholder="Describe a significant mental game moment or observation..."
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
          <span className="absolute bottom-2 right-2 text-xs text-gray-500">
            {maxLength - newNote.length} characters remaining
          </span>
        </div>
        <div className="mt-2 flex justify-end">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!newNote.trim()}
            className={`flex items-center px-4 py-2 rounded-md text-white ${
              newNote.trim()
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            <Plus size={16} className="mr-2" />
            Add Note
          </button>
        </div>
      </form>

      {notes.length > 0 && (
        <div className="space-y-3">
          {notes.map((note, index) => (
            <div
              key={note.id}
              className="relative bg-white p-4 rounded-lg border border-gray-200 group animate-fade-in"
            >
              <button
                onClick={() => onRemoveNote(note.id)}
                className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={16} />
              </button>
              <p className="text-gray-700 pr-8">
                {index + 1}. {note.note_text}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MentalGameNotes;