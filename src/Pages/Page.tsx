// Main page of the app
import { Header, Game, Footer, SideNavWrapper } from '../Components';

import cs2 from '../assets/csgo2.webp';
import valorant from '../assets/valorant.jpg';

const Page: React.FC = () => {
   return (
      <>
         <Header />

         <SideNavWrapper />

         <div className="h-screen flex">
            <div className="main-content flex-col md:flex-row flex-1 flex justify-center items-center space-x-4">
               <Game game={'CS2'} name={cs2} />
               <Game game={'Valorant'} name={valorant} />
            </div>
         </div>

         <Footer />
      </>
   );
};

export default Page;
