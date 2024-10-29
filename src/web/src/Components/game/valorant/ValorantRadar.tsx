import React from 'react';
import { MapInteractionCSS } from 'react-map-interaction';
import { EnhancedDot } from '../../../Components';
import { Coordinate, ValorantMaps, ValorantAgent } from '../../../global.types';

type ValorantRadarProps = {
  isMapLoading: boolean;
  maps?: ValorantMaps['data'];
  mapName?: string;
  isMobile: boolean;
  isMapLoaded: boolean;
  setIsMapLoaded: (loaded: boolean) => void;
  selectedAbility: ValorantAgent['data'][0]['abilities'][0] | null | undefined;
  selectedDot: string;
  setSelectedDot: React.Dispatch<React.SetStateAction<string>>;
  coordinates: Coordinate[];
  complementCoordinates: Coordinate[];
  agent: ValorantAgent['data'][0] | null;
};

const ValorantRadar: React.FC<ValorantRadarProps> = ({
  isMapLoading,
  maps,
  mapName,
  isMobile,
  isMapLoaded,
  setIsMapLoaded,
  selectedAbility,
  selectedDot,
  setSelectedDot,
  coordinates,
  complementCoordinates,
  agent
}) => {
  return (
    <div className="flex flex-1 pb-48">
      <div className="flex-1 flex flex-col">
        <div className="flex justify-center items-center">
          <div className="flex flex-col sm:flex-row justify-center items-center">
            <div style={{ position: 'relative' }}>
              <MapInteractionCSS>
                {isMapLoading ? (
                  <div className="flex justify-center items-center h-full">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-opacity-75" />
                  </div>
                ) : (
                  maps
                    ?.filter((map) => map.displayName === mapName)
                    .map((map) => (
                      <div
                        key={map.uuid}
                        className="col-span-2 md:col-span-3 lg:col-span-4 xl:col-span-5 map-container flex flex-col items-center justify-center m-auto"
                      >
                        <img
                          src={map.displayIcon}
                          alt={map.displayName}
                          onLoad={(event) => {
                            const target = event.target as HTMLImageElement;
                            const {
                              naturalWidth: width,
                              naturalHeight: height,
                            } = target;
                            console.log(`Image dimensions: ${width}x${height}`);
                            setIsMapLoaded(true);
                          }}
                          style={{
                            width: isMobile ? '100%' : '1000',
                            maxWidth: '700px',
                            margin: '0 auto',
                            display: 'block',
                          }}
                        />
                        {isMapLoaded &&
                          !selectedAbility &&
                          complementCoordinates &&
                          coordinates.map((coordinate, index) => (
                            <EnhancedDot
                              key={index}
                              coordinate={coordinate}
                              selectedDot={selectedDot}
                              setSelectedDot={setSelectedDot}
                              mode="ValorantLineups"
                            />
                          ))}
                      </div>
                    ))
                )}
                {isMapLoaded && selectedAbility ? (
                  <>
                    {complementCoordinates
                      .filter(
                        (coordinate) =>
                          coordinate.name === selectedAbility.displayName
                      )
                      .map((coordinate, index) => (
                        <EnhancedDot
                          key={coordinate.name + index}
                          coordinate={coordinate}
                          selectedDot={selectedDot}
                          setSelectedDot={setSelectedDot}
                          mode="ValorantLineups"
                          special={coordinate.post}
                          abilityIconUrl={selectedAbility?.displayIcon}
                          onTouchEnd={() => setSelectedDot(coordinate.name)}
                        />
                      ))}
                  </>
                ) : (
                  agent?.abilities
                    ?.filter((ability) => ability.slot !== 'Passive')
                    ?.map((ability) =>
                      complementCoordinates
                        .filter(
                          (coordinate) =>
                            coordinate.name === ability.displayName
                        )
                        .map((coordinate, coordIndex) => (
                          <EnhancedDot
                            key={coordinate.name + coordIndex}
                            coordinate={coordinate}
                            selectedDot={selectedDot}
                            setSelectedDot={setSelectedDot}
                            mode="CS2Lineups"
                            special={coordinate.post}
                            abilityIconUrl={ability.displayIcon}
                            onTouchEnd={() => setSelectedDot(coordinate.name)}
                          />
                        ))
                    )
                )}
              </MapInteractionCSS>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ValorantRadar;