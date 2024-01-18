import { StateVariables, StateActions } from '../../Pages/upload/upload.types';
import { Dot } from '../../Components';
import React, { useRef, useEffect, useState } from 'react';
import axios from 'axios';
import ancient from '../../assets/cs2maps/ancientradar.webp';
import anubis from '../../assets/cs2maps/anubisradar.webp';
import dust2 from '../../assets/cs2maps/dust2radar.webp';
import inferno from '../../assets/cs2maps/infernoradar.webp';
import mirage from '../../assets/cs2maps/mirageradar.webp';
import nuke from '../../assets/cs2maps/nukeradar.webp';
import overpass from '../../assets/cs2maps/overpassradar.webp';
import vertigo from '../../assets/cs2maps/vertigoradar.webp';

import dust2Coordinates from '../../assets/cs2jsons/dust2.json';
import anubisCoordinates from '../../assets/cs2jsons/anubis.json';
import vertigoCoordinates from '../../assets/cs2jsons/vertigo.json';
import ancientCoordinates from '../../assets/cs2jsons/ancient.json';
import infernoCoordinates from '../../assets/cs2jsons/inferno.json';
import nukeCoordinates from '../../assets/cs2jsons/nuke.json';
import mirageCoordinates from '../../assets/cs2jsons/mirage.json';
import overpassCoordinates from '../../assets/cs2jsons/overpass.json';

type CS2ModeProps = {
   state: StateVariables;
   dispatch: React.Dispatch<StateActions>;
};

const mapData = {
   mirage: { image: mirage, coordinates: mirageCoordinates },
   dust2: { image: dust2, coordinates: dust2Coordinates },
   vertigo: { image: vertigo, coordinates: vertigoCoordinates },
   nuke: { image: nuke, coordinates: nukeCoordinates },
   inferno: { image: inferno, coordinates: infernoCoordinates },
   overpass: { image: overpass, coordinates: overpassCoordinates },
   anubis: { image: anubis, coordinates: anubisCoordinates },
   ancient: { image: ancient, coordinates: ancientCoordinates },
};

const CS2Mode: React.FC<CS2ModeProps> = ({ state, dispatch }) => {
   const [mapImage, setMapImage] = useState('');
   const [coordinates, setCoordinates] = useState<{ x: number; y: number }[]>(
      [],
   );
   const canvasRef = useRef<HTMLCanvasElement | null>(null);
   const [dotSelected, setDotSelected] = useState(false);
   const [clickPosition, setClickPosition] = useState<{
      x: number;
      y: number;
   } | null>(null);
   
   useEffect(() => {
      const canvas = canvasRef.current;
      if (canvas && mapImage) {
         const context = canvas.getContext('2d');
         const img = new Image();

         img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            context?.drawImage(img, 0, 0, img.width, img.height);

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
            if (context) {
               context.beginPath();
               context.fillStyle = 'blue';
               context.fill();
            }
         };

         img.src = mapImage;
         if (img.complete) {
            canvas.width = img.width;
            canvas.height = img.height;
            context?.drawImage(img, 0, 0, img.width, img.height);
            if (clickPosition && context && dotSelected) {
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
   }, [mapImage, clickPosition, setClickPosition]);


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

         if (clickedDot) {
            // If a dot was clicked, only show that dot
            setCoordinates([clickedDot]);
            setDotSelected(true);
         } else {
            // If no dot was clicked, show all dots
            const mapName = state.mapName as keyof typeof mapData;
            setCoordinates(mapData[mapName].coordinates.coordinates);
            setDotSelected(false);
         }

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
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
               const mapName = e.target.value as keyof typeof mapData;
               dispatch({
                  type: 'setMapName',
                  payload: mapName,
               });
               setMapImage(mapData[mapName].image);
               setCoordinates(mapData[mapName].coordinates.coordinates);
            }}
            className="flex text-black items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-grey-400 mb-7 placeholder:text-grey-700 bg-[#edf2f7] text-dark-grey-900 rounded-2xl"
         >
            <option value="">--</option>
            <option value="mirage">Mirage</option>
            <option value="dust2">Dust 2</option>
            <option value="vertigo">Vertigo</option>
            <option value="nuke">Nuke</option>
            <option value="inferno">Inferno</option>
            <option value="overpass">Overpass</option>
            <option value="anubis">Anubis</option>
            <option value="ancient">Ancient</option>
         </select>
         {mapImage && <canvas ref={canvasRef} onClick={handleClick} />}

         <label
            htmlFor="grenadeType"
            className="mb-2 text-sm text-start text-gray-900"
         >
            Grenade Type*
         </label>
         <select
            id="grenadeType"
            value={state.grenadeType}
            onChange={(e) =>
               dispatch({
                  type: 'setGrenadeType',
                  payload: e.target.value,
               })
            }
            className="flex text-black items-center w-full px-5
                                    py-4 mb-5 mr-2 text-sm font-medium outline-none
                                    focus:bg-grey-400 placeholder:text-grey-700
                                    bg-[#edf2f7] text-dark-grey-900 rounded-2xl"
         >
            <option value="">--</option>
            <option value="smoke">Smoke</option>
            <option value="flash">Flash</option>
            <option value="molotov">Molotov</option>
            <option value="shock">Decoy</option>
            <option value="he">HE</option>
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
            <option value="CT">Counter Terrorist</option>
            <option value="T">Terrorist</option>
         </select>
      </>
   );
};

export default CS2Mode;
