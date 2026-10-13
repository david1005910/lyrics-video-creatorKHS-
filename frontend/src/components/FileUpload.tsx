import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Music, Image, File, X } from 'lucide-react';

interface FileUploadProps {
  type: 'audio' | 'image';
  file: File | null;
  onFileChange: (file: File | null) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  type,
  file,
  onFileChange
}) => {
  const acceptedFileTypes = {
    audio: {
      'audio/*': ['.mp3', '.wav', '.ogg', '.frac']
    },
    image: {
      'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.bmp', '.pbm', '.pgm', '.ppm', '.tif', '.tiff']
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileChange(acceptedFiles[0]);
    }
  }, [onFileChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes[type],
    maxFiles: 1,
    multiple: false
  });

  const handleClearFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFileChange(null);
  };

  const getFilePreview = () => {
    if (!file) return null;

    if (type === 'image') {
      const objectUrl = URL.createObjectURL(file);
      return (
        <div className="relative w-full h-32 overflow-hidden rounded-xl">
          <img
            src={objectUrl}
            alt="Preview"
            className="w-full h-full object-cover"
            onLoad={() => URL.revokeObjectURL(objectUrl)}
          />
        </div>
      );
    }

    if (type === 'audio') {
      const objectUrl = URL.createObjectURL(file);
      return (
        <div className="w-full">
          <audio
            controls
            className="w-full rounded-lg"
            onLoad={() => URL.revokeObjectURL(objectUrl)}
          >
            <source src={objectUrl} />
            Your browser does not support audio playback.
          </audio>
        </div>
      );
    }

    return null;
  };

  const getIcon = () => {
    switch (type) {
      case 'audio':
        return <Music className="h-12 w-12 text-secondary" />;
      case 'image':
        return <Image className="h-12 w-12 text-accent" />;
      default:
        return <File className="h-12 w-12 text-primary" />;
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'audio':
        return 'Audio File';
      case 'image':
        return 'Background Image';
      default:
        return 'File';
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-2 text-lg font-medium text-slate-700">{getTitle()}</div>
      <div
        {...getRootProps()}
        className={`glass-card rounded-softer p-4 transition-all duration-300 cursor-pointer float-3d
          ${isDragActive
            ? 'shadow-glow-primary border-primary'
            : 'hover:shadow-soft-lg'
          }
          ${file ? 'border-accent/30' : ''}
        `}
      >
        <input {...getInputProps()} />

        {file ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {type === 'audio' && <Music className="h-5 w-5 text-secondary" />}
                {type === 'image' && <Image className="h-5 w-5 text-accent" />}
                <span className="text-sm font-medium text-slate-700 truncate max-w-[200px]">
                  {file.name}
                </span>
              </div>
              <button
                onClick={handleClearFile}
                className="p-1.5 rounded-full glass-card hover:shadow-glow-secondary transition-all duration-300"
              >
                <X className="h-4 w-4 text-slate-500" />
              </button>
            </div>
            {getFilePreview()}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-white/80 to-white/40 shadow-soft mb-4">
              {getIcon()}
            </div>
            <p className="text-sm font-medium text-slate-600">
              Drag & drop {type === 'audio' ? 'an audio file' : 'an image'}, or click to select
            </p>
            <p className="mt-1 text-xs text-slate-400">
              {type === 'audio' ? 'MP3, WAV, OGG, M4A' : 'JPG, PNG, GIF, WEBP'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
