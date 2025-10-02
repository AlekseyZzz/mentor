import React, { useState, useRef, useEffect } from 'react';
import { GripVertical, X, Plus } from 'lucide-react';

interface DraggableNotePanelProps {
  note: string;
  onNoteUpdate?: (note: string) => void;
  canEdit: boolean;
  onDelete?: () => void;
  onAddNote?: () => void;
  headerColor?: string;
  initialPosition?: { x: number; y: number };
}

const DraggableNotePanel: React.FC<DraggableNotePanelProps> = ({
  note,
  onNoteUpdate,
  canEdit,
  onDelete,
  onAddNote,
  headerColor = 'from-blue-500 to-blue-600',
  initialPosition
}) => {
  const [editedNote, setEditedNote] = useState(note);
  const [position, setPosition] = useState(initialPosition || { x: window.innerWidth - 420, y: 100 });
  const [size, setSize] = useState({ width: 350, height: 300 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const panelRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setEditedNote(note);
  }, [note]);

  const handleNoteChange = (value: string) => {
    setEditedNote(value);
    if (onNoteUpdate) {
      onNoteUpdate(value);
    }
  };

  const handleContentClick = () => {
    if (canEdit && textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleMouseDownDrag = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.note-content, .note-textarea')) {
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseDownResize = (e: React.MouseEvent) => {
    e.preventDefault();
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
        e.preventDefault();
        e.stopPropagation();
        const newX = Math.max(0, Math.min(window.innerWidth - size.width, e.clientX - dragStart.x));
        const newY = Math.max(0, Math.min(window.innerHeight - size.height, e.clientY - dragStart.y));
        setPosition({ x: newX, y: newY });
      }

      if (isResizing) {
        e.preventDefault();
        e.stopPropagation();
        const deltaX = e.clientX - resizeStart.x;
        const deltaY = e.clientY - resizeStart.y;
        const newWidth = Math.max(250, Math.min(600, resizeStart.width + deltaX));
        const newHeight = Math.max(200, Math.min(800, resizeStart.height + deltaY));
        setSize({ width: newWidth, height: newHeight });
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (isDragging || isResizing) {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        setIsResizing(false);
      }
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove, true);
      document.addEventListener('mouseup', handleMouseUp, true);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove, true);
        document.removeEventListener('mouseup', handleMouseUp, true);
      };
    }
  }, [isDragging, isResizing, dragStart, resizeStart, size, position]);

  return (
    <div
      ref={panelRef}
      className="fixed bg-white rounded-lg shadow-2xl border-2 border-gray-200 overflow-hidden pointer-events-auto"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
        cursor: isDragging ? 'grabbing' : 'default',
        zIndex: 100
      }}
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      onMouseUp={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
      onKeyUp={(e) => e.stopPropagation()}
      onKeyPress={(e) => e.stopPropagation()}
    >
      <div
        className={`flex items-center justify-between p-3 bg-gradient-to-r ${headerColor} text-white cursor-grab active:cursor-grabbing select-none`}
        onMouseDown={handleMouseDownDrag}
      >
        <div className="flex items-center gap-2">
          <GripVertical size={18} />
          <h4 className="font-semibold">Screenshot Notes</h4>
        </div>
        <div className="flex items-center gap-1">
          {onAddNote && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddNote();
              }}
              className="p-1 hover:bg-black/20 rounded transition-colors"
              title="Add another note"
            >
              <Plus size={18} />
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="p-1 hover:bg-black/20 rounded transition-colors"
              title="Delete note"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      <div
        className="p-4 overflow-y-auto note-content cursor-text"
        style={{ height: `calc(100% - 52px)` }}
        onClick={handleContentClick}
      >
        {canEdit ? (
          <div>
            <textarea
              ref={textareaRef}
              value={editedNote}
              onChange={(e) => handleNoteChange(e.target.value)}
              onKeyDown={(e) => e.stopPropagation()}
              onKeyUp={(e) => e.stopPropagation()}
              onKeyPress={(e) => e.stopPropagation()}
              placeholder="Click here to add notes about this screenshot..."
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
            {note || 'No notes available'}
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
