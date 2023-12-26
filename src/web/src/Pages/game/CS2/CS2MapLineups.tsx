import React, { useContext, useEffect } from 'react';
import { Header, Footer, SideNavWrapper } from '../../../Components';
import { AuthContext } from '../../../App';


const CS2Lineups: React.FC = () => {
   const Auth = useContext(AuthContext);


   useEffect(() => {

      if (Auth?.accessToken && Auth.username) {
         // Your authentication related logic
      }
   }, [Auth?.username,]);



   return (
      <>
         <Header />
         <SideNavWrapper />
         

         <Footer />
      </>
   );
};

export default CS2Lineups;
