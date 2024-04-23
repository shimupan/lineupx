// Main page of the app
import { useContext, useEffect, useRef } from 'react';
import { Header, Game, Footer, SideNavWrapper } from '../Components';
import { AuthContext } from '../App';
import { ToastContainer, toast } from 'react-toastify';

import cs2 from '../assets/csgo2.webp';
import valorant from '../assets/valorant.webp';

const GREETINGS = [
   'Welcome ',
   'Hello ',
   'Hi ',
   'Hey ',
   'Howdy ',
   'Greetings ',
   'Salutations ',
   'Bonjour ',
   'Ciao ',
   'Hola ',
];

const Page: React.FC = () => {
   const Auth = useContext(AuthContext);
   const initialRender = useRef(true);
   useEffect(() => {
      if (initialRender.current) {
         initialRender.current = false;
      } else if (Auth?.accessToken && Auth.username) {
         toast(
            '👋 ' +
               GREETINGS[Math.floor(Math.random() * GREETINGS.length)] +
               Auth.username +
               '!',
         );
      }
   }, [Auth?.username]);

   return (
      <>
         <Header />

         <SideNavWrapper />

         <div className="h-screen flex">
            <div className="main-content flex-col md:flex-row flex-1 flex justify-center items-center space-x-4">
               <Game game={'game/CS2'} name={cs2} />
               <Game game={'game/Valorant'} name={valorant} />
            </div>
         </div>

         <Footer />

         <ToastContainer
            position="top-center"
            autoClose={500}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss={false}
            draggable
            pauseOnHover={false}
            theme="colored"
         />
      </>
   );
};

export default Page;