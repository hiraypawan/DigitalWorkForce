'use client';

import { useState, useRef } from 'react';
import { Upload, File, X, CheckCircle, AlertCircle, Download, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ResumeUploadProps {
  currentResumeUrl?: string;
  onUploadSuccess?: (resumeUrl: string) => void;
  onRemove?: () => void;
  className?: string;
  variant?: 'default' | 'compact';
}

export function ResumeUpload({ 
  currentResumeUrl, 
  onUploadSuccess, 
  onRemove, 
  className = '',
  variant = 'default'
}: ResumeUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleFileUpload = async (file: File) => {
    setError(null);
    setIsUploading(true);
    setUploadProgress(0);

    // Validate file
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      setError('Invalid file type. Only PDF and Word documents are allowed.');
      setIsUploading(false);
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setError('File size too large. Maximum size is 5MB.');
      setIsUploading(false);
      return;
    }

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/users/resume', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setUploadProgress(100);
        onUploadSuccess?.(data.resumeUrl);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to upload resume');
      }
    } catch (error) {
      console.error('Resume upload error:', error);
      setError('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleRemove = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/users/resume', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        onRemove?.();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to remove resume');
      }
    } catch (error) {
      console.error('Resume removal error:', error);
      setError('Failed to remove resume. Please try again.');
    }
  };

  const getFileName = (url: string) => {
    return url.split('/').pop()?.split('_').slice(1).join('_') || 'resume.pdf';
  };

  if (variant === 'compact' && currentResumeUrl) {
    return (
      <div className={cn('flex items-center gap-3 p-3 bg-gray-900/30 border border-gray-700 rounded-lg', className)}>
        <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center">
          <File className="w-5 h-5 text-slate-300" />
        </div>
        <div className="flex-1">
          <p className="font-medium text-white text-sm">{getFileName(currentResumeUrl)}</p>
          <p className="text-xs text-gray-400">Resume uploaded</p>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={currentResumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-blue-400 hover:text-blue-300 transition-colors"
            title="View Resume"
          >
            <Eye className="w-4 h-4" />
          </a>
          <a
            href={currentResumeUrl}
            download
            className="p-2 text-green-400 hover:text-green-300 transition-colors"
            title="Download Resume"
          >
            <Download className="w-4 h-4" />
          </a>
          <button
            onClick={handleRemove}
            className="p-2 text-red-400 hover:text-red-300 transition-colors"
            title="Remove Resume"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Upload Area */}
      {!currentResumeUrl && (
        <div
          className={cn(
            'relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300',
            dragActive 
              ? 'border-blue-400 bg-blue-500/10 scale-105' 
              : 'border-gray-600 hover:border-gray-500',
            isUploading && 'pointer-events-none opacity-50'
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="space-y-4">
            <div className="w-16 h-16 bg-gray-800 border border-gray-700 rounded-lg flex items-center justify-center mx-auto">
              {isUploading ? (
                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Upload className="w-8 h-8 text-gray-400" />
              )}
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {isUploading ? 'Uploading Resume...' : 'Upload Your Resume'}
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                {isUploading 
                  ? 'Please wait while we process your file...' 
                  : 'Drag and drop your resume here, or click to browse'
                }
              </p>
              <p className="text-xs text-gray-500">
                Supports PDF, DOC, DOCX • Max size: 5MB
              </p>
            </div>
            
            {!isUploading && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                Choose File
              </button>
            )}
            
            {/* Progress Bar */}
            {isUploading && (
              <div className="w-full max-w-xs mx-auto">
                <div className="bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-2">{uploadProgress}% uploaded</p>
              </div>
            )}
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileInput}
            className="hidden"
          />
        </div>
      )}
      
      {/* Uploaded Resume Display */}
      {currentResumeUrl && !isUploading && (
        <div className="p-6 bg-gray-900/50 border border-gray-700 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-medium text-white">Resume Uploaded Successfully</h3>
                <p className="text-sm text-gray-400">{getFileName(currentResumeUrl)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <a
                href={currentResumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600/20 text-blue-300 rounded-lg hover:bg-blue-600/30 transition-colors text-sm"
              >
                <Eye className="w-4 h-4" />
                View
              </a>
              <a
                href={currentResumeUrl}
                download
                className="flex items-center gap-2 px-4 py-2 bg-green-600/20 text-green-300 rounded-lg hover:bg-green-600/30 transition-colors text-sm"
              >
                <Download className="w-4 h-4" />
                Download
              </a>
              <button
                onClick={handleRemove}
                className="flex items-center gap-2 px-4 py-2 bg-red-600/20 text-red-300 rounded-lg hover:bg-red-600/30 transition-colors text-sm"
              >
                <X className="w-4 h-4" />
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-900/20 border border-red-800 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <p className="text-red-300 text-sm">{error}</p>
          <button
            onClick={() => setError(null)}
            className="ml-auto text-red-400 hover:text-red-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
