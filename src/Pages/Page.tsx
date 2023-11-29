import { Header, Game } from "../Components";

import cs2 from '../assets/csgo2.webp';
import valorant from '../assets/valorant.jpg';

const Page = () => {

   return (
      <>
         <Header />
         <div className="h-screen flex flex-row gap-4 justify-center items-center">
            <Game game={"CS2"} name={cs2}/>
            <Game game={"Valorant"} name={valorant}/>
         </div>
      </>
   );
};
 
 export default Page;