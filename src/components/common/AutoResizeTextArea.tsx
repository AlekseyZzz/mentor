import React, { useRef } from 'react';
import { useAutoResize } from '../../hooks/useAutoResize';

interface AutoResizeTextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  className?: string;
}

const AutoResizeTextArea: React.FC<AutoResizeTextAreaProps> = ({ 
  value, 
  onChange, 
  className = '', 
  ...props 
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  useAutoResize(textareaRef);

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={onChange}
      className={`resize-none overflow-hidden ${className}`}
      {...props}
    />
  );
};

export default AutoResizeTextArea;