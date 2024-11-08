import React, { useState } from 'react';

interface FiltersPopupProps {
   onClose: () => void;
   selectedGame: string;
   onSubmit: (filters: Filters) => void;
}

interface Filters {
   [key: string]: string[];
}

type FilterCategories = 'mapName' | 'teamSide' | 'grenadeType' | 'jumpThrow' | 'valorantAgent';

const initialFilters: Filters = {
   teamSide: [],
   mapName: [],
   grenadeType: [],
   jumpThrow: [],
   valorantAgent: []
};

const FiltersPopup: React.FC<FiltersPopupProps> = ({
   onClose,
   selectedGame,
   onSubmit,
}) => {
   const [filters, setFilters] = useState<Filters>(initialFilters);

   // Add value in FilterCategory only if it is not yet toggled
   const toggleCheckbox = (category: FilterCategories, value: string) => {
      setFilters((prevFilters) => {
         const currVal = prevFilters[category];
         if (currVal.includes(value)) {
            return {
               ...prevFilters,
               [category]: currVal.filter((v) => v !== value),
            };
         } else {
            return {
               ...prevFilters,
               [category]: [...currVal, value],
            };
         }
      });
   };

   // Format each checkbox - e.g. hover effects
   const renderCheckboxes = (title: string, category: FilterCategories, options: string[]) => (
      <div>
         <h3 className="font-semibold">{title}</h3>
         {options.map((option) => (
            <label key={option} className="flex items-center mb-2 cursor-pointer">
               <input
                  type="checkbox"
                  checked={filters[category].includes(option)}
                  onChange={() => toggleCheckbox(category, option)}
                  className="appearance-none h-4 w-4 border border-gray-300 rounded checked:bg-blue-500 checked:border-transparent focus:outline-none mr-2 cursor-pointer hover:border-blue-500"
               />
               <span className="text-gray-700">{option}</span>
            </label>
         ))}
      </div>
   );

   const pressedSubmit = () => {
      onSubmit(filters);
      onClose();
   };

   return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 rounded-xl">
         <div className="relative w-full max-w-sm mx-auto bg-white rounded-xl shadow-lg text-gray-800 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
               <h2 className="text-lg font-semibold">Filters</h2>
               <button
                  className="p-2 rounded-full hover:bg-gray-200"
                  onClick={onClose}
               >
                  <svg
                     className="w-5 h-5 text-gray-600"
                     fill="none"
                     stroke="currentColor"
                     viewBox="0 0 24 24"
                     xmlns="http://www.w3.org/2000/svg"
                  >
                     <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                     />
                  </svg>
               </button>
            </div>
            <div className="max-h-96 overflow-y-auto p-4">
               {selectedGame === 'Valorant' && (
                  <>
                     {renderCheckboxes("Side", "teamSide", ["Attacker", "Defender"])}
                     {renderCheckboxes("Map", "mapName", ["abyss", "ascent", "bind", "breeze", "fracture", "haven", "icebox", "lotus", "pearl", "split", "sunset"])}
                     {renderCheckboxes("Agent", "valorantAgent", ["Brimstone", "Phoenix", "Sage", "Sova", "Viper", "Cypher", "Reyna", "Killjoy", "Breach", "Omen", "Jett", "Raze", "Skye", "Yoru", "Astra", "KAY/O", "Chamber", "Neon", "Fade", "Harbor", "Gekko", "Deadlock", "Iso", "Clove", "Vyse"])}
                  </>
               )}
               {selectedGame === 'CS2' && (
                  <>
                     {renderCheckboxes("Side", "teamSide", ["T", "CT"])}
                     {renderCheckboxes("Map", "mapName", ["mirage", "inferno", "nuke", "overpass", "vertigo", "ancient", "anubis", "dust2"])}
                     {renderCheckboxes("Grenade", "grenadeType", ["he", "smoke", "flashbangs", "decoy", "molotov", "incendiary"])}
                     {renderCheckboxes("Jumpthrow?", "jumpThrow", ["YES", "NO"])}
                  </>
               )}
            </div>
            <div className="p-4 border-t">
               <button
                  onClick={pressedSubmit}
                  className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
               >
                  Submit
               </button>
            </div>
         </div>
      </div>
   );
};

export default FiltersPopup;
