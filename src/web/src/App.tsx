import { useState, useEffect, createContext } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {
   Page,
   ProfilePage,
   Valorant,
   CS2,
   Register,
   Login,
   RequireAuth,
   Upload,
   ForgotPassword,
   ResetPassword,
   GoogleCallBack,
   VerifyEmail,
   PostPage,
   CS2Lineups,
   ValorantLineups,
   ValorantAgents,
   ValorantMaps,
   CS2Maps,
   AdminHome,
} from './Components';
import { setupInterceptors } from './axiosConfig';
import axios from 'axios';
import Cookies from 'universal-cookie';
import './App.css';

const baseURL = import.meta.env.VITE_SERVER_URL;
axios.defaults.baseURL = baseURL || 'http://localhost:3000';

const cookies = new Cookies();

type AuthContextType = {
   accessToken: string;
   setAccessToken: React.Dispatch<React.SetStateAction<string>>;
   refreshToken: string;
   setRefreshToken: React.Dispatch<React.SetStateAction<string>>;
   email: string;
   setEmail: React.Dispatch<React.SetStateAction<string>>;
   username: string;
   setUsername: React.Dispatch<React.SetStateAction<string>>;
   role: string;
};

export const AuthContext = createContext<AuthContextType | undefined>(
   undefined,
);

setupInterceptors();

function App() {
   const [accessToken, setAccessToken] = useState<string>('');
   const [refreshToken, setRefreshToken] = useState<string>('');
   const [username, setUsername] = useState<string>('');
   const [email, setEmail] = useState<string>('');
   const [role, setRole] = useState<string>('');

   useEffect(() => {
      const accessTokenC = cookies.get('accessToken');
      const refreshTokenC = cookies.get('refreshToken');
      if (accessTokenC && !accessToken) {
         setAccessToken(accessTokenC);
      }
      if (refreshTokenC && !refreshToken) {
         setRefreshToken(refreshTokenC);
      }
      if (accessToken && refreshToken) {
         (async () => {
            try {
               const response = await axios.get('/users', {
                  headers: {
                     accessToken: accessToken,
                     refreshToken: refreshToken,
                  },
               });
               setRole(response.data?.role || 'user');
               setUsername(response.data.username);
               setEmail(response.data.email);
            } catch (error) {
               return error;
            }
         })();
      }
   }, [accessToken, refreshToken]);

   return (
      <AuthContext.Provider
         value={{
            accessToken,
            refreshToken,
            email,
            role,
            setAccessToken,
            setRefreshToken,
            setEmail,
            username,
            setUsername,
         }}
      >
         <BrowserRouter>
            <Routes>
               <Route path="/" element={<Page />}></Route>
               <Route path="/game/valorant" element={<Valorant />}></Route>
               <Route path="/game/valorant/agents/:agentName/lineups" element={<ValorantLineups />}></Route>
               <Route path="/game/valorant/agents" element={<ValorantAgents />}></Route>
               <Route path="/game/valorant/agents/:agentName/lineups/:mapName" element={<ValorantMaps />} />
               <Route
                  path="/game/valorant/lineups"
                  element={<ValorantLineups />}
               ></Route>
               <Route
                  path="/game/valorant/agents"
                  element={<ValorantAgents />}
               ></Route>
               <Route
                  path="/game/valorant/lineups/:mapName"
                  element={<ValorantMaps />}
               />
               <Route path="/" element={<ValorantLineups />} />
               <Route path="/game/cs2" element={<CS2 />}></Route>
               <Route path="/game/cs2/lineups" element={<CS2Lineups />}></Route>
               <Route path="/game/cs2/lineups/:mapName" element={<CS2Maps />}></Route>
               <Route path="/user/:id" element={<ProfilePage />}></Route>
               <Route path="/game/:game/:id" element={<PostPage />}></Route>
               {/* Auth Routes */}
               <Route path="/register" element={<Register />}></Route>
               <Route path="/login" element={<Login />}></Route>
               <Route
                  path="/forgotpassword"
                  element={<ForgotPassword />}
               ></Route>
               <Route path="/resetpassword" element={<ResetPassword />}></Route>
               {/* Protected Routes */}
               <Route element={<RequireAuth allowedRoles={["admin"]}/>}>
                  <Route path="/admin" element={<AdminHome />}></Route>
               </Route>
               <Route element={<RequireAuth allowedRoles={["user", "admin"]}/>}>
                  <Route path="/upload" element={<Upload />}></Route>
               </Route>
               <Route path="/google-callback" element={<GoogleCallBack />} />
               <Route path="/verifyemail" element={<VerifyEmail />} />
            </Routes>
         </BrowserRouter>
      </AuthContext.Provider>
   );
}

export default App;
