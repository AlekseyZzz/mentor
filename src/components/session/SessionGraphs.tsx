import React from 'react';
import { useDropzone } from 'react-dropzone';
import { LineChart, Image, X } from 'lucide-react';

interface SessionGraphsProps {
  graphs: Array<{ id: string; file: File; comment: string }>;
  onAddGraphs: (files: File[]) => void;
  onRemoveGraph: (id: string) => void;
  onUpdateComment: (id: string, comment: string) => void;
}

const SessionGraphs: React.FC<SessionGraphsProps> = ({
  graphs,
  onAddGraphs,
  onRemoveGraph,
  onUpdateComment,
}) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    onDrop: onAddGraphs
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center ${
          isDragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
        }`}
      >
        <input {...getInputProps()} />
        <LineChart className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">
          Drag and drop session graphs here, or click to select files
        </p>
        <p className="mt-1 text-xs text-gray-500">
          PNG, JPG, GIF up to 10MB
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {graphs.map((graph) => (
          <div key={graph.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center">
                <Image size={20} className="text-gray-500 mr-2" />
                <span className="text-sm font-medium">{graph.file.name}</span>
              </div>
              <button
                onClick={() => onRemoveGraph(graph.id)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X size={16} className="text-gray-500" />
              </button>
            </div>
            
            <div className="mb-3">
              <img
                src={URL.createObjectURL(graph.file)}
                alt="Session graph"
                className="rounded-md max-h-64 w-full object-contain bg-gray-50"
              />
            </div>
            
            <textarea
              value={graph.comment}
              onChange={(e) => onUpdateComment(graph.id, e.target.value)}
              placeholder="Add comments about this graph..."
              className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
              rows={2}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SessionGraphs;