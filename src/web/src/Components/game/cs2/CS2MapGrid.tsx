import React from 'react';

type MapInfo = {
  name: string;
  image: string;
};

type CS2MapGridProps = {
  maps: MapInfo[];
  onMapClick: (mapName: string) => void;
};

const CS2MapGrid: React.FC<CS2MapGridProps> = ({ maps, onMapClick }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
      {maps.map((map) => (
        <div
          key={map.name}
          className="group bg-gray-900 rounded-lg overflow-hidden shadow-lg transform transition duration-300 ease-in-out relative cursor-pointer"
          onClick={() => onMapClick(map.name)}
        >
          <img
            src={map.image}
            alt={map.name}
            className="w-full h-auto sm:h-48 object-cover group-hover:opacity-75 transition-transform duration-300 ease-in-out group-hover:scale-110"
          />
          <div className="absolute bottom-0 left-0 right-0 px-6 py-4 opacity-100 group-hover:opacity-0">
            <div className="font-bold text-xl mb-2 text-white text-center">
              {map.name}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CS2MapGrid;