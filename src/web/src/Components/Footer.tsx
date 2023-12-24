import github from '../assets/github.png';

interface FooterProps {
   className?: string;
}

const Footer: React.FC<FooterProps> = ({ className }) => {
   return (
      <footer
         className={` text-center lg:text-left static bottom-0 w-screen ${className}`}
      >
         <div className='flex justify-center items-center'>
            <div className='flex ml-4'>
               <span className='mr-4'>
                  {new Date().getFullYear()} LineupX. All rights reserved.
               </span>
               <a
                  href='https://github.com/shimupan/lineupx'
                  className='flex items-center'
               >
                  <img src={github} alt='GitHub' width='24' height='24' />
               </a>
            </div>
            <div className='flex flex-wrap justify-center'>
               <a href='#!' className='mr-6 text-gray-600'>
                  <i className='fab fa-facebook-f'></i>
               </a>
               <a href='#!' className='mr-6 text-gray-600'>
                  <i className='fab fa-twitter'></i>
               </a>
               <a href='#!' className='mr-6 text-gray-600'>
                  <i className='fab fa-google-plus-g'></i>
               </a>
               <a href='#!' className='mr-6 text-gray-600'>
                  <i className='fab fa-linkedin-in'></i>
               </a>
               <a href='#!' className='text-gray-600'>
                  <i className='fab fa-instagram'></i>
               </a>
            </div>
         </div>
      </footer>
   );
};

export default Footer;
