import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Page, Map, Valorant, CS2 } from "./Components";

import './App.css'

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
            <Route path="/" element={ <Page/> }></Route>
            <Route path="/map/:id" element={ <Map/> }></Route>
            <Route path="/valorant" element={ <Valorant/> }></Route>
            <Route path="/cs2" element={ <CS2/> }></Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;