import React, { useContext, useEffect, useRef } from 'react';
import { MdOutlineFlag } from 'react-icons/md';
import shareIcon from '../../assets/svg/share.svg';
import { AuthContext } from '../../App'; // Adjust the import path as necessary

interface PostOptionBarProps {
   onClose: () => void;
   onShare: () => void;
   onReport: () => void;
   style?: React.CSSProperties;
}

const PostOptionBar: React.FC<PostOptionBarProps> = ({
   onClose,
   onReport,
   onShare,
   style,
}) => {
   const ref = useRef<HTMLDivElement>(null);
   const Auth = useContext(AuthContext); // Use AuthContext to get the authentication status

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
            onClick={onShare}
         >
            <img
               src={shareIcon}
               alt="Share"
               className="w-4 h-4 mr-2"
               style={{ filter: 'invert(100%)' }}
            />
            Share
         </button>
         {Auth?.accessToken && (
            <button
               className="flex items-center w-full text-white px-3 py-2 text-left text-sm hover:bg-gray-800 transition-colors duration-200"
               onClick={onReport}
            >
               <MdOutlineFlag className="w-4 h-4 mr-2" />
               Report
            </button>
         )}
      </div>
   );
};

export default PostOptionBar;
