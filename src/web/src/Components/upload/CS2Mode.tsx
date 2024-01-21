import { StateVariables, StateActions } from '../../Pages/upload/upload.types';
import React, { useRef, useEffect, useState } from 'react';
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
   const [coordinates, setCoordinates] = useState<
      { x: number; y: number; name: string }[]
   >([]);
   const [hoverPosition, setHoverPosition] = useState<{
      x: number;
      y: number;
   } | null>(null);
   const canvasRef = useRef<HTMLCanvasElement | null>(null);
   const [clickPosition, setClickPosition] = useState<{
      x: number;
      y: number;
   } | null>(null);
   const [selectedDot, setSelectedDot] = useState<{
      x: number;
      y: number;
      name: string;
   } | null>(null);
   const [placedDot, setPlacedDot] = useState<{ x: number; y: number } | null>(
      null,
   );
   useEffect(() => {
      const canvas = canvasRef.current;
      if (canvas && mapImage) {
         const context = canvas.getContext('2d');
         const img = new Image();
         img.crossOrigin = 'anonymous';

         img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            context?.drawImage(img, 0, 0, img.width, img.height);

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

         img.src = mapImage;
      }

      if (placedDot) {
         dispatch({
            type: 'setLineupPositionCoords',
            payload: { x: placedDot.x, y: placedDot.y },
         });
      }
   }, [
      mapImage,
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
         const pulsateRadius = radius + Math.sin(Date.now() / 200) * 10;
         context.globalAlpha = 0.8 + Math.sin(Date.now() / 200) * 30;
         context.beginPath();
         context.arc(x, y, pulsateRadius, 0, 2 * Math.PI);
         context.fillStyle = 'rgba(255, 0, 100, 0.3)';
         context.fill();
         context.globalAlpha = 1;
      }

      if (isPlaced) {
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
            context.lineWidth = 2;
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
            setCoordinates(mapData[mapName].coordinates.coordinates);
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
         {mapImage && (
            <>
               <label className="mb-2 text-sm text-start text-gray-900">
                  Select the position on the map of where your lineup lands.
                  After you click on it select the position of where you stand
                  at to throw the lineup
               </label>
               <canvas
                  ref={canvasRef}
                  onClick={handleClick}
                  onMouseMove={handleMouseMove}
               />
            </>
         )}

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
