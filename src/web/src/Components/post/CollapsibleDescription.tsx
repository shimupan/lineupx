import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md';

interface CollapsibleDescriptionProps {
  description: string;
  maxHeight?: number;
}

const CollapsibleDescription = ({ description, maxHeight = 100 }: CollapsibleDescriptionProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      setShowButton(contentRef.current.scrollHeight > maxHeight);
    }
  }, [description, maxHeight]);

  return (
    <div className="relative">
      <div
        ref={contentRef}
        style={{ maxHeight: isExpanded ? 'none' : `${maxHeight}px` }}
        className="overflow-hidden transition-all duration-300 ease-in-out"
      >
        <ReactMarkdown
          className="whitespace-pre-wrap"
          components={{
            p: ({ children }) => (
              <p className="whitespace-pre-line">{children}</p>
            ),
          }}
        >
          {description}
        </ReactMarkdown>
      </div>
      
      {showButton && !isExpanded && (
        <div className="bg-gradient-to-t from-gray-500 to-transparent absolute bottom-0 left-0 right-0 h-8 pointer-events-none" />
      )}
      
      {showButton && (
        <button
          className="w-full flex items-center justify-center gap-1 text-sm text-white-500 hover:text-blue-600 mt-2 transition-colors duration-200"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <span>{isExpanded ? 'Show Less' : 'Show More'}</span>
          {isExpanded ? (
            <MdKeyboardArrowUp className="w-5 h-5" />
          ) : (
            <MdKeyboardArrowDown className="w-5 h-5" />
          )}
        </button>
      )}
    </div>
  );
};

export default CollapsibleDescription;