import {
   Header,
   SideNavWrapper,
   Searchbar,
   Footer,
   CS2Carousel,
} from '../../Components';
import cs2banner from '../../assets/cs2banner.png';

const CS2: React.FC = () => {
   const handleSearch = (searchTerm: string) => {
      console.log('Searching for:', searchTerm);
      // TODO: Implement search functionality and logic
   };

   return (
      <div className="flex flex-col min-h-screen">
         <Header />
         <main className="flex-1">
            <SideNavWrapper />
            <div
               className="flex flex-col items-center h-72 relative bg-center bg-no-repeat"
               style={{
                  backgroundImage: `url(${cs2banner})`,
                  backgroundSize: '100%',
                  backgroundPosition: '90% 10%',
               }}
            >
               <div className="absolute inset-0 bg-black bg-opacity-50"></div>
               <h1 className="text-lg mb-4 pt-10 font-bold z-10">
                  Counter-Strike 2
               </h1>
               <Searchbar
                  onSearch={handleSearch}
                  placeholder="Search for CS2 Lineups"
                  className="z-10"
               />
            </div>
            <div className="flex flex-col items-center pt-5 pb-5 bg-black bg-opacity-50 backdrop-blur-md">
               <div className="w-1/2">
                  <CS2Carousel />
               </div>
            </div>
         </main>
         <Footer className="mt-auto" />
      </div>
   );
};

export default CS2;
