import { useState, useEffect, createContext } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Page, UserPage, Valorant, CS2, Register, Login } from "./Components";
import axios from 'axios';
import Cookies from "universal-cookie";
import './App.css'

const baseURL = import.meta.env.VITE_SERVER_URL;
axios.defaults.baseURL = baseURL || 'http://localhost:3000';

const cookies = new Cookies();

type AuthContextType = {
  accessToken: string;
  setAccessToken: React.Dispatch<React.SetStateAction<string>>;
  refreshToken: string;
  setRefreshToken: React.Dispatch<React.SetStateAction<string>>;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

function App() {
  const [accessToken, setAccessToken] = useState<string>('');
  const [refreshToken, setRefreshToken] = useState<string>('');

  useEffect(() => {
    const accessTokenC = cookies.get('accessToken');
    const refreshTokenC = cookies.get('refreshToken');
    if(accessTokenC) {
      console.log(accessTokenC);
      setAccessToken(accessTokenC);
    }
    if(refreshTokenC) {
      console.log(refreshTokenC);
      setRefreshToken(refreshTokenC);
    }
  }, [accessToken, refreshToken]);

  return (
  <AuthContext.Provider value={{ accessToken, setAccessToken, refreshToken, setRefreshToken }}>
    <BrowserRouter>
      <Routes>
          <Route path="/" element={ <Page/> }></Route>
          <Route path="/register" element={ <Register/> }></Route>
          <Route path="/login" element={ <Login/> }></Route>
          <Route path="/user/:id" element={ <UserPage/> }></Route>
          <Route path="/valorant" element={ <Valorant/> }></Route>
          <Route path="/cs2" element={ <CS2/> }></Route>
      </Routes>
    </BrowserRouter>
  </AuthContext.Provider>
  )
}

export default App;