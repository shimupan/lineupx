import { useState, useContext, createContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../../App';
import axios from 'axios';
import Cookies from 'universal-cookie';

import { FaAngleLeft } from 'react-icons/fa6';
import { IoLogOut } from 'react-icons/io5';
import { GiHamburgerMenu } from 'react-icons/gi';
import { FollowingSideNav } from '../../../Components';

type SideNavProps = {
   children: React.ReactNode;
};

export const SideNavContext = createContext<boolean>(true);

const SideNav: React.FC<SideNavProps> = ({ children }: any) => {
   const Auth = useContext(AuthContext);
   const navigate = useNavigate();
   const cookies = new Cookies();
   const [expanded, setExpanded] = useState<boolean>(false);
   const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 768);
   const location = useLocation();
   const approved = Auth?.role === 'admin';
   const isSpecialRoute =
      location.pathname.startsWith('/game/Valorant') ||
      location.pathname.startsWith('/game/CS2');

   let topPosition = 'top-[50px]';
   if (isSpecialRoute) {
      topPosition = 'top-[90px]';
   }
   if (isSpecialRoute && approved && isMobile) {
      topPosition = 'top-[115px]';
   } else if (approved && isMobile) {
      topPosition = 'top-[75px]';
   }

   const logout = async () => {
      try {
         if (Auth?.refreshToken) {
            await axios.delete('/logout', {
               data: { refreshToken: Auth.refreshToken },
            });
         }
         cookies.remove('accessToken');
         cookies.remove('refreshToken');
         if (Auth) {
            Auth.setAccessToken('');
            Auth.setRefreshToken('');
            Auth.setUsername('');
            Auth.setEmail('');
            Auth.setProfilePicture('');
         }
         navigate('/login');
      } catch (error) {
         console.error('Error during logout:', error);
      }
   };

   useEffect(() => {
      const handleResize = () => setIsMobile(window.innerWidth <= 768);
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
   }, []);

   if (isMobile) {
      return null;
   }

   return (
      <>
         <aside
            className={`${
               expanded ? 'h-full' : ''
            } md:h-screen fixed ${topPosition} bottom-0 z-20 transition-all duration-700`}
            onMouseEnter={() => setExpanded(true)}
            onMouseLeave={() => setExpanded(false)}
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
                           alt="User avatar"
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
               {expanded && <FollowingSideNav />}
            </nav>
         </aside>
      </>
   );
};

export default SideNav;
