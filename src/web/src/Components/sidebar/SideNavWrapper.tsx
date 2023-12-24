import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { SideNav, SideNavItems } from '../../Components';
import { MdOutlineSettings, MdHome } from 'react-icons/md';
import cs2Logo from '../../assets/cs2logo.webp';
import valorantLogo from '../../assets/valorantlogo.webp';

type SideNavWrapperProps = {
   className?: string;
};

const SideNavWrapper: React.FC<SideNavWrapperProps> = ({ className }) => {
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
      <div className={`side-nav-wrapper ${className}`}>
         <SideNav>
            <SideNavItems
               icon={<MdHome size={25} />}
               text="Home"
               active={activeItem === '/'}
               onClick={() => handleClick('/')}
            />
            <SideNavItems
               icon={<img src={cs2Logo} alt="CS2" width={25} />}
               text="CS 2"
               active={activeItem === '/CS2'}
               onClick={() => handleClick('/CS2')}
            />
            <SideNavItems
               icon={<img src={valorantLogo} alt="Valorant" width={25} />}
               text="Valorant"
               active={activeItem === '/Valorant'}
               onClick={() => handleClick('/Valorant')}
            />
            <SideNavItems
               icon={<MdOutlineSettings size={25} />}
               text="Profile"
               active={activeItem === '/user/ooccupate'}
               onClick={() => handleClick('/user/ooccupate')}
               alert
            />
         </SideNav>
      </div>
   );
};

export default SideNavWrapper;
