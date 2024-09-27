import { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { SideNav, SideNavItems, FollowingSideNav } from '../../../Components';
import { AuthContext } from '../../../App';
import { MdOutlineSettings, MdHome } from 'react-icons/md';
import { RiAdminFill } from 'react-icons/ri';
import { FaTrophy } from 'react-icons/fa';
import cs2Logo from '../../../assets/svg/csgo.svg';
import grenade from '../../../assets/svg/grenade.svg';
import molly from '../../../assets/svg/molly.svg';
import { SiValorant } from 'react-icons/si';
import questionMark from '../../../assets/svg/questionmark.svg';

type SideNavWrapperProps = {
   className?: string;
};

const IconWrapper = ({ children }: { children: React.ReactNode }) => (
   <div className="w-6 h-6 flex items-center justify-center">{children}</div>
);

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
                  icon={
                     <IconWrapper>
                        <MdHome size={24} />
                     </IconWrapper>
                  }
                  text="Home"
                  active={activeItem === '/'}
                  onClick={() => handleClick('/')}
               />
               <SideNavItems
                  icon={
                     <IconWrapper>
                        <img
                           src={cs2Logo}
                           alt="CS2"
                           className="w-6 h-6 filter brightness-0 invert"
                        />
                     </IconWrapper>
                  }
                  text="CS2"
                  active={activeItem === '/game/CS2'}
                  onClick={() => handleClick('/game/CS2')}
               />
               <SideNavItems
                  icon={
                     <IconWrapper>
                        <SiValorant size={24} />
                     </IconWrapper>
                  }
                  text="Valorant"
                  active={activeItem === '/game/Valorant'}
                  onClick={() => handleClick('/game/Valorant')}
               />
               {Auth?.role === 'admin' && (
                  <SideNavItems
                     icon={
                        <IconWrapper>
                           <RiAdminFill size={24} />
                        </IconWrapper>
                     }
                     text="Admin"
                     active={activeItem === '/admin'}
                     onClick={() => handleClick('/admin')}
                  />
               )}
               <SideNavItems
                  icon={
                     <IconWrapper>
                        <MdOutlineSettings size={24} />
                     </IconWrapper>
                  }
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
                     <IconWrapper>
                        <FaTrophy size={24} />
                     </IconWrapper>
                  }
                  text="Leaderboard"
                  active={activeItem === '/leaderboard'}
                  onClick={() => handleClick('/leaderboard')}
               />
               <SideNavItems
                  icon={
                     <IconWrapper>
                        <img
                           src={questionMark}
                           alt="About"
                           className="w-6 h-6 filter brightness-0 invert"
                        />
                     </IconWrapper>
                  }
                  text="About"
                  active={activeItem === '/about'}
                  onClick={() => handleClick('/about')}
               />

               {location.pathname.startsWith('/game') && (
                  <div className="border-t border-gray-700 my-4"></div>
               )}

               {location.pathname.startsWith('/game/CS2') && (
                  <SideNavItems
                  icon={
                     <IconWrapper>
                        <img
                           src={grenade}
                           alt="Lineups"
                           className="w-10 h-8 filter brightness-0 invert"
                        />
                     </IconWrapper>
                  }
                  text="Lineups"
                  active={activeItem === '/game/CS2/Lineups'}
                  onClick={() => handleClick('/game/CS2/Lineups')}
                  />
               )}
               
               {location.pathname.startsWith('/game/Valorant') && (
                  <SideNavItems
                     icon={
                        <IconWrapper>
                           <img
                              src={molly}
                              alt="Lineups"
                              className="w-6 h-6 filter brightness-0 invert"
                           />
                        </IconWrapper>
                     }
                     text="Lineups"
                     active={activeItem === '/game/Valorant/Agents'}
                     onClick={() => handleClick('/game/Valorant/Agents')}
                  />
               )}
               <div className="border-t border-gray-700 my-4"></div>
               <FollowingSideNav />
            </SideNav>
         </div>
      </>
   );
};

export default SideNavWrapper;
