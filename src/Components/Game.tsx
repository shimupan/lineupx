// Game Cards
import { Link } from 'react-router-dom';

type GameProps = {
  game: string;
  name: string;
};

const Game: React.FC<GameProps> = ( { game, name } ) => {

  return (
    <>
      <div className="flex flex-row items-center justify-center space-x-4">
        <div className="w-64 h-128 p-4 md:w-64 md:h-128">
          <Link to={game}>
            <img className="w-full h-full object-cover cursor-pointer transform transition-all duration-500 hover:scale-105 shadow-lg hover:shadow-2xl" src={name} alt={game} />
          </Link>
        </div>
      </div>
    </>
  )
};

export default Game;

