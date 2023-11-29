import './App.css'

function App() {
  const handleClick = (buttonNumber: number) => {
    console.log(`Button ${buttonNumber} clicked`);
  }

  return (
    <>
      <img className="fixed top-0 left-1/2 transform -translate-x-1/2 w-96 h-auto" src={"src/assets/lineupx.png"} alt="Logo" />
      <div className="flex flex-row items-center justify-center space-x-4">
        <div className="w-48 h-128">
          <img className="w-full h-full object-cover cursor-pointer transform transition-all duration-500 hover:scale-105 shadow-lg hover:shadow-2xl" src={"src/assets/csgo2.webp"} alt="Button 1" onClick={() => handleClick(1)} />
        </div>
        <div className="w-48 h-128">
          <img className="w-full h-full object-cover cursor-pointer transform transition-all duration-500 hover:scale-105 shadow-lg hover:shadow-2xl" src={"src/assets/valorant.jpg"} alt="Button 2" onClick={() => handleClick(2)} />
        </div>
      </div>
    </>
  )
}

export default App