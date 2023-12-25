import { useContext, useEffect, useRef } from 'react';
import { Header, Footer, SideNavWrapper } from '../../../Components';
import { AuthContext } from '../../../App';
import 'react-toastify/dist/ReactToastify.css';

const ValorantLineups: React.FC = () => {
   const Auth = useContext(AuthContext);
   const initialRender = useRef(true);

   useEffect(() => {
      if (initialRender.current) {
         initialRender.current = false;
      } else if (Auth?.accessToken && Auth.username) {
      }
   }, [Auth?.username]);

   return (
      <>
         <Header />
         <SideNavWrapper />

         <div className="flex flex-1 h-screen">
            <div className="flex-1 flex justify-center items-center">
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4 ml-10">

               </div>
            </div>
         </div>

         <Footer />
      </>
   );
};

export default ValorantLineups;
