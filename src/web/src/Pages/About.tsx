import React from 'react';
import { Header, Footer, SideNavWrapper } from '../Components';

const About: React.FC = () => {
   return (
      <div className="flex flex-col min-h-screen">
         <Header />
         <SideNavWrapper />
         <div className="flex-1 pt-16 px-8 text-white sm:pl-8 md:pl-64 lg:pl-64 text-sm md:text-base lg:text-lg max-w-6xl">
            <Section
               title="About LineupX"
               content="LineupX is a community-driven open-source project dedicated to enhancing the gaming experience for players around the globe. Our focus is on lineups, a key element of many FPS games, and we aim to provide a platform for gamers to share and learn from each other. Although lineups aren't required to play FPS games they are a necessary component if you want to maximize your potential. We currently support Valorant and CS2 but plan to expand to other games in the future."
            />
            <Section
               title="Our Vision"
               content="Our mission is to provide a platform where gamers can learn and share lineups rapidly. Normally when you want to learn a lineup you would have to watch a video or read a guide, but with LineupX you can learn them in three pictures. We believe that by using three pictures (where you stand to throw the lineup, crosshair placement, and where the lineup lands) players can learn lineups faster."
            />
            <Section
               title="What is a Lineup?"
               content="The 'definition of a lineup' is a set of instructions that a player follows to throw a grenade. They are used in many FPS games such as Counter-Strike: Global Offensive (CS:GO), Valorant, and Overwatch. Players often learn lineups because they provide a competitive edge. These strategies involve deploying utilities like smokes, molotovs, and flashbangs. The purpose behind such tactics includes obstructing the opponent's vision, clearing contested areas, and securing control over key parts of the map."
            />
         </div>
         <Footer />
      </div>
   );
};

const Section: React.FC<{ title: string; content: string }> = ({
   title,
   content,
}) => (
   <div className="mb-4">
      <h1 className="text-4xl font-bold text-blue-500 mb-4">{title}</h1>
      <p>{content}</p>
   </div>
);

export default About;
