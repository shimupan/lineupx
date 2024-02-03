import { Header, Footer, SideNavWrapper } from '../Components';

const About: React.FC = () => {
   return (
      <>
         <Header />

         <SideNavWrapper />
         <div className=" text-white p-8 sm:pl-8 md:pl-32 lg:pl-64">
               <h1 className="text-4xl font-bold text-blue-500 mb-4">About LineupX</h1>
               <p className="mb-4">
                 Welcome to <span className="text-pink-500">LineupX</span>, a community-driven, open-source project dedicated to enhancing the gaming experience for players around the globe...
               </p>
               {/* Continue with the content, utilizing Tailwind CSS for styling */}
            </div>
         <Footer />
      </>
   );
};

export default About;
