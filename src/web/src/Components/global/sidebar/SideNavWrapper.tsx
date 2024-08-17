import { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { SideNav, SideNavItems } from '../../../Components';
import { AuthContext } from '../../../App';
import { MdOutlineSettings, MdHome } from 'react-icons/md';
import { RiAdminFill } from 'react-icons/ri';
import cs2Logo from '../../../assets/svg/csgo.svg';
import valorantLogo from '../../../assets/svg/valorant.svg';
import questionMark from '../../../assets/svg/questionmark.svg';

type SideNavWrapperProps = {
   className?: string;
};

const SideNavWrapper: React.FC<SideNavWrapperProps> = ({ className }) => {
   const Auth = useContext(AuthContext);
   const [activeItem, setActiveItem] = useState<string>('/');
   const navigate = useNavigate();
   const location = useLocation();

   useEffect(() => {
      setActiveItem(location.pathname);
   }, [location.pathname]);

   const handleClick = (item: string) => {
      navigate(item);
   };

   return (
      <>
         <div className={`side-nav-wrapper ${className}`}>
            <SideNav>
               <SideNavItems
                  icon={<MdHome size={25} />}
                  text="Home"
                  active={activeItem === '/'}
                  onClick={() => handleClick('/')}
               />
               <SideNavItems
                  icon={
                     <img
                        src={cs2Logo}
                        alt="CS2"
                        width={25}
                        style={{ filter: 'brightness(0) invert(1)' }}
                     />
                  }
                  text="CS2"
                  active={activeItem === '/game/CS2'}
                  onClick={() => handleClick('/game/CS2')}
               />
               <SideNavItems
                  icon={
                     <img
                        src={valorantLogo}
                        alt="Valorant"
                        width={25}
                        style={{ filter: 'brightness(0) invert(1)' }}
                     />
                  }
                  text="Valorant"
                  active={activeItem === '/game/Valorant'}
                  onClick={() => handleClick('/game/Valorant')}
               />
               {Auth?.role === 'admin' && (
                  <SideNavItems
                     icon={<RiAdminFill size={25} />}
                     text="Admin"
                     active={activeItem === '/admin'}
                     onClick={() => handleClick('/admin')}
                  />
               )}
               <SideNavItems
                  icon={<MdOutlineSettings size={25} />}
                  text="Profile"
                  active={
                     activeItem ===
                     `/user/${Auth?.username ? Auth?.username : 'Guest'}`
                  }
                  onClick={() =>
                     handleClick(
                        `/user/${Auth?.username ? Auth?.username : 'Guest'}`,
                     )
                  }
                  alert
               />
               <SideNavItems
                  icon={
                     <img
                        src={questionMark}
                        alt="About"
                        width={25}
                        style={{ filter: 'brightness(0) invert(1)' }}
                     />
                  }
                  text="About"
                  active={activeItem === '/about'}
                  onClick={() => handleClick('/about')}
               />

               {/* Add a separator before the Following section */}
               <div className="border-t border-gray-700 my-4"></div>
            </SideNav>
         </div>
      </>
   );
};

export default SideNavWrapper;
