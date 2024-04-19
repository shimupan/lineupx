import github from '../../assets/github.webp';

interface FooterProps {
   className?: string;
}
const Footer: React.FC<FooterProps> = ({ className }) => {
   return (
      <>
         <footer className={`text-center ${className} p-4`}>
            <div className="flex flex-col sm:flex-row justify-center items-center">
               <div className="flex flex-col sm:flex-row items-center mb-4 sm:mb-0">
                  <span className="mr-4">
                     {new Date().getFullYear()} LineupX. All rights reserved.
                  </span>
                  <a
                     href="https://github.com/shimupan/lineupx"
                     className="flex items-center"
                  >
                     <img src={github} alt="GitHub" width="24" height="24" />
                  </a>
               </div>
               <div className="flex justify-center">
                  <a href="#!" className="mx-2 text-gray-600">
                     <i className="fab fa-facebook-f"></i>
                  </a>
                  <a href="#!" className="mx-2 text-gray-600">
                     <i className="fab fa-twitter"></i>
                  </a>
                  <a href="#!" className="mx-2 text-gray-600">
                     <i className="fab fa-google-plus-g"></i>
                  </a>
                  <a href="#!" className="mx-2 text-gray-600">
                     <i className="fab fa-linkedin-in"></i>
                  </a>
                  <a href="#!" className="mx-2 text-gray-600">
                     <i className="fab fa-instagram"></i>
                  </a>
               </div>
            </div>
         </footer>
      </>
   );
};

export default Footer;
