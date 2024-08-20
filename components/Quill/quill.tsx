"use client"

import "@/app/quil-pdf.scss"
import React, { useState, useEffect, useCallback } from 'react';
import { Editor, EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Document from "@tiptap/extension-document"
import Underline from '@tiptap/extension-underline';
import TextStyle from '@tiptap/extension-text-style';
import Heading from '@tiptap/extension-heading'
import Image from '@tiptap/extension-image';
import { FaBold, FaItalic } from "react-icons/fa";
import { MdKeyboardTab, MdOutlineFormatItalic, MdOutlineInsertLink } from "react-icons/md";
import { CiImageOn } from "react-icons/ci";

const TiptapEditor = () => {
  const [content, setContent] = useState('');
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Document,
      Link,
      Underline,
      TextStyle,
      Heading.configure({
        levels: [1, 2, 3],
      }),
      Image,
    ],
    content: content,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });

  const handleChange = useCallback((value:any) => {
    setContent(value);
    if (editor) {
      editor.commands.setContent(value);
    }
  }, [editor]);

  const toggleBold = () => {
    if (editor) {
      editor.chain().focus().toggleBold().run();
      setIsBold((prev)=>!prev);
    }
  };

  const toggleItalic = () => {
    if (editor) {
      editor.chain().focus().toggleItalic().run();
      setIsItalic((prev)=>!prev);
    }
  };

  const addBlockquote = () => {
    if (editor) {
      editor.chain().focus().setBlockquote().run();
    }
  };

  const removeBlockquote = () => {
    if (editor) {
      editor.chain().focus().unsetBlockquote().run();
    }
  };

  const insertLink = () => {
    if (editor) {
      const url = prompt('Enter the URL');
      editor.chain().focus().setLink({ href: url as string }).run();
    }
  };

  const insertImage = () => {
    if (editor) {
      const url = prompt('Enter the image URL');
      editor.chain().focus().setImage({ src: url as string }).run();
    }
  };

  const toggleUnderline = () => {
    if (editor) {
      editor.chain().focus().toggleUnderline().run();
    }
  };

  const setTextSize = (size:any) => {
    // if (editor) {
    //   editor.chain().focus().setTextStyle({ fontSize: size }).run();
    // }
  };


  if(editor)
  return (
    <div>
      <div className="flex gap-1 items-center justify-center w-screen mb-5">
        <button className={`h-6 w-6 ${isBold ? "bg-gray-300" : ""} rounded-md hover:bg-gray-200 flex items-center justify-center duration-200`} onClick={toggleBold}><FaBold/></button>
        <button className={`h-6 w-6 ${isItalic ? "bg-gray-300" : ""} rounded-md hover:bg-gray-200 flex items-center justify-center duration-200`} onClick={toggleItalic}><FaItalic/></button>
        <button className={`h-6 w-6  rounded-md hover:bg-gray-300 flex items-center justify-center duration-200`} onClick={addBlockquote}><MdKeyboardTab/></button>
        <button className={`h-6 w-6  rounded-md hover:bg-gray-300 flex items-center justify-center duration-200`} onClick={removeBlockquote}><MdKeyboardTab className="rotate-180" /></button>

        <button onClick={insertLink}><MdOutlineInsertLink/></button>
        <button onClick={insertImage}><CiImageOn/></button>
        <button onClick={toggleUnderline}>Underline</button>
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}>H1</button>
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}>H2</button>
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''} >H3</button>
        
      </div>
      <EditorContent editor={editor} />
      {/* <textarea
        value={content}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Enter your text here..."
      /> */}
    </div>
  );
};

export default TiptapEditor;