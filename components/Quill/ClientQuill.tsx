'use client';

import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../../app/quil-pdf.css';
import ImageResize from 'quill-image-resize-module-react';

// Quill.register('modules/imageResize', ImageResize);

interface ClientQuillProps {
  value: string;
  onChange: (content: string) => void;
}

const ClientQuill: React.FC<ClientQuillProps> = ({ value, onChange }) => {
  const [isMounted, setIsMounted] = useState(false);

  const modules = {
    toolbar: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, 
       {'indent': '-0.25'}, {'indent': '+0.25'}],
      ['link', 'image'],
      ['clean']
    ],
    clipboard: {
      matchVisual: true,
    }
  };

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image'
  ];

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  // console.log(value)

  return <ReactQuill value={value} onChange={onChange} modules={modules} formats={formats} theme="snow" style={{height: '80vh'}}></ReactQuill> ;
};

export default ClientQuill;