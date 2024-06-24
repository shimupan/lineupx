import { useState, useContext, createContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../../App';
import axios from 'axios';
import Cookies from 'universal-cookie';

import { FaAngleLeft } from 'react-icons/fa6';
import { IoLogOut } from 'react-icons/io5';
import { GiHamburgerMenu } from 'react-icons/gi';

type SideNavProps = {
   children: React.ReactNode;
};

export const SideNavContext = createContext<boolean>(true);
const SideNav: React.FC<SideNavProps> = ({ children }: any) => {
   const Auth = useContext(AuthContext);
   const navigate = useNavigate();
   const cookies = new Cookies();
   const [expanded, setExpanded] = useState<boolean>(false);
   const location = useLocation();
   const approved = Auth?.role === 'admin';
   const isSpecialRoute =
      location.pathname.startsWith('/game/Valorant') ||
      location.pathname.startsWith('/game/CS2');
   let topPosition = 'top-[50px]';
   if (isSpecialRoute) {
      topPosition = 'top-[90px]';
   }
   const isMobile = window.innerWidth <= 768;
   if (
      (location.pathname === '/game/Valorant' ||
         location.pathname === '/game/CS2') &&
      approved &&
      isMobile
   ) {
      topPosition = 'top-[140px]';
   } else if (isSpecialRoute && approved && isMobile) {
      topPosition = 'top-[115px]';
   } else if (approved && isMobile) {
      topPosition = 'top-[75px]';
   }

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
            Auth.setProfilePicture('');
         }

         // Navigate to the login or home page after logout
         navigate('/login');
      } catch (error) {
         console.error('Error during logout:', error);
      }
   };

   useEffect(() => {
      // This will cause a re-render whenever Auth changes
   }, [Auth]);
   return (
      <>
         <aside
            className={`fixed ${topPosition} bottom-0 z-10 transition-all duration-700 w-full md:w-auto ${
               expanded ? 'w-screen' : 'w-[50px] md:w-[70px]'
            }`}
            style={{ height: '100vh' }} 
            onMouseEnter={() => window.innerWidth > 768 && setExpanded(true)}
            onMouseLeave={() => window.innerWidth > 768 && setExpanded(false)}
         >
            <nav
               className={`h-full flex flex-col overflow-hidden ${
                  isSpecialRoute ? 'mt-[5px]' : 'mt-[10px]'
               } md:mt-0 ${
                  expanded
                     ? 'transition-all w-screen md:w-[300px]'
                     : 'transition-all w-[50px] md:w-[70px]'
               } h-full flex flex-col ${
                  expanded ? 'bg-[#1d0532]' : 'bg-transparent'
               } md:bg-[#1d0532] shadow-sm transition-width duration-500`}
               style={{ height: '100vh' }}
            >
               <div
                  className={`md:p-4 pb-2 flex ${
                     expanded ? 'justify-end' : ''
                  } items-center`}
               >
                  <button
                     className="p-1.5 rounded-lg bg-gray-300 hover:bg-gray-300 text-white text-2xl block md:hidden"
                     onClick={() => {
                        setExpanded((curr) => !curr);
                        console.log(expanded);
                     }}
                  >
                     {expanded ? <FaAngleLeft /> : <GiHamburgerMenu />}
                  </button>
               </div>

               <div
                  className={`${
                     expanded ? '' : 'hidden md:block'
                  } border-t flex p-3 position-relative`}
               >
                  <div style={{ position: 'absolute', top: '5', left: '10' }}>
                     {' '}
                     <Link
                        to={`/user/${
                           Auth?.username ? Auth?.username : 'Guest'
                        }`}
                     >
                        <img
                           src={
                              Auth?.ProfilePicture
                                 ? Auth?.ProfilePicture
                                 : `https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true&name=${
                                      Auth?.username ? Auth?.username : 'Guest'
                                   }`
                           }
                           className="ml-[2px] w-10 h-10 rounded-md cursor-pointer"
                        />
                     </Link>
                  </div>
                  <div
                     className={`flex justify-between items-center ${
                        expanded ? 'w-52 ml-3 mt-10' : 'w-0 ml-0 mt-10'
                     }`}
                  >
                     <div
                        className={`leading-4 ${
                           expanded ? 'w-52 ml-10 mt-[-45px]' : 'hidden'
                        }`}
                     >
                        <h4 className="font-semibold text-white">
                           {Auth?.username ? Auth?.username : 'Guest'}
                        </h4>
                        <span className="text-xs text-white-600">
                           {Auth?.email ? Auth?.email : ''}
                        </span>
                     </div>
                     {Auth?.email && (
                        <IoLogOut
                           size={25}
                           className="text-white mt-[-45px]"
                           style={{ cursor: 'pointer' }}
                           onClick={logout}
                        />
                     )}
                  </div>
               </div>
               <SideNavContext.Provider value={expanded}>
                  <ul
                     className={`${
                        expanded ? '' : 'hidden'
                     } md:inline flex-1 px-3`}
                  >
                     {children}
                  </ul>
               </SideNavContext.Provider>
            </nav>
         </aside>
      </>
   );
};

export default SideNav;
