import React, { useEffect, useState, useRef } from 'react';
import { StateVariables, StateActions } from '../../Pages/upload/upload.types';
import { AgentSelector } from '../../Components';

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
import abyssCoordinates from '../../assets/valorantjsons/abyss.json';

const mapData = {
   split: { name: 'Split', coordinates: splitCoordinates.coordinates },
   haven: { name: 'Haven', coordinates: havenCoordinates.coordinates },
   bind: { name: 'Bind', coordinates: bindCoordinates.coordinates },
   ascent: { name: 'Ascent', coordinates: ascentCoordinates.coordinates },
   icebox: { name: 'Icebox', coordinates: iceboxCoordinates.coordinates },
   breeze: { name: 'Breeze', coordinates: breezeCoordinates.coordinates },
   fracture: { name: 'Fracture', coordinates: fractureCoordinates.coordinates },
   sunset: { name: 'Sunset', coordinates: sunsetCoordinates.coordinates },
   lotus: { name: 'Lotus', coordinates: lotusCoordinates.coordinates },
   pearl: { name: 'Pearl', coordinates: pearlCoordinates.coordinates },
   abyss: { name: 'Abyss', coordinates: abyssCoordinates.coordinates },
};

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
   const canvasRef = useRef<HTMLCanvasElement | null>(null);
   const [clickPosition, setClickPosition] = useState<{
      x: number;
      y: number;
   } | null>(null);
   const [hoverPosition, setHoverPosition] = useState<{
      x: number;
      y: number;
   } | null>(null);
   const [coordinates, setCoordinates] = useState<
      { x: number; y: number; name: string }[]
   >([]);
   const [selectedDot, setSelectedDot] = useState<{
      x: number;
      y: number;
      name: string;
   } | null>(null);
   const [placedDot, setPlacedDot] = useState<{ x: number; y: number } | null>(
      null,
   );

   const selectedMap = maps.find(
      (map) => map.displayName.toLowerCase() === state.mapName.toLowerCase(),
   );

   useEffect(() => {
      fetch('https://valorant-api.com/v1/maps')
         .then((response) => response.json())
         .then((data) => setMaps(data.data));
   }, []);

   useEffect(() => {
      const canvas = canvasRef.current;
      const selectedMap = maps.find(
         (map) => map.displayName.toLowerCase() === state.mapName.toLowerCase(),
      );
      if (canvas && selectedMap) {
         const context = canvas.getContext('2d');
         const img = new Image();
         img.crossOrigin = 'anonymous';

         img.onload = () => {
            canvas.width = img.width * 2;
            canvas.height = img.height * 2;
            context?.drawImage(img, 0, 0, img.width * 2, img.height * 2);

            coordinates.forEach((coord) => {
               if (context) {
                  const isHovered =
                     hoverPosition &&
                     Math.hypot(
                        coord.x - hoverPosition.x,
                        coord.y - hoverPosition.y,
                     ) < 15;
                  drawMarker(context, coord.x, coord.y, 15, 'blue', isHovered);
               }
            });
            if (context) {
               if (placedDot && selectedDot) {
                  drawMarker(
                     context,
                     placedDot.x,
                     placedDot.y,
                     15,
                     'green',
                     false,
                     true,
                  );
               }
            }
         };

         img.src = selectedMap.displayIcon;
      }

      if (placedDot) {
         dispatch({
            type: 'setLineupPositionCoords',
            payload: { x: placedDot.x, y: placedDot.y },
         });
      }
   }, [
      state.mapName,
      clickPosition,
      setClickPosition,
      hoverPosition,
      placedDot,
      dispatch,
   ]);

   const handleMouseMove = (
      e: React.MouseEvent<HTMLCanvasElement, MouseEvent>,
   ) => {
      const canvas = canvasRef.current;
      if (canvas) {
         const rect = canvas.getBoundingClientRect();
         const scaleX = canvas.width / rect.width;
         const scaleY = canvas.height / rect.height;

         const x = (e.clientX - rect.left) * scaleX;
         const y = (e.clientY - rect.top) * scaleY;

         setHoverPosition({ x, y });
      }
   };

   const drawMarker = (
      context: CanvasRenderingContext2D,
      x: number,
      y: number,
      radius: number = 15,
      color: string = 'blue',
      isHovered: boolean | null | undefined = false,
      isPlaced: boolean | null | undefined = false,
   ) => {
      context.beginPath();
      context.arc(x, y, radius, 0, 2 * Math.PI);
      context.fillStyle = color;
      context.fill();

      if (isHovered) {
         // Draw hover effect
         const pulsateRadius = radius + Math.sin(Date.now() / 200) * 10;
         context.globalAlpha = 0.8 + Math.sin(Date.now() / 200) * 30;
         context.beginPath();
         context.arc(x, y, pulsateRadius, 0, 2 * Math.PI);
         context.fillStyle = 'rgba(255, 0, 100, 0.3)';
         context.fill();
         context.globalAlpha = 1;
      }

      if (isPlaced) {
         // Draw placed dot effect
         const pulsateRadius = radius + Math.sin(Date.now() / 200) * 5;
         context.globalAlpha = 0.8 + Math.sin(Date.now() / 200) * 20;
         context.beginPath();
         context.arc(x, y, pulsateRadius, 0, 2 * Math.PI);
         context.fillStyle = 'rgba(255, 255, 0, 0.3)';
         context.fill();
         context.globalAlpha = 1;

         // Draw animated line from selectedDot to placedDot
         if (selectedDot) {
            context.beginPath();
            context.moveTo(selectedDot.x, selectedDot.y);
            context.lineTo(x, y);
            context.strokeStyle = 'black';
            context.lineWidth = 10;
            context.setLineDash([5, 15]);
            context.stroke();
         }
      }
   };

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

         // Check if click is within 15 pixels of a dot
         const clickedDot = coordinates.find(
            (coord) => Math.hypot(coord.x - x, coord.y - y) < 15,
         );

         const mapName = state.mapName as keyof typeof mapData;

         if (selectedDot && clickedDot && selectedDot === clickedDot) {
            // If the same dot was clicked, show all dots
            console.log(mapData[mapName].coordinates);
            setCoordinates(mapData[mapName].coordinates);
            setSelectedDot(null);
            setPlacedDot(null);
         } else if (clickedDot) {
            // If a dot was clicked, only show that dot
            setCoordinates([clickedDot]);
            setSelectedDot(clickedDot);
         } else if (selectedDot) {
            // If a dot was selected and the clicked position is not transparent, place a new dot
            const context = canvas.getContext('2d');
            const imageData = context?.getImageData(x, y, 1, 1).data;
            if (imageData && imageData[3] !== 0) {
               setPlacedDot({ x, y });
               dispatch({
                  type: 'setLineupLocationCoords',
                  payload: {
                     x: selectedDot.x,
                     y: selectedDot.y,
                     name: selectedDot.name,
                  },
               });
            }
         }

         setClickPosition({ x, y });
      }
   };

   return (
      <>
         <select
            id="mapName"
            value={state.mapName}
            onChange={(e) => {
               const mapName = e.target.value as keyof typeof mapData;
               dispatch({
                  type: 'setMapName',
                  payload: mapName,
               });
               setCoordinates(mapData[mapName].coordinates);
               setSelectedDot(null);
               setPlacedDot(null);
            }}
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
            <option value="abyss">Abyss</option>
         </select>

         {selectedMap && (
            <>
               <label className="mb-2 text-sm text-start text-gray-900">
                  Select the position on the map of where your lineup lands.
                  After you click on it select the position of where you stand
                  at to throw the lineup. Blue dots are the lineup positions and
                  green dot is the position where you stand at.
               </label>
               <canvas
                  ref={canvasRef}
                  onClick={handleClick}
                  onMouseMove={handleMouseMove}
                  style={{
                     width: '100%',
                     maxWidth: '100vw',
                     margin: '0 auto',
                     display: 'block',
                  }}
               />
            </>
         )}

         <label
            htmlFor="grenadeType"
            className="mb-2 text-sm text-start text-gray-900"
         >
            Agent*
         </label>
         <AgentSelector
            agents={state.agents?.data || []}
            onAgentSelect={(selectedAgent) => {
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
            isOpen={true}
            onClose={() => {}}
            currentMapName={state.mapName}
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
            {(state.selectedAgentAbilities.length === 5
               ? state.selectedAgentAbilities.slice(0, -1)
               : state.selectedAgentAbilities
            ).map((ability, index) => (
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
         <div className="flex space-x-4">
            <button
               type="button"
               onClick={() =>
                  dispatch({
                     type: 'setTeamSide',
                     payload: 'Defender',
                  })
               }
               className={`flex-1 text-black items-center w-full px-5 py-4 mb-5 mr-2 text-sm font-medium outline-none focus:bg-grey-400 placeholder:text-grey-700 ${
                  state.teamSide === 'Defender'
                     ? 'bg-purple-200'
                     : 'bg-[#edf2f7]'
               } text-dark-grey-900 rounded-2xl`}
            >
               Defender
            </button>
            <button
               type="button"
               onClick={() =>
                  dispatch({
                     type: 'setTeamSide',
                     payload: 'Attacker',
                  })
               }
               className={`flex-1 text-black items-center w-full px-5 py-4 mb-5 mr-2 text-sm font-medium outline-none focus:bg-grey-400 placeholder:text-grey-700 ${
                  state.teamSide === 'Attacker'
                     ? 'bg-purple-200'
                     : 'bg-[#edf2f7]'
               } text-dark-grey-900 rounded-2xl`}
            >
               Attacker
            </button>
         </div>
      </>
   );
};

export default ValorantMode;
