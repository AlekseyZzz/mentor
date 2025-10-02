import React, { useState, useRef, useEffect } from 'react';
import { X, CreditCard as Edit2, Save, GripVertical } from 'lucide-react';

interface DraggableNotePanelProps {
  note: string;
  onNoteUpdate?: (note: string) => void;
  canEdit: boolean;
}

const DraggableNotePanel: React.FC<DraggableNotePanelProps> = ({ note, onNoteUpdate, canEdit }) => {
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [editedNote, setEditedNote] = useState(note);
  const [position, setPosition] = useState({ x: window.innerWidth - 420, y: 100 });
  const [size, setSize] = useState({ width: 350, height: 300 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setEditedNote(note);
    setIsEditingNote(false);
  }, [note]);

  const handleSaveNote = () => {
    if (onNoteUpdate) {
      onNoteUpdate(editedNote);
    }
    setIsEditingNote(false);
  };

  const handleMouseDownDrag = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.note-content, .note-textarea')) {
      return;
    }
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseDownResize = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newX = Math.max(0, Math.min(window.innerWidth - size.width, e.clientX - dragStart.x));
        const newY = Math.max(0, Math.min(window.innerHeight - size.height, e.clientY - dragStart.y));
        setPosition({ x: newX, y: newY });
      }

      if (isResizing) {
        const deltaX = e.clientX - resizeStart.x;
        const deltaY = e.clientY - resizeStart.y;
        const newWidth = Math.max(250, Math.min(600, resizeStart.width + deltaX));
        const newHeight = Math.max(200, Math.min(800, resizeStart.height + deltaY));
        setSize({ width: newWidth, height: newHeight });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, dragStart, resizeStart, size]);

  return (
    <div
      ref={panelRef}
      className="fixed bg-white rounded-lg shadow-2xl border-2 border-gray-200 overflow-hidden"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
        cursor: isDragging ? 'grabbing' : 'default',
        zIndex: 60
      }}
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      onMouseUp={(e) => e.stopPropagation()}
    >
      <div
        className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white cursor-grab active:cursor-grabbing select-none"
        onMouseDown={handleMouseDownDrag}
      >
        <div className="flex items-center gap-2">
          <GripVertical size={18} />
          <h4 className="font-semibold">Screenshot Notes</h4>
        </div>
        <div className="flex items-center gap-2">
          {canEdit && !isEditingNote && (
            <button
              onClick={() => setIsEditingNote(true)}
              className="p-1 hover:bg-blue-700 rounded transition-colors"
              title="Edit note"
            >
              <Edit2 size={16} />
            </button>
          )}
          {canEdit && isEditingNote && (
            <button
              onClick={handleSaveNote}
              className="p-1 hover:bg-blue-700 rounded transition-colors"
              title="Save note"
            >
              <Save size={16} />
            </button>
          )}
        </div>
      </div>

      <div
        className="p-4 overflow-y-auto note-content"
        style={{ height: `calc(100% - 52px)` }}
      >
        {isEditingNote ? (
          <div>
            <textarea
              value={editedNote}
              onChange={(e) => setEditedNote(e.target.value)}
              placeholder="Add your thoughts about this screenshot..."
              maxLength={500}
              className="w-full h-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none note-textarea"
              style={{ minHeight: '200px' }}
            />
            <div className="text-xs text-gray-500 mt-2">
              {editedNote.length} / 500 characters
            </div>
          </div>
        ) : (
          <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
            {note || (canEdit ? 'Click edit to add notes about this screenshot' : 'No notes available')}
          </div>
        )}
      </div>

      <div
        className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize"
        onMouseDown={handleMouseDownResize}
        style={{
          background: 'linear-gradient(135deg, transparent 50%, #94a3b8 50%)',
        }}
      />
    </div>
  );
};

export default DraggableNotePanel;
