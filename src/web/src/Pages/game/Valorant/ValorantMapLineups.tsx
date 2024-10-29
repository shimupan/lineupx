import React, { useContext, useEffect, useState } from 'react';
import {
   Layout,
   ValorantRadar,
   MapGrid,
   AgentSelector,
   AbilitySelector,
} from '../../../Components';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../../../App';
import { getPostByCoordinate, getPostByGrenade } from '../../../util/getPost';
import { Coordinate, ValorantMaps, ValorantAgent } from '../../../global.types';
import { useValorant, useValorantMapFilter } from '../../../hooks/index';
import axios from 'axios';

import splitCoordinates from '../../../assets/valorantjsons/split.json';
import bindCoordinates from '../../../assets/valorantjsons/bind.json';
import lotusCoordinates from '../../../assets/valorantjsons/lotus.json';
import sunsetCoordinates from '../../../assets/valorantjsons/sunset.json';
import fractureCoordinates from '../../../assets/valorantjsons/fracture.json';
import breezeCoordinates from '../../../assets/valorantjsons/breeze.json';
import ascentCoordinates from '../../../assets/valorantjsons/ascent.json';
import pearlCoordinates from '../../../assets/valorantjsons/pearl.json';
import havenCoordinates from '../../../assets/valorantjsons/haven.json';
import iceboxCoordinates from '../../../assets/valorantjsons/icebox.json';
import abyssCoordinates from '../../../assets/valorantjsons/abyss.json';

const mapRadars = [
   { name: 'Split', coordinates: splitCoordinates.coordinates },
   { name: 'Haven', coordinates: havenCoordinates.coordinates },
   { name: 'Bind', coordinates: bindCoordinates.coordinates },
   { name: 'Ascent', coordinates: ascentCoordinates.coordinates },
   { name: 'Icebox', coordinates: iceboxCoordinates.coordinates },
   { name: 'Breeze', coordinates: breezeCoordinates.coordinates },
   { name: 'Fracture', coordinates: fractureCoordinates.coordinates },
   { name: 'Sunset', coordinates: sunsetCoordinates.coordinates },
   { name: 'Lotus', coordinates: lotusCoordinates.coordinates },
   { name: 'Pearl', coordinates: pearlCoordinates.coordinates },
   { name: 'Abyss', coordinates: abyssCoordinates.coordinates },
];

