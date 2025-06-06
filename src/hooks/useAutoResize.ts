import { useEffect } from 'react';

export const useAutoResize = (ref: React.RefObject<HTMLTextAreaElement>) => {
  useEffect(() => {
    const textarea = ref.current;
    if (!textarea) return;

    const adjustHeight = () => {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    };

    textarea.addEventListener('input', adjustHeight);
    window.addEventListener('resize', adjustHeight);
    
    // Initial adjustment
    adjustHeight();

    return () => {
      textarea.removeEventListener('input', adjustHeight);
      window.removeEventListener('resize', adjustHeight);
    };
  }, [ref]);
};