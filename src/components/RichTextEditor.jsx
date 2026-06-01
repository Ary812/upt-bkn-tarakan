"use client";

import React, { useRef, useEffect } from 'react';
import 'suneditor/src/assets/suneditor.css';
import suneditor from 'suneditor';
import plugins from 'suneditor/plugins';
import { uploadImageAction } from '@/lib/actions';
import { toast } from 'sonner';
import imageCompression from 'browser-image-compression';

export default function RichTextEditor({ value, onChange, placeholder }) {
  const txtAreaRef = useRef(null);
  const editorRef = useRef(null);
  const isUpdatingRef = useRef(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && txtAreaRef.current && !editorRef.current) {
      editorRef.current = suneditor.create(txtAreaRef.current, {
        plugins: plugins,
        minHeight: '350px',
        placeholder: placeholder || "Tulis konten di sini...",
        buttonList: [
          ['undo', 'redo'],
          ['font', 'fontSize', 'paragraphStyle', 'blockStyle'],
          ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
          ['fontColor', 'backgroundColor', 'textStyle'],
          ['removeFormat'],
          ['outdent', 'indent'],
          ['align', 'hr', 'list', 'lineHeight'],
          ['table', 'link', 'image', 'video'],
          ['fullScreen', 'showBlocks', 'codeView']
        ],
        resizingBar: false,
        imageResizing: true,
        font: [
          'Arial', 'Comic Sans MS', 'Courier New', 'Impact',
          'Georgia','tahoma', 'Trebuchet MS', 'Verdana'
        ],
        events: {
          onChange: (params) => {
            isUpdatingRef.current = true;
            if (onChange) onChange(params.data);
            setTimeout(() => { isUpdatingRef.current = false; }, 0);
          },
          onImageUploadBefore: (params) => {
            (async () => {
              try {
                const originalFile = params.info.files[0];
                if (!originalFile) return;
                
                const toastId = toast.loading("Mengunggah gambar...");
                
                const options = { maxSizeMB: 0.5, maxWidthOrHeight: 1200, useWebWorker: true };
                const compressedBlob = await imageCompression(originalFile, options);

                // Explicitly reconstruct a File to preserve .name and .type after compression
                const mimeType = compressedBlob.type || originalFile.type || "image/jpeg";
                const ext = mimeType.split("/")[1]?.replace("jpeg", "jpg") || "jpg";
                const safeName = `upload_${Date.now()}.${ext}`;
                const safeFile = new File([compressedBlob], safeName, { type: mimeType });
                
                const formData = new FormData();
                formData.append('file', safeFile);
                
                const url = await uploadImageAction(formData);
                
                toast.success("Gambar berhasil ditambahkan!", { id: toastId });
                
                // Manually insert the image into the editor since we hijacked the upload
                params.$.html.insert(`<img src="${url}" alt="${safeName}" style="max-width: 100%;" />`);
                
              } catch (err) {
                toast.error(`Gagal mengunggah gambar: ${err.message || 'Coba lagi.'}`);
              }
            })();
            return false; // Stop default process
          }
        }
      });
      
      // Set initial value
      if (value) {
        editorRef.current.$.html.set(value);
      }
    }

    return () => {
      if (editorRef.current) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (editorRef.current && value !== undefined) {
      if (!isUpdatingRef.current && value !== editorRef.current.$.html.get()) {
        editorRef.current.$.html.set(value);
      }
    }
  }, [value]);

  return (
    <div className="bg-canvas rounded-xl border border-gray-200 overflow-hidden shadow-sm transition-all focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10">
      <textarea ref={txtAreaRef} />
      <style jsx global>{`
        .sun-editor {
          border: none !important;
          font-family: inherit !important;
        }
        .sun-editor .se-toolbar {
          background-color: #fafafa !important;
          outline: none !important;
          border-bottom: 1px solid #f3f4f6 !important;
          padding: 8px !important;
        }
        .sun-editor .se-resizing-bar {
          display: none !important;
        }
        .sun-editor-editable {
          padding: 20px 24px !important;
          font-family: inherit !important;
          font-size: 1rem !important;
          line-height: 1.6;
        }
      `}</style>
    </div>
  );
}
