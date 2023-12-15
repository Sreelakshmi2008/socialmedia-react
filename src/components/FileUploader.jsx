import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

const FileUploader = ({ onFileSelected }) => {
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      onFileSelected(file);
    }
  }, [onFileSelected]);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });
  const dropzoneStyles = {
    border: '2px dashed #cccccc',
    borderRadius: '4px',
    padding: '20px',
    textAlign: 'center',
    cursor: 'pointer',
  };

  return (
    <div {...getRootProps()} style={dropzoneStyles}>
      <input {...getInputProps()} />
     
      <p>Drag & drop or click to select a file</p>
    </div>
  );
};



export default FileUploader;
