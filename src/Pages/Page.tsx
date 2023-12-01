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
            <div className="main-content flex-col md:flex-row flex-1 flex justify-center items-center space-x-4">
                <Game game={"CS2"} name={cs2}/>
                <Game game={"Valorant"} name={valorant}/>
            </div>
         </div>
         <Footer />
      </>
   );
};
 
export default Page;