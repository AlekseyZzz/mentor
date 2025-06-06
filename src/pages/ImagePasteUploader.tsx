import React, { useEffect, useRef, useState } from 'react';

const ImagePasteUploader: React.FC = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const pasteAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handlePaste = (event: ClipboardEvent) => {
      if (!event.clipboardData) return;

      const items = event.clipboardData.items;
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.indexOf('image') !== -1) {
          const blob = item.getAsFile();
          if (blob) {
            const src = URL.createObjectURL(blob);
            setImageSrc(src);
          }
        }
      }
    };

    const pasteArea = pasteAreaRef.current;
    if (pasteArea) {
      pasteArea.addEventListener('paste', handlePaste);
    }

    return () => {
      if (pasteArea) {
        pasteArea.removeEventListener('paste', handlePaste);
      }
    };
  }, []);

  return (
    <div
      ref={pasteAreaRef}
      contentEditable
      style={{
        border: '2px dashed #ccc',
        padding: '20px',
        minHeight: '200px',
        textAlign: 'center',
      }}
    >
      <p>Вставьте изображение сюда (Ctrl+V)</p>
      {imageSrc && (
        <div style={{ marginTop: '20px' }}>
          <img src={imageSrc} alt="Pasted" style={{ maxWidth: '100%' }} />
        </div>
      )}
    </div>
  );
};

export default ImagePasteUploader;
