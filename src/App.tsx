import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Page, Map, Valorant, CS2, Register, Login } from "./Components";

import axios from 'axios';

import './App.css'

axios.defaults.baseURL = 'http://localhost:3000';

function App() {
  return (
    <>
        <BrowserRouter>
          <Routes>
              <Route path="/" element={ <Page/> }></Route>
              <Route path="/register" element={ <Register/> }></Route>
              <Route path="/login" element={ <Login/> }></Route>
              <Route path="/map/:id" element={ <Map/> }></Route>
              <Route path="/valorant" element={ <Valorant/> }></Route>
              <Route path="/cs2" element={ <CS2/> }></Route>
          </Routes>
        </BrowserRouter>
    </>
  )
}

export default App;