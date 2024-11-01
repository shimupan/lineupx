import React from 'react';

interface DescriptionEditorProps {
   value: string;
   onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export const DescriptionEditor: React.FC<DescriptionEditorProps> = ({
   value,
   onChange,
}) => {
   return (
      <div className="flex flex-col space-y-2 w-full">
         <textarea
            placeholder="Enter the description of the lineup...

Formatting tips:
- Use **bold** for important text
- Use *italic* for emphasis
- Use - or * for bullet points
- Use 1. 2. 3. for numbered lists
- Leave a blank line for paragraphs"
            value={value}
            onChange={onChange}
            className="flex text-black items-center w-full px-5 py-4 h-40 mr-2 text-sm font-medium outline-none focus:bg-grey-400 mb-7 placeholder:text-grey-700 bg-[#edf2f7] text-dark-grey-900 rounded-2xl font-mono"
         />
      </div>
   );
};

export default DescriptionEditor;
