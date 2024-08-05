import React, { useState, useEffect } from 'react';
import { CDN_URL } from '../../Constants';

// TODO - Add a left right arrow to cycle between images in the preview
interface PreviewImageProps {
   images: string[];
   currentImage: number;
   onClick: () => void;
}

const PreviewImage: React.FC<PreviewImageProps> = ({
   images,
   currentImage,
   onClick,
}) => {
   const [isAnimating, setIsAnimating] = useState(false);

   useEffect(() => {
      setIsAnimating(true);
      const timeout = setTimeout(() => {
         setIsAnimating(false);
      }, 500);

      return () => clearTimeout(timeout);
   }, [currentImage]);

   return (
      <div
         className="absolute top-0 left-0 w-full h-full bg-black rounded-lg cursor-pointer overflow-hidden"
         onClick={onClick}
      >
         <div className="relative w-full h-full flex items-center justify-center">
            <img
               src={`${CDN_URL}/${images[currentImage]}`}
               alt="Preview"
               className={`max-w-full max-h-full object-contain transition-all duration-500 ${
                  isAnimating
                     ? 'opacity-0 transform scale-95'
                     : 'opacity-100 transform scale-100'
               }`}
            />
         </div>
      </div>
   );
};

export default PreviewImage;
