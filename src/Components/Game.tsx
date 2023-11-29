// Game Cards
import { Link } from 'react-router-dom';

type GameProps = {
  name: string;
};

const Game: React.FC<GameProps> = ( { name } ) => {

  return (
    <>
      <div className="flex flex-row items-center justify-center space-x-4">
        <div className="w-48 h-128">
          <img className="w-full h-full object-cover cursor-pointer transform transition-all duration-500 hover:scale-105 shadow-lg hover:shadow-2xl" src={name} alt="Button 1" />
        </div>
      </div>
    </>
  )
};

export default Game;

