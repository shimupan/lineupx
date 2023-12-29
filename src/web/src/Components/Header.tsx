import { useContext } from 'react';
import { AuthContext } from '../App';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'universal-cookie';
import logo from '../assets/lineupx_compact.webp';

const Header: React.FC = () => {
   const Auth = useContext(AuthContext);
   const navigate = useNavigate();
   const cookies = new Cookies();
   const location = useLocation();
   const logout = async () => {
      try {
         // Send a request to the server to invalidate the refresh token
         if (Auth?.refreshToken) {
            await axios.delete('/logout', {
               data: { refreshToken: Auth.refreshToken },
            });
         }

         // Clear the tokens from cookies and context
         cookies.remove('accessToken');
         cookies.remove('refreshToken');
         if (Auth) {
            Auth.setAccessToken('');
            Auth.setRefreshToken('');
            Auth.setUsername('');
            Auth.setEmail('');
         }

         // Navigate to the login or home page after logout
         navigate('/login');
      } catch (error) {
         console.error('Error during logout:', error);
      }
   };

   return (
      <>
         <nav
            id="header"
            className="sticky top-0 w-full relative z-50 fixed top-0 w-full bg-[#181818] shadow-lg relative"
         >
            <div className="w-full flex items-center justify-between mt-0 px-2 md:px-6 py-1 md:py-2">
               <input className="hidden" type="checkbox" id="menu-toggle" />

               <div
                  className="flex items-center justify-start w-full md:w-auto"
                  id="menu"
               >
                  <nav>
                     <ul className="flex items-center justify-between text-base text-indigo-800 pt-4 md:pt-0">
                        <li>
                           <Link to={'/'}>
                              <img
                                 src={logo}
                                 alt="Logo"
                                 className="w-auto h-12 mt-[-10px] md:mt-0"
                              />
                           </Link>
                        </li>
                     </ul>
                  </nav>
               </div>

               {Auth?.accessToken ? (
                  <div className="flex flex-row">
                     <div>
                        {Auth?.role === 'admin' ? (
                           <button
                              onClick={() => navigate('/admin')}
                              className="bg-indigo-800 text-gray-200 ml-3 p-2 rounded hover:bg-blue-500 hover:text-gray-100"
                           >
                              Admin Panel
                           </button>
                        ) : (
                           <></>
                        )}

                        <button
                           onClick={logout}
                           className="bg-indigo-800 text-gray-200 ml-3 p-2 rounded hover:bg-blue-500 hover:text-gray-100"
                        >
                           Logout
                        </button>
                     </div>
                     {location.pathname === '/game/CS2' ||
                     location.pathname === '/game/Valorant' ? (
                        <Link
                           to={'/upload'}
                           state={{ game: location.pathname }}
                        >
                           <button className="bg-indigo-800 text-gray-200 p-2 ml-3 rounded hover:bg-blue-500 hover:text-gray-100">
                              Upload
                           </button>
                        </Link>
                     ) : (
                        <></>
                     )}
                  </div>
               ) : (
                  <div
                     className="flex items-center justify-end w-full md:w-auto"
                     id="nav-content"
                  >
                     <div className="auth flex items-center w-full md:w-auto">
                        <Link
                           to={'/login'}
                           className="bg-white text-gray-800 p-2 rounded mr-4 hover:bg-gray-400 hover:text-gray-950"
                        >
                           Sign in
                        </Link>
                        <Link
                           to={'/register'}
                           className="bg-indigo-800 text-gray-200 p-2 rounded hover:bg-blue-500 hover:text-gray-100"
                        >
                           Sign up
                        </Link>
                     </div>
                  </div>
               )}
            </div>
            {location.pathname.startsWith('/game/CS2') && (
               <div className="w-full flex justify-center items-center mt-0 px-6 py-1 space-x-6 bg-[#181818] shadow-lg">
                  <Link
                     to="/game/CS2"
                     className="text-white hover:text-gray-400"
                  >
                     Home
                  </Link>
                  <Link
                     to="/game/CS2/Lineups"
                     className="text-white hover:text-gray-400"
                  >
                     Lineups
                  </Link>
               </div>
            )}
            {location.pathname.startsWith('/game/Valorant') && (
               <div className="w-full flex justify-center items-center mt-0 px-6 py-1 space-x-6 bg-[#181818] shadow-lg">
                  <Link
                     to="/game/Valorant"
                     className="text-white hover:text-gray-400"
                  >
                     Home
                  </Link>
                  <Link
                     to="/game/Valorant/Agents"
                     className="text-white hover:text-gray-400"
                  >
                     Lineups
                  </Link>
               </div>
            )}
         </nav>
      </>
   );
};

export default Header;
