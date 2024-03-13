import { useState, useCallback, useMemo, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';

type DropzoneProps = {
   setFile: React.Dispatch<React.SetStateAction<string>>;
   style?: React.CSSProperties;
};

const baseStyle: React.CSSProperties = {
   flex: 1,
   display: 'flex',
   flexDirection: 'column',
   alignItems: 'center',
   padding: '20px',
   borderWidth: 2,
   borderRadius: 2,
   borderColor: '#eeeeee',
   borderStyle: 'dashed',
   backgroundColor: '#fafafa',
   color: '#bdbdbd',
   outline: 'none',
   transition: 'border .24s ease-in-out',
};

const focusedStyle = {
   borderColor: '#2196f3',
};

const acceptStyle = {
   borderColor: '#00e676',
};

const rejectStyle = {
   borderColor: '#ff1744',
};

const Dropzone: React.FC<DropzoneProps> = ({ setFile }) => {
   const [preview, setPreview] = useState<string | ArrayBuffer | null>(null);
   const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 640);
   const onDrop = useCallback((acceptedFiles: File[]) => {
      const file = new FileReader();
      file.readAsDataURL(acceptedFiles[0]);
      file.onloadend = () => {
         const result = file.result;
         setPreview(result);
         if (typeof result === 'string') {
            setFile(result);
         }
      };
   }, []);
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
      }),
      [isFocused, isDragAccept, isDragReject],
   );

   useEffect(() => {
      const handleResize = () => {
         setIsMobileView(window.innerWidth <= 640);
      };

      window.addEventListener('resize', handleResize);

      return () => {
         window.removeEventListener('resize', handleResize);
      };
   }, []);

   const styles = isMobileView
      ? {}
      : {
           width: '10vw', // 50% of the viewport width
           height: '15vh', // 50% of the viewport height
        };

   return (
      <>
         <div>
            <div {...getRootProps({ style: { ...style, ...styles } })}>
               <input {...getInputProps()} />
               {isDragActive ? (
                  <p>Drop the files here ...</p>
               ) : (
                  <p>
                     Drag 'n' drop pictures here
                  </p>
               )}
            </div>
            {preview && (
               <div className="text-black mb-5" style={styles}>
                  <div>
                     <h4>Accepted files</h4>
                     <img
                        src={preview as string}
                        alt="Upload preview"
                        style={styles}
                     />
                  </div>
               </div>
            )}
         </div>
      </>
   );
};

export default Dropzone;
