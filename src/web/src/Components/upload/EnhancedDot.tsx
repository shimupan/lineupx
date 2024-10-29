import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PostType } from '../../global.types';

type EnhancedDotProps = {
  coordinate: { x: number; y: number; name: string };
  selectedDot: string;
  setSelectedDot: React.Dispatch<React.SetStateAction<string>>;
  mode: string;
  special?: PostType;
  abilityIconUrl?: string;
  onTouchEnd?: (event: React.TouchEvent) => void;
};

const EnhancedDot: React.FC<EnhancedDotProps> = ({
  coordinate,
  selectedDot,
  setSelectedDot,
  mode,
  special,
  abilityIconUrl,
  onTouchEnd
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  let top, left;
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  if (mode === 'CS2Lineups Form') {
    top = isMobile ? coordinate.y * (screenHeight / 4500) : coordinate.y / 3;
    left = isMobile ? coordinate.x * (screenWidth / 2100) : coordinate.x / 2.95;
  } else {
    top = isMobile ? coordinate.y * (screenHeight / 4200) : coordinate.y / 3;
    left = isMobile ? coordinate.x * (screenWidth / 2100) : coordinate.x / 2.95;
  }

  function handleRedirect() {
    navigate(`/game/${special?.game}/${special?._id}`, {
      state: { postData: special },
    });
  }

  function handleClick() {
    if (special) {
      handleRedirect();
    } else {
      setSelectedDot(selectedDot === coordinate.name ? '' : coordinate.name);
      setIsHovered(true);
    }
  }

  return (
    (selectedDot === coordinate.name || selectedDot === '' || special) && (
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(selectedDot === coordinate.name)}
        onClick={handleClick}
        onTouchEnd={onTouchEnd}
        title={coordinate.name}
        className="absolute cursor-pointer transition-all duration-300"
        style={{ top: `${top}px`, left: `${left}px` }}
      >
        {abilityIconUrl ? (
          <div className="relative group">
            <div className="absolute -inset-2 bg-blue-500/20 rounded-full blur-sm group-hover:bg-blue-500/30 transition-all duration-300" />
            <img
              src={abilityIconUrl}
              alt="Ability Icon"
              className="relative w-8 h-8 transform transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute -inset-2 animate-pulse-ring" />
          </div>
        ) : (
          <div className="relative group">
            <div className="absolute -inset-2 bg-blue-500/20 rounded-full blur-sm group-hover:bg-blue-500/30 transition-all duration-300" />
            <div className={`
              relative w-4 h-4 rounded-full 
              transition-all duration-300
              ${selectedDot === coordinate.name 
                ? 'bg-blue-500 shadow-lg shadow-blue-500/50' 
                : 'bg-blue-400 group-hover:bg-blue-500'
              }
              transform group-hover:scale-110
              before:content-[''] before:absolute before:inset-0
              before:rounded-full before:shadow-[0_0_12px_rgba(59,130,246,0.5)]
              before:transition-opacity before:duration-300
              before:opacity-0 group-hover:before:opacity-100
            `}>
              <div className="absolute -inset-2 animate-pulse-ring" />
            </div>
          </div>
        )}
        {isHovered && (
          <div className="absolute bg-gray-900/90 text-white px-3 py-1.5 rounded-lg shadow-lg z-50 whitespace-nowrap text-sm font-medium backdrop-blur-sm"
               style={{
                 bottom: '100%',
                 left: '50%',
                 transform: 'translateX(-50%) translateY(-8px)',
               }}>
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900/90 rotate-45" />
            {coordinate.name}
          </div>
        )}
      </div>
    )
  );
};


export default EnhancedDot;