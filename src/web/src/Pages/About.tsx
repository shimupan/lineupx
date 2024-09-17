import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Layout } from '../Components';
import HeroImage from '../assets/hero.webp';
import { FaUpload, FaSync, FaMedal, FaThumbsUp } from 'react-icons/fa';

const About: React.FC = () => {
   const [showMore, setShowMore] = useState(false);
   const navigate = useNavigate();

   const handleSignInClick = () => navigate('/register');

   const fadeIn = {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { duration: 0.6 } },
   };

   const slideUp = {
      hidden: { y: 50, opacity: 0 },
      visible: { y: 0, opacity: 1, transition: { duration: 0.6 } },
   };

   return (
      <Layout>
         <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white"
         >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28">
               {/* Hero Section */}
               <motion.div
                  variants={slideUp}
                  className="relative mb-24 overflow-hidden rounded-2xl"
               >
                  <img
                     src={HeroImage}
                     alt="LineupX Hero"
                     className="w-full h-[60vh] object-cover filter brightness-50"
                  />
                  <motion.div
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ delay: 0.5, duration: 0.8 }}
                     className="absolute inset-0 flex flex-col justify-center items-center text-center p-6"
                  >
                     <h1 className="text-5xl md:text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
                        LineupX: Empowering FPS Gamers
                     </h1>
                     <p className="text-xl md:text-2xl font-light">
                        Learn, Share, and Master Lineups
                     </p>
                  </motion.div>
               </motion.div>

               {/* About LineupX Section */}
               <motion.section variants={slideUp} className="mb-24">
                  <h2 className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
                     About LineupX
                  </h2>
                  <div className="space-y-4">
                     <p className="text-xl">
                        LineupX is a community-driven platform dedicated to
                        enhancing the gaming experience for FPS players. We
                        focus on lineups, a crucial element in many FPS games.
                     </p>
                     <p className="text-xl">
                        Our mission is to provide a platform where gamers can
                        learn and share lineups rapidly. We believe that by
                        using three pictures (where you stand, crosshair
                        placement, and the lineup's landing point), players can
                        learn lineups faster.
                     </p>
                     <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{
                           height: showMore ? 'auto' : 0,
                           opacity: showMore ? 1 : 0,
                        }}
                        transition={{ duration: 0.3 }}
                     >
                        <p className="text-xl">
                           LineupX currently supports Valorant and CS2, with
                           plans to expand to other games. Join us and become a
                           part of the growing community!
                        </p>
                     </motion.div>
                     <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowMore(!showMore)}
                        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-full transition duration-300"
                     >
                        {showMore ? 'Show Less' : 'Show More'}
                     </motion.button>
                  </div>
               </motion.section>

               {/* Our Vision Section */}
               <motion.section variants={slideUp} className="mb-24">
                  <h2 className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
                     Our Vision
                  </h2>
                  <p className="text-xl">
                     Our vision is to create a comprehensive and user-friendly
                     resource for all FPS players who want to improve their game
                     through lineups. We strive to make learning lineups a fun
                     and intuitive experience.
                  </p>
               </motion.section>

               {/* What is a Lineup? Section */}
               <motion.section variants={slideUp} className="mb-24">
                  <h2 className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
                     What is a Lineup?
                  </h2>
                  <p className="text-xl">
                     A lineup is a set of instructions that a player follows to
                     throw a grenade in a specific way. They are used in many
                     FPS games, including CS:GO, Valorant, and Overwatch.
                     Lineups can provide a competitive edge by creating
                     advantageous scenarios for the player.
                  </p>
               </motion.section>

               {/* Call to Action Section */}
               <motion.section variants={slideUp} className="text-center mb-24">
                  <h2 className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                     Level Up Your Game
                  </h2>
                  <p className="text-xl mb-8">
                     Unlock exclusive features and join the elite by creating an
                     account.
                  </p>
                  <motion.button
                     whileHover={{ scale: 1.05 }}
                     whileTap={{ scale: 0.95 }}
                     className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300"
                     onClick={handleSignInClick}
                  >
                     Join the LineupX Community
                  </motion.button>

                  <motion.div
                     variants={slideUp}
                     className="mt-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12"
                  >
                     {[
                        {
                           icon: FaUpload,
                           title: 'Upload Lineups',
                           description:
                              'Share your killer lineups with the community.',
                        },
                        {
                           icon: FaSync,
                           title: 'Sync Saved Lineups',
                           description:
                              'Keep your lineups synced across all your devices.',
                        },
                        {
                           icon: FaThumbsUp,
                           title: 'Support Lineups',
                           description:
                              'Like lineups you love and boost their visibility.',
                        },
                        {
                           icon: FaMedal,
                           title: 'Earn Recognition',
                           description:
                              'Get recognized for your awesome lineups.',
                        },
                     ].map((item, index) => (
                        <motion.div
                           key={index}
                           whileHover={{ scale: 1.05 }}
                           className="flex flex-col items-center text-center p-6 bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition duration-300"
                        >
                           <item.icon
                              className="text-blue-500 mb-4"
                              size={48}
                           />
                           <h3 className="text-xl font-bold mb-2">
                              {item.title}
                           </h3>
                           <p className="text-gray-300">{item.description}</p>
                        </motion.div>
                     ))}
                  </motion.div>
               </motion.section>
            </div>
         </motion.div>
      </Layout>
   );
};

export default About;
