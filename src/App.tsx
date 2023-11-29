import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Page, Map, Valorant, CSGO2 } from "./Components";

import './App.css'

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
            <Route path="/" element={ <Page/> }></Route>
            <Route path="/map/:id" element={ <Map/> }></Route>
            <Route path="/valorant" element={ <Valorant/> }></Route>
            <Route path="/csgo2" element={ <CSGO2/> }></Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;