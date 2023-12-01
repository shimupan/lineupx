// Main page of the app
import { Header, Game, SideNav, SideNavItems } from "../Components";

import { MdOutlineSettings,  MdOutlineGamepad, MdHome } from "react-icons/md";

import cs2 from '../assets/csgo2.webp';
import valorant from '../assets/valorant.jpg';

const Page: React.FC = () => {

   return (
      <>
         <Header />
         <SideNav>
            <SideNavItems icon={<MdHome size={25} />} text="Home" active />
            <SideNavItems icon={<MdOutlineGamepad size={25} />} text=" CS 2" />
            <SideNavItems icon={<MdOutlineGamepad size={25} />} text="Valorant" />
            <SideNavItems icon={<MdOutlineSettings size={25} />} text="Settings" alert />
         </SideNav>
         <div className="h-screen flex flex-row gap-4 justify-center items-center">
            <Game game={"CS2"} name={cs2}/>
            <Game game={"Valorant"} name={valorant}/>
         </div>
      </>
   );
};
 
 export default Page;