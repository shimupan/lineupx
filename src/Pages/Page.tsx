// Main page of the app
import { Header, Game, SideNav, SideNavItems, Footer } from "../Components";

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
         <div className="h-screen flex">
            <div className="sidebar w-2 z-30 bg-[#181818] shadow-lg "></div>
            <div className="main-content flex-col md:flex-1 flex justify-center items-center space-x-4 pl-[60px] md:pl-0">
                <Game game={"CS2"} name={cs2}/>
                <Game game={"Valorant"} name={valorant}/>
            </div>
            <div className="sidebar w-2 z-30 bg-[#181818] shadow-lg "></div>
         </div>
         <Footer />
      </>
   );
};
 
export default Page;