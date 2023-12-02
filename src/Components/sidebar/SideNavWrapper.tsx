import { SideNav, SideNavItems } from "../../Components";

import { MdOutlineSettings,  MdOutlineGamepad, MdHome } from "react-icons/md";

const SideNavWrapper: React.FC = () => {
   
   return (
    <SideNav>
        <SideNavItems icon={<MdHome size={25} />} text="Home" active />
        <SideNavItems icon={<MdOutlineGamepad size={25} />} text=" CS 2" />
        <SideNavItems icon={<MdOutlineGamepad size={25} />} text="Valorant" />
        <SideNavItems icon={<MdOutlineSettings size={25} />} text="Settings" alert />
    </SideNav>
   );
};

export default SideNavWrapper;