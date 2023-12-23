import {
   Header,
   SideNavWrapper,
   Searchbar,
   Footer,
   ValorantCarousel,
} from '../../Components';
import valorantbanner from '../../assets/valorantbanner.webp';

const Valorant: React.FC = () => {
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
                  backgroundImage: `url(${valorantbanner})`,
                  backgroundSize: '100%',
                  backgroundPosition: '90% 10%',
               }}
            >
               <div className="absolute inset-0 bg-black bg-opacity-50"></div>
               <h1 className="text-lg mb-4 pt-10 font-bold z-10">Valorant</h1>
               <Searchbar
                  onSearch={handleSearch}
                  placeholder="Search for Valorant Lineups"
                  className="z-10"
               />
            </div>
            <div className="flex flex-col items-center pt-5 pb-5 bg-black bg-opacity-50 backdrop-blur-md">
               <div className="w-1/2">
                  <ValorantCarousel />
               </div>
            </div>
         </main>
         <Footer className="mt-auto" />
      </div>
   );
};

export default Valorant;
