import { Header, Footer, SideNavWrapper } from '../Components';

const About: React.FC = () => {
   return (
      <div
         style={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
         }}
      >
         <Header />

         <SideNavWrapper />
         <div
            className="text-white p-8 sm:pl-8 md:pl-64 lg:pl-64 text-sm md:text-base lg:text-lg"
            style={{ maxWidth: '1500px', flex: '1' }}
         >
            <div
               className="text-white p-8 sm:pl-8 md:pl-64 lg:pl-64 text-sm md:text-base lg:text-lg"
               style={{ maxWidth: '1500px' }}
            >
               <h1 className="text-4xl font-bold text-blue-500 mb-4">
                  About LineupX
               </h1>
               <p className="mb-4">
                  <span className="text-pink-500">LineupX</span> is a
                  community-driven open-source project dedicated to enhancing
                  the gaming experience for players around the globe. Our focus
                  is on lineups, a key element of many FPS games, and we aim to
                  provide a platform for gamers to share and learn from each
                  other. Although lineups aren't required to play FPS games they
                  are a neccesary component if you want to maximize your
                  potential. We currently support Valorant and CS2 but plan to
                  expand to other games in the future.
               </p>

               <h1 className="text-4xl font-bold text-blue-500 mb-4">
                  Our Vision
               </h1>
               <p className="mb-4">
                  Our mission is to provide a platform where gamers can learn
                  and share lineups rapidly. Normally when you want to learn a
                  lineup you would have to watch a video or read a guide, but
                  with LineupX you can learn them in three pictures. We believe
                  that by using three pictures (where you stand to throw the
                  lineup, crosshair placement, and where the lineup lands)
                  players can learn lineups faster.
               </p>

               <h1 className="text-4xl font-bold text-blue-500 mb-4">
                  What is a Lineup?
               </h1>
               <p className="mb-4">
                  The "definition of a lineup" is a set of instructions that a
                  player follows to throw a grenade. They are used in many FPS
                  games such as Counter-Strike: Global Offensive (CS:GO),
                  Valorant, and Overwatch. Players often learn lineups
                  because they provide a competitive edge. These strategies
                  involve deploying utilities like smokes, molotovs, and
                  flashbangs. The purpose behind such tactics
                  includes obstructing the opponent's vision, clearing contested
                  areas, and securing control over key parts of the map
               </p>
            </div>
         </div>
         <Footer />
      </div>
   );
};

export default About;
