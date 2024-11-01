import React from 'react';

interface DescriptionEditorProps {
   value: string;
   onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const DescriptionEditor: React.FC<DescriptionEditorProps> = ({
   value,
   onChange,
}) => {
   const markdownTips = [
      {
         label: "Bold",
         example: "**bold text**",
         description: "Makes text bold"
      },
      {
         label: "Italic",
         example: "*italic text*",
         description: "Adds italic emphasis"
      },
      {
         label: "Bullet List",
         example: "- Item 1\n- Item 2\n- Item 3",
         description: "Creates an unordered list"
      },
      {
         label: "Numbered List",
         example: "1. First item\n2. Second item\n3. Third item",
         description: "Creates an ordered list"
      },
      {
         label: "Headers",
         example: "# Large Header\n## Medium Header\n### Small Header",
         description: "Creates headings of different sizes"
      },
   ];

   return (
      <div className="w-full">
         <div className="mb-2 flex gap-2 flex-wrap">
            {markdownTips.map((tip, index) => (
               <div 
                  key={index}
                  className="relative group cursor-help"
               >
                  <div className="px-3 py-1 text-sm border rounded-md bg-gray-50 hover:bg-gray-100 text-black">
                     {tip.label}
                  </div>
                  <div className="invisible group-hover:visible absolute z-10 w-64 p-2 mt-2 text-sm bg-white border rounded-lg shadow-lg text-black">
                     <p className="font-medium mb-1">{tip.description}</p>
                     <pre className="bg-gray-50 p-2 rounded text-xs whitespace-pre-wrap text-black">
                        {tip.example}
                     </pre>
                  </div>
               </div>
            ))}
         </div>
         
         <textarea
            placeholder="Enter the description..."
            value={value}
            onChange={onChange}
            className="w-full px-4 py-3 h-40 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none bg-gray-50 text-black"
         />
      </div>
   );
};

export default DescriptionEditor;