const ValorantLineups: React.FC = () => {
   const [isMapLoading, setIsMapLoading] = useState(true);
   const [maps, setMaps] = useState<ValorantMaps['data']>();
   const [agent, setAgent] = useState<ValorantAgent['data'][0] | null>(null);
   const [selectedAbility, setSelectedAbility] = useState<
      ValorantAgent['data'][0]['abilities'][0] | null
   >();
   const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
   const [coordinates, setCoordinates] = useState<Coordinate[]>([]);
   const [complementCoordinates, setComplementCoordinates] = useState<
      Coordinate[]
   >([]);
   const [selectedDot, setSelectedDot] = useState<string>('');
   const Auth = useContext(AuthContext);
   const { agentName: rawAgentName, mapName } = useParams<{
      agentName: string;
      mapName: string;
   }>();
   const agentName = rawAgentName === 'KAYO' ? 'KAY/O' : rawAgentName;
   const [isMapLoaded, setIsMapLoaded] = useState(false);
   const handleAbilityClick = (
      ability: ValorantAgent['data'][0]['abilities'][0],
   ) => {
      if (ability === selectedAbility) {
         setSelectedAbility(null);
      } else {
         setSelectedAbility(ability);
      }
   };
   const { allAgents, setAgentDetails, allMaps } = useValorant();
   const { filteredMaps } = useValorantMapFilter(allMaps?.data);
   const navigate = useNavigate();
   const handleClick = (mapName: string) => {
      setSelectedDot('');
      setSelectedAbility(null);
      const formattedAgentName = agentName === 'KAY/O' ? 'KAYO' : agentName;
      navigate(
         `/game/Valorant/agents/${formattedAgentName}/lineups/${mapName}`,
      );
   };
   const [modalIsOpen, setModalIsOpen] = useState(false);
   const handleAgentSelect = React.useCallback((selectedAgent: ValorantAgent['data'][0]) => {
      if (selectedAgent) {
        setAgentDetails((prevState) => ({
          ...prevState,
          currentAgent: selectedAgent.fullPortrait,
          currentBackground: selectedAgent.background,
          selectedAgentName: selectedAgent.displayName,
        }));
  
        navigate(
          `/game/Valorant/agents/${selectedAgent.displayName.replace('/', '')}/lineups/${mapName}`
        );
        setModalIsOpen(false);
      }
    }, [mapName, navigate, setAgentDetails]);
   useEffect(() => {
      const handleResize = () => {
         setIsMobile(window.innerWidth <= 768);
      };
      window.addEventListener('resize', handleResize);
      fetch('https://valorant-api.com/v1/maps')
         .then((response) => response.json())
         .then((data) => {
            setMaps(data.data);
            setIsMapLoading(false);
         });
      if (agentName) {
         axios.get(`https://valorant-api.com/v1/agents`).then((response) => {
            const matchingAgent = response.data.data.find(
               (agent: any) =>
                  agent.displayName.toLowerCase() === agentName.toLowerCase(),
            );
            setAgent(matchingAgent);
         });
      } else {
         setAgent(null);
      }
      const mapObject = mapRadars.find((map) => map.name === mapName);

      if (mapObject && Array.isArray(mapObject.coordinates)) {
         setCoordinates(mapObject.coordinates);
      } else {
         console.error(`Invalid coordinates for map: ${mapName}`);
         setCoordinates([]);
      }

      if (Auth?.accessToken && Auth.username) {
         // Your authentication related logic
      }
      return () => {
         window.removeEventListener('resize', handleResize);
      };
   }, [Auth?.username, agentName, mapName]);

   useEffect(() => {
      if (!selectedAbility && !selectedDot) {
         !selectedDot
            ? setComplementCoordinates([])
            : setComplementCoordinates([]);
      }
      if (selectedAbility && selectedDot) {
         return;
      } else if (selectedAbility) {
         getPostByGrenade(
            selectedAbility.displayName,
            'Valorant',
            mapName!.toLowerCase(),
         )
            .then((coords) => {
               setComplementCoordinates(coords);
            })
            .catch((error) => {
               console.error(error);
            });
      } else if (selectedDot) {
         getPostByCoordinate(
            selectedDot,
            'Valorant',
            mapName!.toLowerCase(),
            agentName,
         )
            .then((coords) => {
               setComplementCoordinates(coords);
            })
            .catch((error) => {
               console.error(error);
            });
      }
   }, [selectedAbility, selectedDot]);


   
   return (
      <>
         <Layout>
            <div className="text-center ">
               {!selectedDot && !selectedAbility ? (
                  <>
                     <p>
                        Please choose a landing position for your grenade or
                        select a grenade to see all possible lineups
                     </p>
                  </>
               ) : selectedDot && !selectedAbility ? (
                  <p>Showing all lineups for {selectedDot}</p>
               ) : !selectedDot && selectedAbility ? (
                  <p>Showing all lineups for {selectedAbility.displayName}</p>
               ) : (
                  <p>
                     Showing all lineups for {selectedDot}{' '}
                     {selectedAbility?.displayName}
                  </p>
               )}
            </div>
            <ValorantRadar
               isMapLoading={isMapLoading}
               maps={maps}
               mapName={mapName}
               isMobile={isMobile}
               isMapLoaded={isMapLoaded}
               setIsMapLoaded={setIsMapLoaded}
               selectedAbility={selectedAbility}
               selectedDot={selectedDot}
               setSelectedDot={setSelectedDot}
               coordinates={coordinates}
               complementCoordinates={complementCoordinates}
               agent={agent}
            />
            <div className="md:pl-32 flex flex-col-reverse md:flex-row space-y-6 md:space-y-0 md:space-x-6 w-full md:h-48 overflow-auto bg-gray-900 p-4 md:fixed bottom-0">
               <MapGrid maps={filteredMaps} onMapClick={handleClick} />

               <AbilitySelector
                  agent={agent}
                  selectedAbility={selectedAbility}
                  onAbilityClick={handleAbilityClick}
               />

               <AgentSelector
                  isOpen={modalIsOpen}
                  onClose={() => setModalIsOpen(false)}
                  agents={allAgents?.data || []}
                  currentMapName={mapName || ''}
                  onAgentSelect={handleAgentSelect}
               />

               <button
                  onClick={() => setModalIsOpen(true)}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center space-x-2 md:ml-auto"
               >
                  <span>Select Agent:</span>
                  {agent && (
                     <div className="flex items-center space-x-2">
                        <img
                           src={agent.displayIcon}
                           alt={agent.displayName}
                           className="w-5 h-5 rounded-full"
                        />
                        <span className="font-semibold">
                           {agent.displayName}
                        </span>
                     </div>
                  )}
                  {!agent && <span className="italic">None selected</span>}
               </button>
            </div>
         </Layout>
      </>
   );
};

export default ValorantLineups;
