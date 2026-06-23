import React, { useRef, useState } from 'react';

function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1048576).toFixed(1) + ' MB';
}

export default function UploadZone({ file, onFileSelect, accept = '.pdf', label }) {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) onFileSelect(droppedFile);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e) => {
    const selected = e.target.files?.[0];
    if (selected) onFileSelect(selected);
  };

  const zoneClass = [
    'upload-zone',
    dragOver && 'upload-zone--drag-over',
    file && 'upload-zone--has-file',
  ].filter(Boolean).join(' ');

  return (
    <div
      className={zoneClass}
      onClick={handleClick}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
      />

      {!file ? (
        <>
          <svg className="upload-zone__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          <p className="upload-zone__title">{label || 'Drop your PDF here'}</p>
          <p className="upload-zone__subtitle">or click to browse files</p>
        </>
      ) : (
        <div className="upload-zone__file-info">
          <div className="upload-zone__file-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </div>
          <div className="upload-zone__file-details">
            <p className="upload-zone__file-name">{file.name}</p>
            <p className="upload-zone__file-size">{formatSize(file.size)}</p>
          </div>
          <button
            type="button"
            className="upload-zone__change"
            onClick={(e) => {
              e.stopPropagation();
              inputRef.current?.click();
            }}
          >
            Change file
          </button>
        </div>
      )}
    </div>
  );
}
