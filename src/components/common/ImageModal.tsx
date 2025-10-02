import React, { useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight, CreditCard as Edit2, Save } from 'lucide-react';

interface ImageModalProps {
  imageUrl: string;
  onClose: () => void;
  alt?: string;
  images?: string[];
  currentIndex?: number;
  onNavigate?: (index: number) => void;
  note?: string;
  onNoteUpdate?: (note: string) => void;
  canEdit?: boolean;
}

const ImageModal: React.FC<ImageModalProps> = ({
  imageUrl,
  onClose,
  alt = 'Screenshot',
  images = [],
  currentIndex = 0,
  onNavigate,
  note = '',
  onNoteUpdate,
  canEdit = false
}) => {
  const hasMultipleImages = images.length > 1;
  const canGoPrevious = hasMultipleImages && currentIndex > 0;
  const canGoNext = hasMultipleImages && currentIndex < images.length - 1;
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [editedNote, setEditedNote] = useState(note);

  useEffect(() => {
    setEditedNote(note);
    setIsEditingNote(false);
  }, [note, currentIndex]);

  const handleSaveNote = () => {
    if (onNoteUpdate) {
      onNoteUpdate(editedNote);
    }
    setIsEditingNote(false);
  };

  const handlePrevious = () => {
    if (canGoPrevious && onNavigate) {
      onNavigate(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (canGoNext && onNavigate) {
      onNavigate(currentIndex + 1);
    }
  };

  useEffect(() => {
    const handleKeyboard = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrevious();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (e.deltaY < 0) {
        handlePrevious();
      } else if (e.deltaY > 0) {
        handleNext();
      }
    };

    document.addEventListener('keydown', handleKeyboard);
    document.addEventListener('wheel', handleWheel, { passive: false });
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyboard);
      document.removeEventListener('wheel', handleWheel);
      document.body.style.overflow = 'unset';
    };
  }, [onClose, currentIndex, canGoPrevious, canGoNext]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 text-white hover:bg-white/10 rounded-full transition-colors z-10"
        title="Close (Esc)"
      >
        <X size={24} />
      </button>

      {hasMultipleImages && (
        <div className="absolute top-4 left-4 text-white text-sm bg-black/50 px-3 py-1 rounded-full z-10">
          {currentIndex + 1} / {images.length}
        </div>
      )}

      {canGoPrevious && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handlePrevious();
          }}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-3 text-white bg-black/50 hover:bg-black/70 rounded-full transition-colors z-10"
          title="Previous (← or scroll up)"
        >
          <ChevronLeft size={32} />
        </button>
      )}

      {canGoNext && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-3 text-white bg-black/50 hover:bg-black/70 rounded-full transition-colors z-10"
          title="Next (→ or scroll down)"
        >
          <ChevronRight size={32} />
        </button>
      )}

      <div
        className="relative flex gap-4 max-w-7xl max-h-full"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={imageUrl}
          alt={alt}
          className="max-w-full max-h-[90vh] object-contain rounded-lg"
        />

        {(note || canEdit) && (
          <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-xl p-4 max-w-xs w-full self-start max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-gray-900">Notes</h4>
              {canEdit && !isEditingNote && (
                <button
                  onClick={() => setIsEditingNote(true)}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                  title="Edit note"
                >
                  <Edit2 size={16} />
                </button>
              )}
              {canEdit && isEditingNote && (
                <button
                  onClick={handleSaveNote}
                  className="p-1 hover:bg-gray-100 rounded transition-colors text-blue-600"
                  title="Save note"
                >
                  <Save size={16} />
                </button>
              )}
            </div>

            {isEditingNote ? (
              <textarea
                value={editedNote}
                onChange={(e) => setEditedNote(e.target.value)}
                placeholder="Add your thoughts about this screenshot..."
                rows={6}
                maxLength={500}
                className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ) : (
              <p className="text-sm text-gray-700 whitespace-pre-wrap">
                {note || (canEdit && 'Click edit to add notes')}
              </p>
            )}

            {isEditingNote && (
              <div className="text-xs text-gray-500 mt-2">
                {editedNote.length} / 500 characters
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageModal;
