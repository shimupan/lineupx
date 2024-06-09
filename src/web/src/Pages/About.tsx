import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header, Footer, SideNavWrapper } from '../Components';
import HeroImage from '../assets/hero.webp'; // Replace with your hero image

const About: React.FC = () => {
   const [showMore, setShowMore] = useState(false);
   const [scrollPosition, setScrollPosition] = useState(0);
   const navigate = useNavigate();

   useEffect(() => {
      const handleScroll = () => {
         setScrollPosition(window.scrollY);
      };

      window.addEventListener('scroll', handleScroll);

      return () => {
         window.removeEventListener('scroll', handleScroll);
      };
   }, []);

   const handleSignInClick = () => {
      navigate('/register');
   };

   return (
      <div className="flex flex-col min-h-screen bg-gray-900 text-white">
         <Header />
         <SideNavWrapper />
         <div className="flex-1 pt-16 px-8 sm:pl-8 md:pl-64 lg:pl-64 text-sm md:text-base lg:text-lg max-w-6xl">
            <div
               className="relative mb-16 transition-transform duration-300"
               style={{ transform: `translateY(${scrollPosition * 0.1}px)` }}
            >
               <img
                  src={HeroImage}
                  alt="LineupX Hero"
                  className="w-full h-128 sm:h-120 object-cover rounded-lg backdrop-blur"
               />
               <div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center transition-opacity duration-300"
                  style={{ opacity: scrollPosition / 200 + 0.5 }}
               >
                  <h1
                     className="text-4xl font-bold text-blue-500 mb-4 transition-transform duration-300"
                     style={{
                        transform: `translateY(${scrollPosition * 0.1}px)`,
                     }}
                  >
                     LineupX: Empowering FPS Gamers
                  </h1>
                  <p
                     className="text-lg font-light transition-opacity duration-300"
                     style={{ opacity: scrollPosition / 200 + 0.5 }}
                  >
                     Learn, Share, and Master Lineups
                  </p>
               </div>
            </div>

            {/* About LineupX Section */}
            <div
               className="mb-16 transition-opacity duration-300"
               style={{ opacity: scrollPosition / 100 + 0.5 }}
            >
               <h2 className="text-3xl font-bold mb-4">About LineupX</h2>
               <div className="flex items-center mb-4">
                  <p
                     className="text-lg transition-opacity duration-300"
                     style={{ opacity: scrollPosition / 100 + 0.5 }}
                  >
                     LineupX is a community-driven platform dedicated to
                     enhancing the gaming experience for FPS players. We focus
                     on lineups, a crucial element in many FPS games.
                  </p>
               </div>
               <p
                  className="text-lg transition-opacity duration-300"
                  style={{ opacity: scrollPosition / 100 + 0.5 }}
               >
                  Our mission is to provide a platform where gamers can learn
                  and share lineups rapidly. We believe that by using three
                  pictures (where you stand, crosshair placement, and the
                  lineup's landing point), players can learn lineups faster.
               </p>
               <button
                  onClick={() => setShowMore(!showMore)}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
               >
                  {showMore ? 'Show Less' : 'Show More'}
               </button>
               {showMore && (
                  <p
                     className="text-lg mt-4 transition-opacity duration-300"
                     style={{ opacity: scrollPosition / 100 + 0.5 }}
                  >
                     LineupX currently supports Valorant and CS2, with plans to
                     expand to other games. Join us and become a part of the
                     growing community!
                  </p>
               )}
            </div>

            {/* Our Vision Section */}
            <div
               className="mb-16 transition-opacity duration-300"
               style={{ opacity: scrollPosition / 100 + 0.5 }}
            >
               <h2 className="text-3xl font-bold mb-4">Our Vision</h2>
               <p
                  className="text-lg transition-opacity duration-300"
                  style={{ opacity: scrollPosition / 100 + 0.5 }}
               >
                  Our vision is to create a comprehensive and user-friendly
                  resource for all FPS players who want to improve their game
                  through lineups. We strive to make learning lineups a fun and
                  intuitive experience.
               </p>
            </div>

            {/* What is a Lineup? Section */}
            <div
               className="mb-16 transition-opacity duration-300"
               style={{ opacity: scrollPosition / 100 + 0.5 }}
            >
               <h2 className="text-3xl font-bold mb-4">What is a Lineup?</h2>
               <p
                  className="text-lg transition-opacity duration-300"
                  style={{ opacity: scrollPosition / 100 + 0.5 }}
               >
                  A lineup is a set of instructions that a player follows to
                  throw a grenade in a specific way. They are used in many FPS
                  games, including CS:GO, Valorant, and Overwatch. Lineups can
                  provide a competitive edge by creating advantageous scenarios
                  for the player.
               </p>
            </div>

            {/* Call to Action Section */}
            <div
               className="text-center transition-opacity duration-300"
               style={{ opacity: scrollPosition / 100 + 0.5 }}
            >
               <button
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                  onClick={handleSignInClick}
               >
                  Join the LineupX Community
               </button>
            </div>
         </div>
         <Footer />
      </div>
   );
};

export default About;
