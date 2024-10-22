import React from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { CgMaximize, CgMinimize } from 'react-icons/cg';

interface ZoomableImageProps {
   src: string;
   alt: string;
   isFullScreen: boolean;
   onFullScreenToggle: () => void;
}

const ZoomableImage: React.FC<ZoomableImageProps> = ({
   src,
   alt,
   isFullScreen,
   onFullScreenToggle,
}) => {
   return (
      <div className="relative w-full h-full">
         <TransformWrapper
            initialScale={1}
            initialPositionX={0}
            initialPositionY={0}
         >
            {({ zoomIn, zoomOut, resetTransform }) => (
               <>
                  <div
                     className={`absolute top-2 left-2 z-10 flex space-x-2 ${isFullScreen ? 'top-4 left-4' : ''}`}
                  >
                     <button
                        onClick={() => zoomIn()}
                        className="bg-gray-800 text-white p-2 rounded"
                     >
                        +
                     </button>
                     <button
                        onClick={() => zoomOut()}
                        className="bg-gray-800 text-white p-2 rounded"
                     >
                        -
                     </button>
                     <button
                        onClick={() => resetTransform()}
                        className="bg-gray-800 text-white p-2 rounded"
                     >
                        Reset
                     </button>
                  </div>
                  <TransformComponent
                     wrapperStyle={{
                        width: '100%',
                        height: '100%',
                     }}
                     contentStyle={{
                        width: '100%',
                        height: '100%',
                     }}
                  >
                     <img
                        src={src}
                        alt={alt}
                        style={{
                           width: '100%',
                           height: '100%',
                           objectFit: 'contain',
                        }}
                     />
                  </TransformComponent>
               </>
            )}
         </TransformWrapper>
         <button
            id="fullscreen-button"
            className="absolute bottom-0 right-0 mb-2 mr-2 text-white p-2 rounded transform transition-transform duration-500 hover:scale-110"
            onClick={onFullScreenToggle}
         >
            {isFullScreen ? <CgMinimize size={24} /> : <CgMaximize size={24} />}
         </button>
      </div>
   );
};

export default ZoomableImage;
