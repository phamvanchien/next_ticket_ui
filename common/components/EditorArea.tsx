import dynamic from 'next/dynamic';
import React, { Dispatch, SetStateAction } from 'react';
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

interface EditorAreaProps {
  setValue: Dispatch<SetStateAction<string>>;
  value: string;
  placeholder?: string;
  toolbarExtra?: boolean
}

const EditorArea: React.FC<EditorAreaProps> = ({ setValue, value, placeholder, toolbarExtra }) => {
  const modules = {
    toolbar: [
      // [{ header: '1' }, { header: '2' }, { font: [] }],
      [{ size: [] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image', 'code-block'],
      // ['clean'],
      [{ 'align': [] }],
      ['customCode'],
    ],
  };

  // if (toolbarExtra) {
  //   modules.toolbar.push(
  //     [{ header: '1' }, { header: '2' }, { font: [] }],
  //     [{ size: [] }]
  //   )
  // }

  return (
    <ReactQuill
      theme="snow"
      value={value}
      onChange={setValue}
      modules={modules}
      placeholder={placeholder}
    />
  );
};

export default EditorArea;