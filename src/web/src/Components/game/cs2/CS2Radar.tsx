import React, { useState, useEffect } from 'react';
import { MapInteractionCSS } from 'react-map-interaction';
import { Coordinate } from '../../../global.types';
import Dot from '../../upload/Dot.tsx';

interface RadarMapProps {
   mapImage: string;
   mapName: string;
   coordinates: Coordinate[];
   complementCoordinates: Coordinate[];
   activeButton: string | null;
   selectedDot: string;
   setSelectedDot: React.Dispatch<React.SetStateAction<string>>;
   grenadeIcons: { [key: string]: string };
}

const RadarMap: React.FC<RadarMapProps> = ({
   mapImage,
   mapName,
   coordinates,
   complementCoordinates,
   activeButton,
   selectedDot,
   setSelectedDot,
   grenadeIcons,
}) => {
   const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
   const [isMapLoaded, setIsMapLoaded] = useState(false);

   useEffect(() => {
      const handleResize = () => {
         setIsMobile(window.innerWidth <= 768);
      };
      window.addEventListener('resize', handleResize);
      return () => {
         window.removeEventListener('resize', handleResize);
      };
   }, []);

   return (
      <div className="relative mb-12">
         <MapInteractionCSS>
            <img
               src={mapImage}
               alt={mapName}
               onLoad={() => setIsMapLoaded(true)}
               style={{
                  width: isMobile ? '100%' : '1000%',
                  maxWidth: '700px',
                  margin: '0 auto',
                  display: 'block',
               }}
            />
            {/*
            Bit confusing, but basically 
            1) if there is no active button and no selected dot, then show all dots
            2) if there is an active button, then show only dots that match the active button
            3) if there is a selected dot, then show only dots that match the selected dot
            4) if there is an active button and a selected dot, then show only dots that match both
            */}
            {isMapLoaded &&
               !activeButton &&
               complementCoordinates &&
               coordinates.map((coordinate, index) => (
                  <Dot
                     key={index}
                     coordinate={coordinate}
                     selectedDot={selectedDot}
                     setSelectedDot={setSelectedDot}
                     mode="CS2Lineups"
                  />
               ))}
            {isMapLoaded && activeButton
               ? complementCoordinates
                    .filter(
                       (coordinate) =>
                          coordinate.name === activeButton.toLowerCase(),
                    )
                    .map((coordinate, index) => (
                       <Dot
                          key={coordinate.name + index}
                          coordinate={coordinate}
                          selectedDot={selectedDot}
                          setSelectedDot={setSelectedDot}
                          mode="CS2Lineups"
                          special={coordinate.post}
                          abilityIconUrl={
                             grenadeIcons[
                                activeButton as keyof typeof grenadeIcons
                             ]
                          }
                          onTouchEnd={() => setSelectedDot(coordinate.name)}
                       />
                    ))
               : complementCoordinates.map((coordinate, index) => (
                    <Dot
                       key={coordinate.name + index}
                       coordinate={coordinate}
                       selectedDot={selectedDot}
                       setSelectedDot={setSelectedDot}
                       mode="CS2Lineups"
                       special={coordinate.post}
                    />
                 ))}
         </MapInteractionCSS>
      </div>
   );
};

export default RadarMap;
