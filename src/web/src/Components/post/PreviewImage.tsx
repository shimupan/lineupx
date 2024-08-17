import React, { useState } from 'react';
import { CDN_URL } from '../../Constants';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

interface PreviewImageProps {
   images: string[];
   onClick: () => void;
}

const PreviewImage: React.FC<PreviewImageProps> = ({ images, onClick }) => {
   const [currentImage, setCurrentImage] = useState(0);

   const handlePrevClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
   };

   const handleNextClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      setCurrentImage((prev) => (prev + 1) % images.length);
   };

   return (
      <div
         className="absolute top-0 left-0 w-full h-full bg-black rounded-lg cursor-pointer overflow-hidden"
         onClick={onClick}
      >
         <div className="relative w-full h-full flex items-center justify-center">
            <img
               src={`${CDN_URL}/${images[currentImage]}`}
               alt="Preview"
               className="max-w-full max-h-full object-contain"
            />
            <div className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 rounded-full p-2">
               <FaArrowLeft
                  className="text-white cursor-pointer"
                  size={24}
                  onClick={handlePrevClick}
               />
            </div>
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 rounded-full p-2">
               <FaArrowRight
                  className="text-white cursor-pointer"
                  size={24}
                  onClick={handleNextClick}
               />
            </div>
         </div>
      </div>
   );
};

export default PreviewImage;
