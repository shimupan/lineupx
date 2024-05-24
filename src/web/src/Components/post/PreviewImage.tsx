import React, { useState, useEffect } from 'react';
import { CDN_URL } from '../../Constants';

interface PreviewImageProps {
  images: string[];
  currentImage: number;
  onClick: () => void;
}

const PreviewImage: React.FC<PreviewImageProps> = ({ images, currentImage, onClick }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsAnimating(true);
    const timeout = setTimeout(() => {
      setIsAnimating(false);
    }, 500);

    return () => clearTimeout(timeout);
  }, [currentImage]);

  return (
    <div className="absolute top-0 left-0 w-full max-h-80 min-w-[250px] min-h-[150px] rounded-lg cursor-pointer">
      <img
        src={`${CDN_URL}/${images[currentImage]}`}
        alt="Preview"
        className={`w-full max-h-80 min-w-[250px] min-h-[150px] rounded-lg cursor-pointer transition-all duration-500 ${
          isAnimating ? 'opacity-0 transform scale-0.95' : 'opacity-100 transform scale-1'
        }`}
        onClick={onClick}
      />
    </div>
  );
};

export default PreviewImage;