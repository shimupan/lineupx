import React from 'react';

interface LoadingSpinnerProps {
   size?: number;
   color?: string;
   secondaryColor?: string;
   speed?: number;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
   size = 50,
   color = '#3498db',
   secondaryColor = '#f3f3f3',
   speed = 1,
}) => {
   const spinnerStyle: React.CSSProperties = {
      width: `${size}px`,
      height: `${size}px`,
      border: `4px solid ${secondaryColor}`,
      borderTop: `4px solid ${color}`,
      borderRadius: '50%',
      animation: `spin ${1 / speed}s linear infinite`,
   };

   return (
      <div className="flex justify-center items-center">
         <style>
            {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
         </style>
         <div style={spinnerStyle}></div>
      </div>
   );
};

export default LoadingSpinner;
