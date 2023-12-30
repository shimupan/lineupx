import { useEffect, useState } from 'react';
import Posts from '../../Components/Posts';
import { PostType, ValorantAgent } from '../../db.types';
import axios from 'axios';


import {
   Header,
   SideNavWrapper,
   Searchbar,
   Footer,
   Carousel,
} from '../../Components';
import { VALORANT_MAPS, VALORANT_BANNER } from '../../Constants';

const Valorant: React.FC = () => {
   const [posts, setPosts] = useState<PostType[]>([]);
   const [filteredPosts, setFilteredPosts] = useState<PostType[]>([]);
   const [searchTerm, setSearchTerm] = useState('');
   const [suggestions, setSuggestions] = useState<string[]>([]);
   const [agents, setAgents] = useState<ValorantAgent>();

   useEffect(() => {
      document.title = 'Valorant';

      // Function to fetch data
      const fetchData = () => {
         axios
            .get('/post/Valorant')
            .then((res) => {
               setPosts(res.data);
               const titles = res.data.map((post: PostType) => post.postTitle);
               setSuggestions(titles);
            })
            .catch((err) => {
               console.log(err);
            });

         axios
            .get('https://valorant-api.com/v1/agents?isPlayableCharacter=true')
            .then((response) => {
               setAgents(response.data.data);
               const agentNames = agents?.data.map((agent) => agent.displayName) || [];
               setSuggestions(prevSuggestions => [...prevSuggestions, ...agentNames]);
            })
            .catch((err) => {
               console.log(err);
            });
      };

      fetchData();
      console.log(suggestions);
      return () => {};
   }, [suggestions]);

   const handleSearch = (value: string) => {
      setSearchTerm(value);
      let filtered = posts;

      if (value) {
         // Filter posts based on search term
         filtered = posts.filter(
            (post) =>
               post.postTitle.toLowerCase().includes(value.toLowerCase()) ||
               post.valorantAgent.toLowerCase().includes(value.toLowerCase()) ||
               post.mapName.toLowerCase().includes(value.toLowerCase()) ||
               post.ability.toLowerCase().includes(value.toLowerCase()) ||
               post.teamSide?.toLowerCase().includes(value.toLowerCase()),
         );
      } else {
         // If search term is empty, only show the first 10 posts
         filtered = posts.slice(0, 10);
      }

      setFilteredPosts(filtered);
   };

   return (
      <div className="flex flex-col min-h-screen">
         <Header />
         <main className="flex-1">
            <SideNavWrapper />
            <div
               className="flex flex-col items-center h-72 relative bg-center bg-no-repeat"
               style={{
                  backgroundImage: `url(${VALORANT_BANNER})`,
                  backgroundSize: '100%',
                  backgroundPosition: '90% 10%',
               }}
            >
               <div className="absolute inset-0 bg-black bg-opacity-50"></div>
               <h1 className="text-lg mb-4 pt-10 font-bold z-10">Valorant</h1>
               
               <Searchbar
                  onChange={(e) => handleSearch(e.target.value)}
                  onSearch={handleSearch}
                  placeholder="Search for Valorant Lineups"
                  className="z-10"
                  suggestions={suggestions}
               />
            </div>
            <div className="flex flex-col items-center pt-5 pb-5 bg-black bg-opacity-50 backdrop-blur-md">
               <div className="w-1/2">
                  <Carousel images={VALORANT_MAPS} />
               </div>
            </div>
            {/* TODO: STYLING BELOW */}

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 pl-20">
               {(searchTerm === '' ? posts.slice(0, 10) : filteredPosts).map(
                  (post) => (
                     <div
                        key={post.landingPosition.public_id}
                        className="max-w-md mx-auto"
                     >
                        <Posts postData={post} />
                     </div>
                  ),
               )}
            </div>
         </main>
         <Footer className="mt-auto" />
      </div>
   );
};

export default Valorant;
