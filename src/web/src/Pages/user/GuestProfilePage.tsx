import { useNavigate } from 'react-router-dom';
import { Header, SideNavWrapper, Footer } from '../../Components';
import { FaUserCircle } from 'react-icons/fa';

const GuestPage = () => {
   const navigate = useNavigate();

   const handleSignInClick = () => {
      navigate('/login');
   };

   return (
      <>
         <Header />
         <SideNavWrapper />
         <div className="flex flex-col items-center justify-center h-[calc(100vh-80px-60px)] text-center p-4">
            <FaUserCircle className="text-6xl mb-4 text-gray-500" />
            <h2 className="text-2xl font-semibold mb-2">
               Learn and Share Lineups
            </h2>
            <p className="text-gray-500 mb-4">
               Sign in to access lineups that you've uploaded and saved.
            </p>
            <button
               onClick={handleSignInClick}
               className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-300"
            >
               Sign In
            </button>
         </div>
         <Footer />
      </>
   );
};

export default GuestPage;
