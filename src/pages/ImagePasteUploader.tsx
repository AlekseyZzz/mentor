import React, { useEffect, useRef, useState } from 'react';
import { supabase } from '../lib/supabase';

const ImagePasteUploader: React.FC = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const pasteAreaRef = useRef<HTMLDivElement>(null);

  const uploadToR2 = async (blob: Blob): Promise<string> => {
    const reader = new FileReader();

    return new Promise((resolve, reject) => {
      reader.onloadend = async () => {
        try {
          const base64 = reader.result as string;
          const fileName = `screenshot-${Date.now()}.png`;

          const { data: { session } } = await supabase.auth.getSession();
          if (!session) {
            throw new Error('Not authenticated');
          }

          const response = await fetch(
            `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/upload-screenshot`,
            {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${session.access_token}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                file: base64,
                fileName: fileName,
                contentType: blob.type || 'image/png',
              }),
            }
          );

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Upload failed');
          }

          const result = await response.json();
          resolve(result.url);
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(blob);
    });
  };

  useEffect(() => {
    const handlePaste = async (event: ClipboardEvent) => {
      if (!event.clipboardData) return;

      const items = event.clipboardData.items;
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.indexOf('image') !== -1) {
          const blob = item.getAsFile();
          if (blob) {
            const src = URL.createObjectURL(blob);
            setImageSrc(src);

            setUploading(true);
            try {
              const url = await uploadToR2(blob);
              setUploadedUrl(url);
              console.log('Uploaded to R2:', url);
            } catch (error) {
              console.error('Upload error:', error);
              alert('Ошибка загрузки изображения');
            } finally {
              setUploading(false);
            }
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
      {uploading && <p style={{ color: '#666' }}>Загрузка...</p>}
      {imageSrc && (
        <div style={{ marginTop: '20px' }}>
          <img src={imageSrc} alt="Pasted" style={{ maxWidth: '100%' }} />
          {uploadedUrl && (
            <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
              <p>Загружено в R2:</p>
              <a href={uploadedUrl} target="_blank" rel="noopener noreferrer">
                {uploadedUrl}
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImagePasteUploader;
