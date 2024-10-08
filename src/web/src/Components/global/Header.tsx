import { useContext, useState } from 'react';
import { AuthContext } from '../../App';
import { useCookies } from '../../hooks';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import logo from '../../assets/lineupx_compact.webp';
import { FaUserCircle, FaSignOutAlt, FaUpload, FaEdit } from 'react-icons/fa';
import { MdAdminPanelSettings } from 'react-icons/md';

const Header: React.FC = () => {
   const Auth = useContext(AuthContext);
   const navigate = useNavigate();
   const location = useLocation();
   const [, , deleteAccessCookie] = useCookies('accessToken', '');
   const [, , deleteRefreshCookie] = useCookies('refreshToken', '');
   const [isDropdownOpen, setIsDropdownOpen] = useState(false);

   const logout = async () => {
      try {
         if (Auth?.refreshToken) {
            await axios.delete('/logout', {
               data: { refreshToken: Auth.refreshToken },
            });
         }

         deleteAccessCookie();
         deleteRefreshCookie();

         Auth?.setAccessToken('');
         Auth?.setRefreshToken('');
         Auth?.setUsername('');
         Auth?.setEmail('');
         Auth?.setProfilePicture('');
         setTimeout(() => {
            window.location.reload();
         }, 100);
         navigate('/');
      } catch (error) {
         console.error('Error during logout:', error);
      }
   };

   const toggleDropdown = () => {
      setIsDropdownOpen(!isDropdownOpen);
   };

   return (
      <>
         <nav
            id="header"
            className="sticky top-0 w-full bg-[#212121] shadow-lg z-50"
         >
            <div className="w-full flex items-center justify-between mt-0 px-2 md:px-6 py-1 md:py-2">
               <div className="flex items-center justify-start" id="menu">
                  <Link to={'/'}>
                     <img
                        src={logo}
                        alt="Logo"
                        className="w-auto h-12 mt-[-10px] md:mt-0"
                     />
                  </Link>
               </div>

               <div className="flex items-center space-x-4">
                  {Auth?.accessToken ? (
                     <>
                        {Auth?.role === 'admin' && (
                           <button
                              onClick={() => navigate('/admin')}
                              className="bg-indigo-800 text-white p-2 rounded hover:bg-blue-500 hover:text-white text-sm whitespace-nowrap flex items-center"
                           >
                              <MdAdminPanelSettings className="mr-2 text-xl" />
                              Admin Panel
                           </button>
                        )}

                        {(location.pathname === '/game/CS2' ||
                           location.pathname === '/game/Valorant') && (
                           <Link
                              to={'/upload'}
                              state={{ game: location.pathname }}
                           >
                              <button className="bg-indigo-800 text-white p-2 rounded hover:bg-blue-500 hover:text-white text-sm whitespace-nowrap flex items-center">
                                 <FaUpload className="mr-2 text-xl" />
                                 Upload
                              </button>
                           </Link>
                        )}

                        <div className="relative">
                           <img
                              src={
                                 Auth.ProfilePicture ||
                                 `https://ui-avatars.com/api/?background=random&color=fff&name=${Auth.username}`
                              }
                              alt="Profile"
                              className="w-10 h-10 rounded-full cursor-pointer"
                              onClick={toggleDropdown}
                           />
                           {isDropdownOpen && (
                              <div className="absolute right-0 mt-2 w-72 bg-[#212121] rounded-md shadow-lg py-1 z-10">
                                 <div className="px-4 py-3 border-b border-gray-700">
                                    <div className="flex items-center">
                                       <img
                                          src={
                                             Auth.ProfilePicture ||
                                             `https://ui-avatars.com/api/?background=random&color=fff&name=${Auth.username}`
                                          }
                                          alt="Profile"
                                          className="w-12 h-12 rounded-full mr-3"
                                       />
                                       <div>
                                          <p className="text-base font-medium text-white">
                                             {Auth.username}
                                          </p>
                                       </div>
                                    </div>
                                 </div>
                                 <Link
                                    to={`/user/${Auth.username}`}
                                    className="block px-4 py-2 text-sm text-white hover:bg-gray-700 flex items-center"
                                 >
                                    <FaUserCircle className="mr-2 text-xl" />
                                    View Profile
                                 </Link>
                                 <Link
                                    to={`/manage-posts/${Auth.username}`}
                                    className="block px-4 py-2 text-sm text-white hover:bg-gray-700 flex items-center"
                                 >
                                    <FaEdit className="mr-2 text-xl" />
                                    Post Studio
                                 </Link>
                                 <button
                                    onClick={logout}
                                    className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700 flex items-center"
                                 >
                                    <FaSignOutAlt className="mr-2 text-xl" />
                                    Logout
                                 </button>
                              </div>
                           )}
                        </div>
                     </>
                  ) : (
                     <div
                        className="flex items-center space-x-2"
                        id="nav-content"
                     >
                        <Link
                           to={'/login'}
                           className="bg-white text-gray-800 p-2 rounded hover:bg-gray-400 hover:text-gray-950 text-sm whitespace-nowrap"
                        >
                           Sign in
                        </Link>
                        <Link
                           to={'/register'}
                           className="bg-indigo-800 text-white p-2 rounded hover:bg-blue-500 hover:text-white text-sm whitespace-nowrap"
                        >
                           Sign up
                        </Link>
                     </div>
                  )}
               </div>
            </div>
         </nav>
      </>
   );
};

export default Header;
