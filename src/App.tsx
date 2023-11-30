import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Page, Map, Register, Login } from "./Components";
import './App.css'
import axios from 'axios';

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
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App