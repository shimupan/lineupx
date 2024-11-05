import React from 'react';

interface DescriptionEditorProps {
   value: string;
   onChange: (value: string) => void;
   bgColor?: string; // Optional prop for background color
   textColor?: string; // Optional prop for text color
}

const DescriptionEditor: React.FC<DescriptionEditorProps> = ({
   value,
   onChange,
   bgColor = 'bg-gray-800',
   textColor = 'text-gray-100',
}) => {
   return (
      <div className="w-full">
         <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`min-h-[10rem] w-full px-4 py-3 text-sm border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none overflow-y-auto ${textColor} resize-none whitespace-pre-wrap ${bgColor}`}
            style={{ whiteSpace: 'pre-wrap' }}
         />
      </div>
   );
};

export default DescriptionEditor;