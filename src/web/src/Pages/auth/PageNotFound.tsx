import { Link } from 'react-router-dom';
import { Header, SideNavWrapper, Footer, BottomNav } from '../../Components';
import useIsMobile from '../../hooks/isMobile';

const PageNotFound = () => {
   const isMobile = useIsMobile();
   return (
      <>
         <Header />
         {!isMobile && <SideNavWrapper />}
         <div className="w-full px-16 md:px-0 h-screen flex items-center justify-center">
            <div className="bg-white border border-gray-200 flex flex-col items-center justify-center px-4 md:px-8 lg:px-24 py-8 rounded-lg shadow-2xl">
               <p className="text-6xl md:text-7xl lg:text-9xl font-bold tracking-wider text-gray-300">
                  404
               </p>
               <p className="text-2xl md:text-3xl lg:text-5xl font-bold tracking-wider text-gray-500 mt-4">
                  Oops! Page not found
               </p>
               <p className="text-gray-500 mt-4 text-center">
                  Oops! The page you are looking for does not exist.
               </p>
               <p className="text-gray-500 pb-4 border-b-2 text-center">
                  It might have been moved or deleted.
               </p>
               <Link
                  to={'/'}
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-gray-100 px-4 py-2 mt-6 rounded transition duration-150"
                  title="Return Home"
               >
                  <span>Return Home</span>
               </Link>
            </div>
         </div>
         <Footer />
         <div style={{ paddingTop: '80px' }}>{isMobile && <BottomNav />}</div>
      </>
   );
};

export default PageNotFound;
