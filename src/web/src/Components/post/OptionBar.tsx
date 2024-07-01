import React from 'react';

interface OptionBarProps {
   onShare: () => void;
   onReport: () => void;
}

const OptionBar: React.FC<OptionBarProps> = ({ onShare, onReport }) => {
   return (
      <div className="absolute right-0 top-full mt-2 bg-white border border-gray-300 rounded shadow-md z-10">
         <button
            className="block w-full px-4 py-2 text-left text-gray-800 hover:bg-gray-100"
            onClick={onShare}
         >
            Share
         </button>
         <button
            className="block w-full px-4 py-2 text-left text-gray-800 hover:bg-gray-100"
            onClick={onReport}
         >
            Report
         </button>
      </div>
   );
};

export default OptionBar;