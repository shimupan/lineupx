import React from 'react';

interface DeletePopupProps {
   isOpen: boolean;
   onClose: () => void;
   title: string;
   children: React.ReactNode;
}

const DeletePopup: React.FC<DeletePopupProps> = ({
   isOpen,
   onClose,
   title,
   children,
}) => {
   if (!isOpen) return null;

   return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
         <div className="bg-gray-800 rounded-lg shadow-lg max-w-md w-full mx-4">
            <div className="flex justify-between items-center border-b border-gray-700 p-4">
               <h2 className="text-xl font-bold text-white">{title}</h2>
               <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-white transition-colors"
               >
                  ✕
               </button>
            </div>
            <div className="p-4">{children}</div>
         </div>
      </div>
   );
};

export default DeletePopup;
