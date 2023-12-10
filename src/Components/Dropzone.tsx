
import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'


type DropzoneProps = {
   setFile: React.Dispatch<React.SetStateAction<File[]>>;
};

const Dropzone: React.FC<DropzoneProps> = ({ setFile }) => {
   setFile([]);
   
  const onDrop = useCallback((acceptedFiles: File) => {
    console.log(acceptedFiles);
  }, [])
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})
  
   return (
      <>
         <div>
            <h1>Dropzone</h1>
         </div>

         <div {...getRootProps()}>
            <input {...getInputProps()} />
            {isDragActive ? (
               <p>Drop the files here ...</p>
            ) : (
               <p>Drag 'n' drop some files here, or click to select files</p>
            )}
         </div>
      </>
   );
};

export default Dropzone;
