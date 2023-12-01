// Main page of the app
import { Header, SideNav, SideNavItems, Footer, Searchbar} from "../Components";

import { MdOutlineSettings,  MdOutlineGamepad, MdHome } from "react-icons/md";

const Valorant: React.FC = () => {

   const handleSearch = (searchTerm: string) => {
      console.log('Searching for:', searchTerm);
         // TODO: Implement search functionality and logic
      };
      
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
            <div className="main-content flex-col md:flex-row flex-1 flex justify-center items-start space-x-4 pt-10">
               <Searchbar onSearch={handleSearch} placeholder="Search for Valorant Lineups" />
            </div>
         </div>
         <Footer />
      </>
   );
};
 
export default Valorant;