import React, { useState, useCallback, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';

type DropzoneProps = {
   setFile: (file: string, preview: string) => void;
   style?: React.CSSProperties;
};

const baseStyle: React.CSSProperties = {
   display: 'flex',
   flexDirection: 'column',
   alignItems: 'center',
   justifyContent: 'center',
   padding: '20px',
   borderWidth: 2,
   borderRadius: 8,
   borderColor: '#E2E8F0',
   borderStyle: 'dashed',
   backgroundColor: '#F7FAFC',
   color: '#718096',
   outline: 'none',
   transition: 'border .24s ease-in-out',
   cursor: 'pointer',
   height: '150px',
};

const focusedStyle = {
   borderColor: '#3B82F6',
};

const acceptStyle = {
   borderColor: '#38A169',
};

const rejectStyle = {
   borderColor: '#E53E3E',
};

const Dropzone: React.FC<DropzoneProps> = ({ setFile, style: propStyle }) => {
   const [preview, setPreview] = useState<string | null>(null);

   const onDrop = useCallback(
      (acceptedFiles: File[]) => {
         const file = new FileReader();
         file.readAsDataURL(acceptedFiles[0]);
         file.onloadend = () => {
            const result = file.result;
            if (typeof result === 'string') {
               setPreview(result);
               setFile(result, result); // Send both file data and preview
            }
         };
      },
      [setFile],
   );

   const {
      getRootProps,
      getInputProps,
      isDragActive,
      isFocused,
      isDragAccept,
      isDragReject,
   } = useDropzone({
      onDrop,
      maxFiles: 1,
      accept: {
         'image/jpeg': [],
         'image/png': [],
         'image/*': ['.jpeg', '.png'],
      },
   });

   const style = useMemo(
      () => ({
         ...baseStyle,
         ...(isFocused ? focusedStyle : {}),
         ...(isDragAccept ? acceptStyle : {}),
         ...(isDragReject ? rejectStyle : {}),
         ...propStyle,
      }),
      [isFocused, isDragAccept, isDragReject, propStyle],
   );

   return (
      <div className="w-full">
         <div {...getRootProps({ style })}>
            <input {...getInputProps()} />
            {isDragActive ? (
               <p className="text-sm">Drop the files here ...</p>
            ) : (
               <div className="flex flex-col items-center">
                  <svg
                     xmlns="http://www.w3.org/2000/svg"
                     className="w-8 h-8 mb-2 text-gray-500"
                     fill="none"
                     viewBox="0 0 24 24"
                     stroke="currentColor"
                  >
                     <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                     />
                  </svg>
                  <p className="mb-2 text-sm text-gray-500">
                     <span className="font-semibold">Click to upload</span> or
                     drag and drop. Preferred 16:9 aspect ratio.
                  </p>
               </div>
            )}
         </div>
         {preview && (
            <div className="mt-4">
               <img
                  src={preview}
                  alt="Upload preview"
                  className="object-contain w-full h-40 rounded-md"
               />
            </div>
         )}
      </div>
   );
};

export default Dropzone;
