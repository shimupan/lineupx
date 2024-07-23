import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MdHome, MdOutlineSettings } from 'react-icons/md';
import cs2Logo from '../../../assets/svg/csgo.svg';
import valorantLogo from '../../../assets/svg/valorant.svg';

const BottomNav: React.FC = () => {
   const location = useLocation();

   const isActive = (path: string) => location.pathname === path;

   return (
      <nav className="md:hidden fixed bottom-0 left-0 z-20 right-0 bg-[#1d0532] text-white">
         <ul className="flex justify-around items-center h-16">
            <li>
               <Link
                  to="/"
                  className={`flex flex-col items-center ${
                     isActive('/') ? 'text-indigo-400' : ''
                  }`}
               >
                  <MdHome size={24} />
                  <span className="text-xs mt-1">Home</span>
               </Link>
            </li>
            <li>
               <Link
                  to="/game/CS2"
                  className={`flex flex-col items-center ${
                     isActive('/game/CS2') ? 'text-indigo-400' : ''
                  }`}
               >
                  <img
                     src={cs2Logo}
                     alt="CS2"
                     width={24}
                     style={{ filter: 'brightness(0) invert(1)' }}
                  />
                  <span className="text-xs mt-1">CS2</span>
               </Link>
            </li>
            <li>
               <Link
                  to="/game/Valorant"
                  className={`flex flex-col items-center ${
                     isActive('/game/Valorant') ? 'text-indigo-400' : ''
                  }`}
               >
                  <img
                     src={valorantLogo}
                     alt="Valorant"
                     width={24}
                     style={{ filter: 'brightness(0) invert(1)' }}
                  />
                  <span className="text-xs mt-1">Valorant</span>
               </Link>
            </li>
            <li>
               <Link
                  to="/profile"
                  className={`flex flex-col items-center ${
                     isActive('/profile') ? 'text-indigo-400' : ''
                  }`}
               >
                  <MdOutlineSettings size={24} />
                  <span className="text-xs mt-1">Profile</span>
               </Link>
            </li>
         </ul>
      </nav>
   );
};

export default BottomNav;
