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

      const canvas = canvasRef.current;
      const selectedMap = maps.find(
         (map) => map.displayName.toLowerCase() === state.mapName.toLowerCase(),
      );
      if (canvas && selectedMap) {
         const context = canvas.getContext('2d');
         const img = new Image();
         img.crossOrigin = "anonymous";

         img.onload = () => {
            canvas.width = img.width * 2;
            canvas.height = img.height * 2;
            context?.drawImage(img, 0, 0, img.width * 2, img.height * 2);

            coordinates.forEach((coord) => {
               if (context) {
                  const color =
                     hoverPosition &&
                     Math.hypot(
                        coord.x - hoverPosition.x,
                        coord.y - hoverPosition.y,
                     ) < 15
                        ? 'red'
                        : 'blue';
                  drawMarker(context, coord.x, coord.y, 15, color);
               }
            });
            if (context) {
               console.log(1);
               if (placedDot && selectedDot) {
                  drawMarker(context, placedDot.x, placedDot.y, 15, 'green');
               }
            }
         };

         img.src = selectedMap.displayIcon;
         if (img.complete) {
            canvas.width = img.width * 2;
            canvas.height = img.height * 2;
            context?.drawImage(img, 0, 0, img.width * 2, img.height * 2);
         }
      }

      if (placedDot) {
         dispatch({
            type: 'setLineupPositionCoords',
            payload: { x: placedDot.x, y: placedDot.y },
         });
      }

   }, [maps, state.mapName, clickPosition, setClickPosition, hoverPosition, placedDot, dispatch]);

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
   ) => {
      context.beginPath();
      context.arc(x, y, radius, 0, 2 * Math.PI);
      context.fillStyle = color;
      context.fill();
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
         </select>

         {selectedMap && (
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
