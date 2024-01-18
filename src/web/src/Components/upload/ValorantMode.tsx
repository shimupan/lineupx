import React, { useEffect, useState, useRef } from 'react';
import { StateVariables, StateActions } from '../../Pages/upload/upload.types';
import { AgentSelector } from '../../Components';
import axios from 'axios';

import splitCoordinates from '../../assets/valorantjsons/split.json';
import bindCoordinates from '../../assets/valorantjsons/bind.json';
import lotusCoordinates from '../../assets/valorantjsons/lotus.json';
import sunsetCoordinates from '../../assets/valorantjsons/sunset.json';
import fractureCoordinates from '../../assets/valorantjsons/fracture.json';
import breezeCoordinates from '../../assets/valorantjsons/breeze.json';
import ascentCoordinates from '../../assets/valorantjsons/ascent.json';
import pearlCoordinates from '../../assets/valorantjsons/pearl.json';
import havenCoordinates from '../../assets/valorantjsons/haven.json';
import iceboxCoordinates from '../../assets/valorantjsons/icebox.json';

type ValorantModeProps = {
   state: StateVariables;
   dispatch: React.Dispatch<StateActions>;
};

interface Map {
   uuid: string;
   displayName: string;
   displayIcon: string;
}

const ValorantMode: React.FC<ValorantModeProps> = ({ state, dispatch }) => {
   const [maps, setMaps] = useState<Map[]>([]);
   const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
   const canvasRef = useRef<HTMLCanvasElement | null>(null);
   const [clickPosition, setClickPosition] = useState<{
      x: number;
      y: number;
   } | null>(null);

   const selectedMap = maps.find(
      (map) => map.displayName.toLowerCase() === state.mapName.toLowerCase(),
   );

   useEffect(() => {

      const handleResize = () => {
         setIsMobile(window.innerWidth <= 768);
      };
      window.addEventListener('resize', handleResize);

      fetch('https://valorant-api.com/v1/maps')
         .then((response) => response.json())
         .then((data) => setMaps(data.data));

      const canvas = canvasRef.current;
      const selectedMap = maps.find(
         (map) => map.displayName.toLowerCase() === state.mapName.toLowerCase(),
      );
      if (canvas && selectedMap) {
         const context = canvas.getContext('2d');
         const img = new Image();

         img.onload = () => {
            canvas.width = img.width * 2;
            canvas.height = img.height * 2;
            context?.drawImage(img, 0, 0, img.width * 2, img.height * 2);
            if (clickPosition && context) {
               context.beginPath();
               context.arc(
                  clickPosition.x,
                  clickPosition.y,
                  10,
                  0,
                  2 * Math.PI,
                  false,
               );
               context.fillStyle = 'red';
               context.fill();
            }
         };
         if (context) {
            context.beginPath();
            context.arc(668, 521, 5, 0, 2 * Math.PI); // 5 is the radius of the dot
            context.fillStyle = 'blue';
            context.fill();
         }

         img.src = selectedMap.displayIcon;
         if (img.complete) {
            canvas.width = img.width * 2;
            canvas.height = img.height * 2;
            context?.drawImage(img, 0, 0, img.width * 2, img.height * 2);
            if (clickPosition && context) {
               context.beginPath();
               context.arc(
                  clickPosition.x,
                  clickPosition.y,
                  10,
                  0,
                  2 * Math.PI,
                  false,
               );
               context.fillStyle = 'red';
               context.fill();
            }
         }
      }

      return () => {
         window.removeEventListener('resize', handleResize);
      };
   }, [maps, state.mapName, clickPosition]);

   const handleClick = async (
      e: React.MouseEvent<HTMLCanvasElement, MouseEvent>,
   ) => {
      const canvas = canvasRef.current;
      if (canvas) {
         const rect = canvas.getBoundingClientRect();
         const scaleX = canvas.width / rect.width;
         const scaleY = canvas.height / rect.height;

         const x = (e.clientX - rect.left) * scaleX;
         const y = (e.clientY - rect.top) * scaleY;

         setClickPosition({ x, y });

         try {
            const response = await axios.post('/save-coordinates', { x, y });
            console.log(response.data);
         } catch (error) {
            console.error(error);
         }
      }
   };

   return (
      <>
         <select
            id="mapName"
            value={state.mapName}
            onChange={(e) =>
               dispatch({
                  type: 'setMapName',
                  payload: e.target.value,
               })
               
            }
            className="flex text-black items-center w-full px-5 py-4 mb-5 mr-2 text-sm font-medium outline-none focus:bg-grey-400 placeholder:text-grey-700 bg-[#edf2f7] text-dark-grey-900 rounded-2xl"
         >
            <option value="">--</option>
            <option value="bind">Bind</option>
            <option value="haven">Haven</option>
            <option value="split">Split</option>
            <option value="icebox">Icebox</option>
            <option value="ascent">Ascent</option>
            <option value="breeze">Breeze</option>
            <option value="fracture">Fracture</option>
            <option value="pearl">Pearl</option>
            <option value="lotus">Lotus</option>
            <option value="sunset">Sunset</option>
         </select>

         {selectedMap && (
            <div className="map-container flex flex-col items-center justify-center m-auto">
               <canvas
                  ref={canvasRef}
                  onClick={handleClick}
                  style={{
                      width: '100%',
                      maxWidth: '100vw',
                      margin: '0 auto',
                      display: 'block',
                  }}
               />
            </div>
         )}

         <label
            htmlFor="grenadeType"
            className="mb-2 text-sm text-start text-gray-900"
         >
            Agent*
         </label>
         <AgentSelector
            agents={state.agents?.data}
            onSelectAgent={(selectedAgent) => {
               dispatch({
                  type: 'setValorantAgent',
                  payload: selectedAgent.displayName,
               });
               dispatch({
                  type: 'setSelectedAgentAbilities',
                  payload: selectedAgent.abilities.map(
                     (ability) => ability.displayName,
                  ),
               });
            }}
         />

         <label
            htmlFor="agentAbility"
            className="mb-2 text-sm text-start text-gray-900"
         >
            Agent Ability*
         </label>
         <select
            id="ability"
            value={state.ability}
            onChange={(e) =>
               dispatch({
                  type: 'setAbility',
                  payload: e.target.value,
               })
            }
            className={`flex text-black items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-grey-400 mb-7 placeholder:text-grey-700 bg-[#edf2f7] text-dark-grey-900 rounded-2xl ${
               state.selectedAgentAbilities.length === 0
                  ? 'opacity-50 cursor-not-allowed'
                  : ''
            }`}
            disabled={state.selectedAgentAbilities.length === 0}
         >
            <option value="">--</option>
            {state.selectedAgentAbilities.map((ability, index) => (
               <option key={index} value={ability}>
                  {ability}
               </option>
            ))}
         </select>

         <label
            htmlFor="grenadeType"
            className="mb-2 text-sm text-start text-gray-900"
         >
            Team Side*
         </label>
         <select
            id="teamSide"
            value={state.teamSide}
            onChange={(e) =>
               dispatch({
                  type: 'setTeamSide',
                  payload: e.target.value,
               })
            }
            className="flex text-black items-center w-full px-5
                                    py-4 mb-5 mr-2 text-sm font-medium outline-none
                                    focus:bg-grey-400 placeholder:text-grey-700
                                    bg-[#edf2f7] text-dark-grey-900 rounded-2xl"
         >
            <option value="">--</option>
            <option value="Defender">Defender</option>
            <option value="Attacker">Attacker</option>
         </select>
      </>
   );
};

export default ValorantMode;
