import { Header, Game } from "../Components";

import VALORANT from '../assets/valorant.jpg';
import CS2 from '../assets/csgo2.webp';

const Page = () => {

   return (
      <>
         <Header />
         <div className="flex flex-col">
            <Game name={CS2}/>
            <Game name={VALORANT}/>
         </div>
      </>
   );
};
 
 export default Page;