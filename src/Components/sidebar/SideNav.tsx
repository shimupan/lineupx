import { useState, useContext, createContext } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../App';
import axios from 'axios';
import Cookies from 'universal-cookie';

import { FaAngleLeft } from "react-icons/fa6";
import { IoLogOut } from "react-icons/io5";
import { GiHamburgerMenu } from "react-icons/gi";

type SideNavProps = {
   children: React.ReactNode;
};

export const SideNavContext = createContext<boolean>(true);
const SideNav: React.FC<SideNavProps> = ( { children }:any ) => {
   const Auth = useContext(AuthContext);
   const navigate = useNavigate();
   const cookies = new Cookies();
   const [expanded, setExpanded] = useState<boolean>(false);

   const logout = async () => {
      try {
        // Send a request to the server to invalidate the refresh token
        if (Auth?.refreshToken) {
          await axios.delete('/logout', { data: { refreshToken: Auth.refreshToken } });
        }
  
        // Clear the tokens from cookies and context
        cookies.remove('accessToken');
        cookies.remove('refreshToken');
        if (Auth) {
          Auth.setAccessToken('');
          Auth.setRefreshToken('');
        }
  
        // Navigate to the login or home page after logout
        navigate('/login');
      } catch (error) {
        console.error('Error during logout:', error);
      }
    };
   // TODO: Make closing transition smoother on mobile
   return (
      <aside className={`${expanded ? "h-full" : ""} md:h-screen absolute z-50`}>
         <nav className={`${expanded ? "transition-all w-screen md:w-[400px]" : "transition-all w-[50px] md:w-[70px]"} h-full flex flex-col ${expanded ? "bg-white" : "bg-transparent"} md:bg-white md:border-r shadow-sm`}>
            <div className={`md:p-4 pb-2 flex ${expanded ? "justify-end" : ""} items-center`}>
               <button className='p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 text-black text-2xl' onClick={ () => {
                  setExpanded(curr => !curr);
                  console.log(expanded);
               }}>
                  {expanded ? <FaAngleLeft /> : <GiHamburgerMenu />}
               </button>
            </div>

            <div className={`${expanded ? "" : "hidden md:block"} border-t flex p-3`}>
               <Link to={`/user/${Auth?.username ? Auth?.username : 1}`}>
                  <img src={`https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true&name=${Auth?.username ? Auth?.username : "Guest"}`} className="ml-[2px] w-10 h-10 rounded-md cursor-pointer"/>
               </Link>
               <div className={`flex justify-between items-center ${expanded ? "w-52 ml-3" : "w-0 ml-0"}`}>
                  <div className={`leading-4 ${expanded ? "w-52 ml-3" : "hidden"}`}>
                     <h4 className="font-semibold text-black">{Auth?.username ? Auth?.username : "Guest"}</h4>
                     <span className="text-xs text-gray-600">{Auth?.email ? Auth?.email : "Guest@Mail.com"}</span>
                  </div>
                  <IoLogOut size={25} className="text-black" style={{ cursor: 'pointer' }} onClick={logout} />
               </div>
            </div>
            
            <SideNavContext.Provider value={expanded}>
               <ul className={`${expanded ? "" : "hidden"} md:inline flex-1 px-3`}>{children}</ul>
            </SideNavContext.Provider>
         </nav>
      </aside>
   );
};
  
export default SideNav;