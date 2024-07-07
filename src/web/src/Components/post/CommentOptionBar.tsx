import React, { useEffect, useRef } from 'react';
import { MdDelete, MdEdit } from 'react-icons/md';

interface CommentOptionBarProps {
   onClose: () => void;
   onDelete: () => void;
   onEdit: () => void;
   style?: React.CSSProperties;
}

const CommentOptionBar: React.FC<CommentOptionBarProps> = ({
   onClose,
   onDelete,
   onEdit,
   style,
}) => {
   const ref = useRef<HTMLDivElement>(null);

   useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
         if (ref.current && !ref.current.contains(event.target as Node)) {
            onClose();
         }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => {
         document.removeEventListener('mousedown', handleClickOutside);
      };
   }, [onClose]);

   return (
      <div
         ref={ref}
         className="absolute bg-[#181818] rounded-md shadow-md z-10 overflow-hidden"
         style={style}
      >
         <button
            className="flex items-center w-full text-white px-3 py-2 text-left text-sm hover:bg-gray-800 transition-colors duration-200"
            onClick={onEdit}
         >
            <MdEdit className="w-4 h-4 mr-2" /> 
            Edit
         </button>
         <button
            className="flex items-center w-full text-white px-3 py-2 text-left text-sm hover:bg-gray-800 transition-colors duration-200"
            onClick={onDelete}
         >
            <MdDelete className="w-4 h-4 mr-2" />
            Delete
         </button>
      </div>
   );
};

export default CommentOptionBar;
