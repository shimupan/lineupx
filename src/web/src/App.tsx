import { useState, useEffect, createContext } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import {
   Page,
   ProfilePage,
   Valorant,
   CS2,
   Register,
   Login,
   RequireAuth,
   UserAuth,
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
   DeveloperPosts,
   DeveloperPostsInfo,
   PageNotFound,
   SearchResults,
   About,
   ScrollToTop,
   GuestPage,
   PrivatePolicy,
   TOS,
   ManagePosts,
   EditPosts,
   ServerStatus,
   Leaderboard,
} from './Components';
import { useCookies } from './hooks';
import { setupInterceptors } from './axiosConfig';
import axios from 'axios';
import './App.css';

const baseURL = import.meta.env.VITE_SERVER_URL;
axios.defaults.baseURL = baseURL || 'http://localhost:1337';

type FollowingType = {
   type: string;
   ref: string;
   required: boolean;
};

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
   saved: string[];
   setSaved: React.Dispatch<React.SetStateAction<string[]>>;
   following: FollowingType[];
   setFollowing: React.Dispatch<React.SetStateAction<FollowingType[]>>;

  puuid: string;
  setPuuid: React.Dispatch<React.SetStateAction<string>>;
  gameName: string;
  setGameName: React.Dispatch<React.SetStateAction<string>>;
  tagLine: string;
  setTagLine: React.Dispatch<React.SetStateAction<string>>;
  RSOAccessToken: string;
  setRSOAccessToken: React.Dispatch<React.SetStateAction<string>>;
  RSORefreshToken: string;
  setRSORefreshToken: React.Dispatch<React.SetStateAction<string>>;
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
   const [saved, setSaved] = useState<string[]>([]);
   const [accessTokenC] = useCookies('accessToken', '');
   const [refreshTokenC] = useCookies('refreshToken', '');
   const [following, setFollowing] = useState<FollowingType[]>([]);
   const location = useLocation();

   const [RSOAccessTokenC] = useCookies('RSOAccessToken', '');
   const [RSORefreshTokenC] = useCookies('RSORefreshToken', '');
   const [puuid, setPuuid] = useState('');
   const [gameName, setGameName] = useState('');
   const [tagLine, setTagLine] = useState('');
   const [RSOAccessToken, setRSOAccessToken] = useState('');
   const [RSORefreshToken, setRSORefreshToken] = useState('');

  // Login users
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
               setSaved(response.data.saved);
               setFollowing(response.data.following);
            })
            .catch((error) => {
               return error;
            });
      }

      if (RSOAccessTokenC && !RSOAccessToken) { // if cookie exists, set auth's rso access token to this cookie
        setRSOAccessToken(RSOAccessTokenC);
      }
      if (RSORefreshTokenC && !RSORefreshToken) {
        setRSORefreshToken(RSORefreshTokenC);
      }
      if (RSOAccessToken && RSORefreshToken) {
        axios.get(`/rso/getUserInfo/${RSOAccessToken}`).then((res) => {
          console.log("res:", res);
          setPuuid(res.data.puuid);
          setGameName(res.data.gameName);
          setTagLine(res.data.tagLine);
        }).catch((error) => { return error; }) // .get.then.catch avoids async and await
      }
   }, [accessToken, refreshToken, RSOAccessToken, RSORefreshToken]);


  useEffect(() => {
      NProgress.start();

      // Simulate a data fetching delay or perform actual data fetching
      setTimeout(() => {
         NProgress.done();
         // Add the fade-out class to the NProgress bar
         const nprogressElements = document.querySelectorAll('#nprogress');
         nprogressElements.forEach((el) => el.classList.add('fade-out'));
      }, 200);
   }, [location]);

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
               following,
               setAccessToken,
               setRefreshToken,
               setEmail,
               setUsername,
               setVerified,
               setid,
               setProfilePicture,
               saved,
               setSaved,
               setFollowing,
              puuid,
              gameName,
              tagLine,
              RSOAccessToken,
              RSORefreshToken,
              setPuuid,
              setGameName,
              setTagLine,
              setRSOAccessToken,
              setRSORefreshToken,
            }}
         >
            <ScrollToTop />
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
               <Route path="/game/cs2/lineups" element={<CS2Lineups />}></Route>
               <Route
                  path="/game/cs2/lineups/:mapName"
                  element={<CS2Maps />}
               ></Route>
               <Route
                  path="/search/:game/:query"
                  element={<SearchResults />}
               ></Route>
               <Route path="/user/:id" element={<ProfilePage />}></Route>
               <Route path="/user/guest" element={<GuestPage />} />
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
               <Route path="/resetpassword" element={<ResetPassword />}></Route>
               <Route path="/privatepolicy" element={<PrivatePolicy />}></Route>
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
               {role === 'developer' && Verified && (
                  <Route element={<RequireAuth allowedRoles={['developer']} />}>
                     <Route
                        path="/developer/posts"
                        element={<DeveloperPosts />}
                     ></Route>
                     <Route
                        path="/developer/post/:id"
                        element={<DeveloperPostsInfo />}
                     ></Route>
                  </Route>
               )}
               <Route
                  element={<RequireAuth allowedRoles={['user', 'admin']} />}
               >
                  <Route path="/upload" element={<Upload />}></Route>
               </Route>
               {(role === 'admin' || role === 'user') && Verified && (
                  <Route
                     element={
                        <UserAuth
                           allowedRoles={['user', 'admin']}
                           requireOwnership
                        />
                     }
                  >
                     <Route
                        path="/manage-posts/:id"
                        element={<ManagePosts />}
                     />
                     <Route
                        path="/edit-post/:game/:id/:postId"
                        element={<EditPosts />}
                     />
                  </Route>
               )}
               <Route path="/google-callback" element={<GoogleCallBack />} />
               <Route path="/verifyemail" element={<VerifyEmail />} />
               <Route path="*" element={<PageNotFound />}></Route>
               <Route path="/tos" element={<TOS />} />
               <Route path="/server-status" element={<ServerStatus />} />
               <Route path="/leaderboard" element={<Leaderboard />} />
            </Routes>
         </AuthContext.Provider>
      </>
   );
}

export default App;
