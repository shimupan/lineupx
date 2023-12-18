import { Header, SideNavWrapper, Searchbar, Footer, ValorantCarousel } from '../../Components';
import valorantbanner from '../../assets/valorantbanner.webp';

const Valorant: React.FC = () => {
   const handleSearch = (searchTerm: string) => {
      console.log('Searching for:', searchTerm);
      // TODO: Implement search functionality and logic
   };

   return (
      <div className='flex flex-col min-h-screen'>
         {' '}
         {/* Flex container with minimum height of the screen */}
         <Header />
         <main className='flex-1'>
            {' '}
            {/* Main content expands to fill available space */}
            <SideNavWrapper />
            <div
               className='flex flex-col items-center h-72 relative'
               style={{
                  backgroundImage: `url(${valorantbanner})`,
                  backgroundSize: '100%',
                  backgroundPosition: '90% 10%',
               }}
            >
               <div
                  style={{
                     position: 'absolute',
                     top: 0,
                     left: 0,
                     width: '100%',
                     height: '100%',
                     background:
                        'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5))',
                  }}
               ></div>
               <h1 className='text-lg mb-4 pt-10 font-bold z-10'>VALORANT</h1>
               <Searchbar
                  onSearch={handleSearch}
                  placeholder='Search for Valorant Lineups'
                  className='z-10'
               />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
               <div style={{ width: '50%' }}>
                  <ValorantCarousel />
               </div>
            </div>
         </main>
         <Footer className='mt-auto' />
      </div>
   );
};

export default Valorant;
