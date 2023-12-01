import { Header, Game, Footer } from "../Components";

import cs2 from '../assets/csgo2.webp';
import valorant from '../assets/valorant.jpg';

const Page = () => {
   return (
      <>
         <Header />
         <div className="h-screen flex">
            <div className="sidebar w-2 z-30 bg-[#181818] shadow-lg "></div>
            <div className="main-content flex-1 flex justify-center items-center">
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