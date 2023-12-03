import { useContext } from "react";
import { Header, SideNavWrapper, Footer } from "../Components";
import { AuthContext } from "../App";

const ProfilePage = () => {
   const Auth = useContext(AuthContext);
   return (
      <>
         <Header />
         <SideNavWrapper />
         <div className="h-screen">
            <div>
               <div className="bg-gradient-to-r from-purple-900 via-blue-700 to-cyan-400 h-[300px] flex justify-center relative">
                  <img src={`https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true&name=${Auth?.username ? Auth?.username : "Guest"}`} className="ml-[2px] rounded-md cursor-pointer absolute top-[275px] w-[100px]"/>
               </div>
            </div>
            <div className="w-screen h-[200px] flex flex-col justify-center items-center">
               <div>
                  {Auth?.username}
               </div>
               <div>
                  {Auth?.email}
               </div>
            </div>
         </div>
         <Footer />
      </>
   );
};
 
 export default ProfilePage;