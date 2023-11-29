import { useState } from 'react';
import './App.css'

function App() {
  const [selectedButton, setSelectedButton] = useState<number | null>(null);

  const handleClick = (buttonNumber: number) => {
    console.log(`Button ${buttonNumber} clicked`);
    setSelectedButton(buttonNumber);
  }

  return (
    <>
      <img className="fixed top-0 left-1/2 transform -translate-x-1/2 w-96 h-auto" src={"src/assets/lineupx.png"} alt="Logo" />
      <div className="flex flex-row items-center justify-center space-x-4">
        <div className={`w-48 h-128 border-2 ${selectedButton === 1 ? 'border-blue-500' : 'border-transparent'}`}>
          <img className="w-full h-full object-cover cursor-pointer" src={"src/assets/csgo2.webp"} alt="Button 1" onClick={() => handleClick(1)} />
        </div>
        <div className={`w-48 h-128 border-2 ${selectedButton === 2 ? 'border-blue-500' : 'border-transparent'}`}>
          <img className="w-full h-full object-cover cursor-pointer" src={"src/assets/valorant.jpg"} alt="Button 2" onClick={() => handleClick(2)} />
        </div>
      </div>
    </>
  )
}

export default App