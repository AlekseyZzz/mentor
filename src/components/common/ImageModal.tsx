import React, { useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import DraggableNotePanel from './DraggableNotePanel';

interface NotePanel {
  id: string;
  content: string;
  color: string;
  position: { x: number; y: number };
}

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

const HEADER_COLORS = [
  'from-blue-500 to-blue-600',
  'from-emerald-500 to-emerald-600',
  'from-purple-500 to-purple-600',
  'from-amber-500 to-amber-600',
  'from-rose-500 to-rose-600',
  'from-cyan-500 to-cyan-600',
  'from-indigo-500 to-indigo-600',
  'from-teal-500 to-teal-600'
];

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
  const [notePanels, setNotePanels] = useState<NotePanel[]>([
    {
      id: '1',
      content: note || '',
      color: HEADER_COLORS[0],
      position: { x: window.innerWidth - 420, y: 100 }
    }
  ]);
  const [initializedNote, setInitializedNote] = useState<string>(note || '');

  const hasMultipleImages = images.length > 1;
  const canGoPrevious = hasMultipleImages && currentIndex > 0;
  const canGoNext = hasMultipleImages && currentIndex < images.length - 1;

  useEffect(() => {
    if (note !== initializedNote) {
      setNotePanels([{
        id: '1',
        content: note || '',
        color: HEADER_COLORS[0],
        position: { x: window.innerWidth - 420, y: 100 }
      }]);
      setInitializedNote(note || '');
    }
  }, [imageUrl]);

  const handleAddNote = () => {
    const randomColor = HEADER_COLORS[Math.floor(Math.random() * HEADER_COLORS.length)];
    const newPanel: NotePanel = {
      id: Date.now().toString(),
      content: '',
      color: randomColor,
      position: {
        x: Math.max(50, Math.min(window.innerWidth - 400, Math.random() * (window.innerWidth - 400))),
        y: Math.max(50, Math.min(window.innerHeight - 350, Math.random() * (window.innerHeight - 350)))
      }
    };
    setNotePanels([...notePanels, newPanel]);
  };

  const handleDeleteNote = (id: string) => {
    if (notePanels.length === 1) {
      setNotePanels([{
        ...notePanels[0],
        content: ''
      }]);
      if (onNoteUpdate) {
        onNoteUpdate('');
      }
    } else {
      const updatedPanels = notePanels.filter(panel => panel.id !== id);
      setNotePanels(updatedPanels);
      if (onNoteUpdate) {
        const combinedNotes = updatedPanels.map(p => p.content).filter(c => c).join('\n\n---\n\n');
        onNoteUpdate(combinedNotes);
      }
    }
  };

  const handleNoteUpdate = (id: string, content: string) => {
    const updatedPanels = notePanels.map(panel =>
      panel.id === id ? { ...panel, content } : panel
    );
    setNotePanels(updatedPanels);

    if (onNoteUpdate) {
      const combinedNotes = updatedPanels.map(p => p.content).filter(c => c).join('\n\n---\n\n');
      onNoteUpdate(combinedNotes);
    }
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
      const target = e.target as HTMLElement;
      const isTextInput = target.tagName === 'TEXTAREA' ||
                         target.tagName === 'INPUT' ||
                         target.isContentEditable;

      if (isTextInput && e.key !== 'Escape') {
        return;
      }

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
    <>
      <div
        className="fixed inset-0 z-50 bg-black/80"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-white hover:bg-white/10 rounded-full transition-colors z-10 pointer-events-auto"
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
          className="absolute left-4 top-1/2 -translate-y-1/2 p-3 text-white bg-black/50 hover:bg-black/70 rounded-full transition-colors z-10 pointer-events-auto"
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
          className="absolute right-4 top-1/2 -translate-y-1/2 p-3 text-white bg-black/50 hover:bg-black/70 rounded-full transition-colors z-10 pointer-events-auto"
          title="Next (→ or scroll down)"
        >
          <ChevronRight size={32} />
        </button>
      )}

      <div
        className="relative max-w-7xl max-h-full pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={imageUrl}
          alt={alt}
          className="max-w-full max-h-[90vh] object-contain rounded-lg"
        />
      </div>
    </div>

    {notePanels.map((panel) => (
      <DraggableNotePanel
        key={panel.id}
        note={panel.content}
        onNoteUpdate={(content) => handleNoteUpdate(panel.id, content)}
        canEdit={canEdit}
        onDelete={() => handleDeleteNote(panel.id)}
        onAddNote={canEdit ? handleAddNote : undefined}
        headerColor={panel.color}
        initialPosition={panel.position}
      />
    ))}
  </>
  );
};

export default ImageModal;
