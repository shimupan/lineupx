// Game Cards
import valorant from '../assets/valorant.jpg';
import csgo2 from '../assets/csgo2.webp';

const Game = () => {
  const handleClick = (id: number) => {
    alert(`Image ${id} clicked!`);
    // Add your logic here
  }

  return (
    <>
      
      <div className="flex flex-row items-center justify-center space-x-4">
        <div className="w-48 h-128">
          <img className="w-full h-full object-cover cursor-pointer transform transition-all duration-500 hover:scale-105 shadow-lg hover:shadow-2xl" src={csgo2} alt="Button 1" onClick={() => handleClick(1)} />
        </div>
        <div className="w-48 h-128">
          <img className="w-full h-full object-cover cursor-pointer transform transition-all duration-500 hover:scale-105 shadow-lg hover:shadow-2xl" src={valorant} alt="Button 2" onClick={() => handleClick(2)} />
        </div>
      </div>
    </>
  )
};

export default Game;

