import { useState, useEffect, createContext } from 'react';
import { Routes, Route } from 'react-router-dom';
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
   AdminUsers,
   AdminPosts,
   AdminCheck,
   AdminModifyUser,
   AdminModifyPost,
   PageNotFound,
   SearchResults,
   About,
} from './Components';
import { useCookies } from './hooks';
import { setupInterceptors } from './axiosConfig';
import axios from 'axios';
import './App.css';

const baseURL = import.meta.env.VITE_SERVER_URL;
axios.defaults.baseURL = baseURL || 'http://localhost:3000';

type AuthContextType = {
   _id: string;
   setid: React.Dispatch<React.SetStateAction<string>>;
   accessToken: string;
   setAccessToken: React.Dispatch<React.SetStateAction<string>>;
   refreshToken: string;
   setRefreshToken: React.Dispatch<React.SetStateAction<string>>;
   email: string;
   setEmail: React.Dispatch<React.SetStateAction<string>>;
   username: string;
   setUsername: React.Dispatch<React.SetStateAction<string>>;
   Verified: boolean;
   setVerified: React.Dispatch<React.SetStateAction<boolean>>;
   role: string;
   ProfilePicture: string;
   setProfilePicture: React.Dispatch<React.SetStateAction<string>>;
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
   const [Verified, setVerified] = useState<boolean>(false);
   const [role, setRole] = useState<string>('');
   const [ProfilePicture, setProfilePicture] = useState<string>('');
   const [_id, setid] = useState<string>('');
   const [accessTokenC] = useCookies('accessToken', '');
   const [refreshTokenC] = useCookies('refreshToken', '');

   useEffect(() => {
      if (accessTokenC && !accessToken) {
         setAccessToken(accessTokenC);
      }
      if (refreshTokenC && !refreshToken) {
         setRefreshToken(refreshTokenC);
      }
      if (accessToken && refreshToken) {
         axios
            .post('/users', {
               accessToken: accessToken,
               refreshToken: refreshToken,
            })
            .then((response) => {
               setRole(response.data?.role || 'user');
               setUsername(response.data.username);
               setEmail(response.data.email);
               setVerified(response.data.Verified);
               setid(response.data._id);
               setProfilePicture(response.data.ProfilePicture);
            })
            .catch((error) => {
               return error;
            });
      }
   }, [accessToken, refreshToken]);

   return (
      <>
            <AuthContext.Provider
               value={{
                  _id,
                  accessToken,
                  refreshToken,
                  email,
                  role,
                  username,
                  ProfilePicture,
                  Verified,
                  setAccessToken,
                  setRefreshToken,
                  setEmail,
                  setUsername,
                  setVerified,
                  setid,
                  setProfilePicture,
               }}
            >
               <Routes>
                  <Route path="/" element={<Page />}></Route>
                  <Route path="/game/valorant" element={<Valorant />}></Route>
                  <Route
                     path="/game/valorant/agents/:agentName/lineups"
                     element={<ValorantLineups />}
                  ></Route>
                  <Route
                     path="/game/valorant/agents"
                     element={<ValorantAgents />}
                  ></Route>
                  <Route
                     path="/game/valorant/agents/:agentName/lineups/:mapName"
                     element={<ValorantMaps />}
                  />
                  <Route
                     path="/game/valorant/lineups"
                     element={<ValorantLineups />}
                  ></Route>
                  <Route
                     path="/game/valorant/lineups/:mapName"
                     element={<ValorantMaps />}
                  />
                  <Route path="/game/cs2" element={<CS2 />}></Route>
                  <Route
                     path="/game/cs2/lineups"
                     element={<CS2Lineups />}
                  ></Route>
                  <Route
                     path="/game/cs2/lineups/:mapName"
                     element={<CS2Maps />}
                  ></Route>
                  <Route
                     path="/search/:game/:query"
                     element={<SearchResults />}
                  ></Route>
                  <Route path="/user/:id" element={<ProfilePage />}></Route>
                  <Route path="/game/:game/:id" element={<PostPage />}></Route>
                  <Route path="/post/:game/:id" element={<PostPage />}></Route>
                  <Route path="/about" element={<About />}></Route>
                  {/* Auth Routes */}
                  <Route path="/register" element={<Register />}></Route>
                  <Route path="/login" element={<Login />}></Route>
                  <Route
                     path="/forgotpassword"
                     element={<ForgotPassword />}
                  ></Route>
                  <Route
                     path="/resetpassword"
                     element={<ResetPassword />}
                  ></Route>
                  {/* Protected Routes */}
                  {role === 'admin' && Verified && (
                     <Route element={<RequireAuth allowedRoles={['admin']} />}>
                        <Route path="/admin" element={<AdminHome />}></Route>
                        <Route
                           path="/admin/users"
                           element={<AdminUsers />}
                        ></Route>
                        <Route
                           path="/admin/posts"
                           element={<AdminPosts />}
                        ></Route>
                        <Route
                           path="/admin/check"
                           element={<AdminCheck />}
                        ></Route>
                        <Route
                           path="/admin/user/:id"
                           element={<AdminModifyUser />}
                        ></Route>
                        <Route
                           path="/admin/post/:id"
                           element={<AdminModifyPost />}
                        ></Route>
                     </Route>
                  )}
                  <Route
                     element={<RequireAuth allowedRoles={['user', 'admin']} />}
                  >
                     <Route path="/upload" element={<Upload />}></Route>
                  </Route>
                  <Route path="/google-callback" element={<GoogleCallBack />} />
                  <Route path="/verifyemail" element={<VerifyEmail />} />
                  <Route path="*" element={<PageNotFound />}></Route>
               </Routes>
            </AuthContext.Provider>
      </>
   );
}

export default App;
