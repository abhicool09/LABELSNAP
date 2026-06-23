import React, { useState } from 'react';
import UploadZone from './UploadZone';
import { mergePdfs } from '../lib/merge';

export default function MergeTool() {
  const [files, setFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileSelect = (newFile) => {
    if (newFile) {
      setFiles((prev) => [...prev, newFile]);
    }
  };

  const handleRemove = (indexToRemove) => {
    setFiles((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleDragStart = (e, index) => {
    e.dataTransfer.setData('text/plain', index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
    if (dragIndex === dropIndex) return;

    const newFiles = [...files];
    const [draggedFile] = newFiles.splice(dragIndex, 1);
    newFiles.splice(dropIndex, 0, draggedFile);
    setFiles(newFiles);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (files.length < 2) {
      setError('Please select at least 2 PDF files to merge.');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setResult(null);

    try {
      const mergedBlob = await mergePdfs(files);
      const downloadUrl = URL.createObjectURL(mergedBlob);
      setResult({
        downloadUrl,
        filename: 'merged-labels.pdf',
      });
    } catch (err) {
      setError(err.message || 'Error merging PDFs.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="tool-page">
      <div className="tool-header text-center">
        <h1 className="gradient-text">Merge PDF Labels</h1>
        <p className="subtitle">Combine multiple shipping labels into a single file</p>
      </div>

      <div className="glass-card main-tool-card">
        <UploadZone file={null} onFileSelect={handleFileSelect} label="Add a PDF file" />

        {files.length > 0 && (
          <div className="file-list mt-6">
            <h3 className="mb-4">Files to Merge (Drag to reorder)</h3>
            <ul className="files-ul">
              {files.map((file, idx) => (
                <li
                  key={`${file.name}-${idx}`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, idx)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, idx)}
                  className="file-item glass-card flex items-center justify-between p-3 mb-2 cursor-move"
                >
                  <div className="flex items-center gap-3">
                    <span className="drag-handle text-gray-400">::</span>
                    <span className="font-medium text-sm truncate max-w-[200px] sm:max-w-xs">{file.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemove(idx)}
                    className="text-red-400 hover:text-red-300 transition text-sm"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <button
          onClick={handleSubmit}
          className="btn-primary w-full mt-6"
          disabled={files.length < 2 || isProcessing}
        >
          {isProcessing ? <span className="spinner"></span> : 'Merge & Download'}
        </button>

        {error && (
          <div className="alert error mt-6">
            <span className="icon">!</span>
            <p>{error}</p>
          </div>
        )}

        {result && (
          <div className="result-container mt-6 text-center">
            <div className="success-banner mb-4">
              <span className="icon">OK</span>
              <p>Successfully merged {files.length} files.</p>
            </div>
            <a
              href={result.downloadUrl}
              download={result.filename}
              className="btn-success w-full"
            >
              Download Merged PDF
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
