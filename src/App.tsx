import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Page, Map } from "./Components";

import './App.css'

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
            <Route path="/" element={ <Page/> }></Route>
            <Route path="/map/:id" element={ <Map/> }></Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App