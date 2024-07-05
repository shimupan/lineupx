import { useState } from 'react';

type TooltipProps = {
   text: string;
   children: React.ReactNode;
};

const Tooltip = ({ text, children }: TooltipProps) => {
   const [showTooltip, setShowTooltip] = useState(false);

   return (
      <div className="relative flex items-center">
         <div
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
         >
            {children}
         </div>
         {showTooltip && (
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded-md z-10">
               {text}
            </div>
         )}
      </div>
   );
};

export default Tooltip;
