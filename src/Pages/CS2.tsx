// Main page of the app
import { Header, SideNav, SideNavItems, Searchbar} from "../Components";

import { MdOutlineSettings,  MdOutlineGamepad, MdHome } from "react-icons/md";

const CS2: React.FC = () => {
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
         <div className="flex flex-col items-center">
            <h1 className="text-lg mb-4 pt-10 font-bold">Counter-Strike 2</h1>
            <Searchbar onSearch={handleSearch} placeholder="Search for CS2 Lineups" />
         </div>
      
      </>
   );
};
 
export default CS2;