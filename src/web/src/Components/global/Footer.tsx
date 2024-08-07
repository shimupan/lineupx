import github from '../../assets/github.webp';

interface FooterProps {
   className?: string;
}

const Footer: React.FC<FooterProps> = ({ className }) => {
   return (
      <>
         <footer
            className={`text-center text-sm ${className} p-4 rounded-lg shadow-md mt-8`}
         >
            <div className="container mx-auto flex flex-col sm:flex-row justify-center items-center pl-16 sm:pl-0">
               <div className="flex flex-col sm:flex-row items-center mb-4 sm:mb-0 text-center sm:text-left">
                  {new Date().getFullYear()} LineupX. All rights reserved.
                  <a
                     href="https://github.com/shimupan/lineupx"
                     className="flex justify-center sm:justify-start items-center mt-2 sm:mt-0"
                  >
                     <img src={github} alt="GitHub" width="24" height="24" />
                  </a>
                  <a
                     href="/privatepolicy"
                     className="flex justify-center sm:justify-start items-center text-gray-300 pl-4 hover:text-gray-100 mt-2 sm:mt-0"
                  >
                     Privacy Policy
                  </a>
                  <a
                     href="/about"
                     className="flex justify-center sm:justify-start items-center text-gray-300 pl-4 hover:text-gray-100 mt-2 sm:mt-0"
                  >
                     About LineupX
                  </a>
                  <a
                     href="/tos"
                     className="flex justify-center sm:justify-start items-center text-gray-300 pl-4 hover:text-gray-100 mt-2 sm:mt-0"
                  >
                     Terms of Service
                  </a>
               </div>
               <div className="flex justify-center mt-4 sm:mt-0">
                  <a
                     href="#!"
                     className="mx-2 text-gray-300 hover:text-gray-100"
                  >
                     <i className="fab fa-facebook-f"></i>
                  </a>
                  <a
                     href="#!"
                     className="mx-2 text-gray-300 hover:text-gray-100"
                  >
                     <i className="fab fa-twitter"></i>
                  </a>
                  <a
                     href="#!"
                     className="mx-2 text-gray-300 hover:text-gray-100"
                  >
                     <i className="fab fa-google-plus-g"></i>
                  </a>
                  <a
                     href="#!"
                     className="mx-2 text-gray-300 hover:text-gray-100"
                  >
                     <i className="fab fa-linkedin-in"></i>
                  </a>
                  <a
                     href="#!"
                     className="mx-2 text-gray-300 hover:text-gray-100"
                  >
                     <i className="fab fa-instagram"></i>
                  </a>
               </div>
            </div>
         </footer>
      </>
   );
};

export default Footer;
