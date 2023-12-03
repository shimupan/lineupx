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
  email: string;
  username: string;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Request Interceptor
axios.interceptors.request.use(request => {
  // Add the access token to every request
  const accessToken = cookies.get('accessToken');
  if (accessToken) {
    request.headers['Authorization'] = `Bearer ${accessToken}`;
  }
  return request;
}, error => {
  return Promise.reject(error);
});

// Response Interceptor
axios.interceptors.response.use(response => {
  return response;
}, async error => {
  const originalRequest = error.config;

  // Check for token expiration (401 status)
  if (error.response.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true;
    const refreshToken = cookies.get('refreshToken');

    // Attempt to get a new access token using refresh token
    return axios.post('/refresh-token', { refreshToken })
      .then(res => {
        if (res.status === 200) {
          // Update the access token in cookies
          cookies.set('accessToken', res.data.accessToken);

          // Update the header and resend the original request
          axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.accessToken}`;
          return axios(originalRequest);
        }
      });
  }

  return Promise.reject(error);
});

function App() {
  const [accessToken, setAccessToken] = useState<string>('');
  const [refreshToken, setRefreshToken] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  useEffect(() => {
    const accessTokenC = cookies.get('accessToken');
    const refreshTokenC = cookies.get('refreshToken');
    if(accessTokenC && !accessToken) {
      setAccessToken(accessTokenC);
    }
    if(refreshTokenC && !refreshToken) {
      setRefreshToken(refreshTokenC);
    }
    if(accessToken && refreshToken) {
      (async () => {
        try {
          const response = await axios.get('/users', { 
            headers: { 
              'accessToken': accessToken,
              'refreshToken': refreshToken,
            } 
          });
          setUsername(response.data.username);
          setEmail(response.data.email);
        } catch (error) {
          return error;
        }
      })();
    }
  }, [accessToken, refreshToken]);

  return (
  <AuthContext.Provider value={{ accessToken, 
                                 setAccessToken, 
                                 refreshToken, 
                                 setRefreshToken,
                                 email,
                                 username }}>
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