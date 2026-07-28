import React, { useState, useEffect, useCallback } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { UploadCloud, Image as ImageIcon, X, CheckCircle, Loader2 } from 'lucide-react';
import type { ProductFormData } from '../../validation/catalog.schema';
import { Card, CardContent, CardHeader } from '../../../../common/components/ui/Card';
import { FieldError } from '../../../../common/components/ui/FieldError';

interface UploadingFile {
  id: string;
  file: File;
  progress: number;
  previewUrl: string;
}

export const MediaSection: React.FC<{ form: UseFormReturn<ProductFormData> }> = ({ form }) => {
  const { watch, setValue, formState: { errors } } = form;
  const images = watch('images') || [];
  
  const [isDragging, setIsDragging] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);

  // --------------------------------------------------------------------------
  // Mock Upload Infrastructure (To be replaced with S3 Presigned URL logic)
  // --------------------------------------------------------------------------
  const simulateS3Upload = (file: File, uploadId: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      
      setUploadingFiles(prev => prev.map(f => 
        f.id === uploadId ? { ...f, progress: Math.min(progress, 100) } : f
      ));

      if (progress >= 100) {
        clearInterval(interval);
        
        // Remove from uploading queue
        setUploadingFiles(prev => prev.filter(f => f.id !== uploadId));
        
        // Add to form data using a persistent placeholder so mock CRUD survives reloads
        const persistentMockUrl = `https://via.placeholder.com/400x400/eeeeee/999999?text=${encodeURIComponent(file.name)}`;
        
        const currentImages = form.getValues('images') || [];
        setValue('images', [
          ...currentImages,
          { 
            url: persistentMockUrl, 
            isPrimary: currentImages.length === 0, 
            displayOrder: currentImages.length,
            alt: file.name
          }
        ], { shouldValidate: true, shouldDirty: true });
      }
    }, 300); // 1.5 second total fake upload time
  };

  const processFiles = useCallback((files: FileList | File[]) => {
    const validFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
    
    validFiles.forEach(file => {
      const uploadId = Math.random().toString(36).substring(7);
      const previewUrl = URL.createObjectURL(file); // Temporary preview during upload
      
      setUploadingFiles(prev => [...prev, { id: uploadId, file, progress: 0, previewUrl }]);
      simulateS3Upload(file, uploadId);
    });
  }, [form]);

  // --------------------------------------------------------------------------
  // Interaction Handlers (Drag, Drop, Paste, Remove)
  // --------------------------------------------------------------------------
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (e.clipboardData?.files && e.clipboardData.files.length > 0) {
        processFiles(e.clipboardData.files);
      }
    };
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [processFiles]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
    e.target.value = ''; // Reset input so same file can be selected again if needed
  };

  const handleRemove = (index: number) => {
    const remainingImages = images.filter((_, i) => i !== index);
    const normalizedImages = remainingImages.map((image, i) => ({
      ...image,
      isPrimary: remainingImages.some(item => item.isPrimary) ? image.isPrimary : i === 0,
      displayOrder: i,
    }));
    setValue('images', normalizedImages, { shouldValidate: true, shouldDirty: true });
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-bold text-text-primary">Product Images</h2>
        <p className="text-sm text-text-secondary mt-1">Drag & drop, paste from clipboard, or click to browse.</p>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        
        {/* The Dropzone */}
        <div 
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative flex flex-col items-center justify-center w-full min-h-[160px] border-2 border-dashed rounded-lg transition-colors duration-200 ease-in-out
            ${isDragging ? 'border-brand-primary bg-brand-primary/5' : 'border-border-default hover:border-brand-primary/50 hover:bg-surface-secondary'}`}
        >
          <input 
            type="file" 
            accept="image/*" 
            multiple 
            onChange={handleFileInput} 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
            aria-label="Upload product images"
          />
          <div className="flex flex-col items-center gap-2 pointer-events-none">
            <UploadCloud size={40} className={isDragging ? 'text-brand-primary' : 'text-text-muted'} />
            <p className="text-sm font-medium text-text-primary">
              Drop images here or click to upload
            </p>
            <p className="text-xs text-text-muted">High-res JPEG, PNG, or WebP</p>
          </div>
        </div>

        {/* Uploading Queue UI */}
        {uploadingFiles.length > 0 && (
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-bold text-text-secondary uppercase tracking-wider">Uploading</h3>
            {uploadingFiles.map(file => (
              <div key={file.id} className="flex items-center gap-4 p-3 rounded-md border border-border-default bg-surface-secondary">
                <div className="h-12 w-12 shrink-0 rounded overflow-hidden">
                  <img src={file.previewUrl} alt="uploading preview" className="h-full w-full object-cover opacity-50" />
                </div>
                <div className="flex-1 flex flex-col gap-2">
                  <div className="flex items-center justify-between text-sm font-medium text-text-primary">
                    <span className="truncate">{file.file.name}</span>
                    <span className="text-brand-primary">{file.progress}%</span>
                  </div>
                  <div className="w-full bg-border-default h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-brand-primary h-full transition-all duration-300 ease-out" 
                      style={{ width: `${file.progress}%` }} 
                    />
                  </div>
                </div>
                <Loader2 size={20} className="text-text-muted animate-spin shrink-0" />
              </div>
            ))}
          </div>
        )}

        {/* Completed/Persisted Images Grid */}
        {images.length > 0 && (
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-bold text-text-secondary uppercase tracking-wider">Attached Media</h3>
            <div className="flex flex-wrap gap-4">
              {images.map((img, idx) => (
                <div key={idx} className="relative w-28 h-28 shrink-0 bg-surface-secondary rounded-md border border-border-default overflow-hidden group shadow-sm">
                  <img src={img.url} alt="product media" className="w-full h-full object-cover" />
                  
                  {/* Destructive Action */}
                  <button 
                    type="button" 
                    onClick={() => handleRemove(idx)} 
                    aria-label={`Remove image ${idx + 1}`}
                    className="absolute top-1 right-1 flex h-8 w-8 items-center justify-center rounded-md bg-danger/90 hover:bg-danger text-surface-primary shadow-sm"
                  >
                    <X size={16} strokeWidth={2.5} />
                  </button>
                  
                  {img.isPrimary && (
                    <span className="absolute bottom-0 left-0 right-0 bg-brand-primary/90 backdrop-blur-sm text-surface-primary text-[10px] text-center font-bold py-1 uppercase tracking-wider">
                      Primary
                    </span>
                  )}
                  
                  {/* Success Indicator Overlay */}
                  <div className="absolute top-1 left-1 opacity-0 group-hover:opacity-100 transition-opacity bg-success text-surface-primary rounded-full p-0.5">
                     <CheckCircle size={14} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <FieldError error={errors.images?.message} />
      </CardContent>
    </Card>
  );
};