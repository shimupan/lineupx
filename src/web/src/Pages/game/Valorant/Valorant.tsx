import React, { useEffect, useState, useRef } from 'react';
import Posts from '../../../Components/post/Posts';
import { PostType } from '../../../global.types';
import axios from 'axios';
import {
   Header,
   SideNavWrapper,
   Searchbar,
   Footer,
   Carousel,
   ValorantPopup,
} from '../../../Components';
import { VALORANT_MAPS, VALORANT_BANNER } from '../../../Constants';
import { useLocalStorage } from '../../../hooks';
import { FaSpinner } from 'react-icons/fa';

const Valorant: React.FC = () => {
   const [open, setOpen] = useState<boolean>(true);
   const [posts, setPosts] = useState<PostType[]>([]);
   const [value, setValue] = useLocalStorage('valorantPopup', true);
   const [suggestions, setSuggestions] = useState<string[]>([]);
   const [page, setPage] = useState(1);
   const [hasMore, setHasMore] = useState(true);
   const [isLoading, setIsLoading] = useState(false);

   const pageRef = useRef(page);
   const loadingTriggerRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
      pageRef.current = page;
   }, [page]);

   // Function to fetch data
   const fetchData = async () => {
      setIsLoading(true);
      const currentPage = pageRef.current;
      try {
         const postsResponse = await axios.get(
            `/post/Valorant?page=${currentPage}&limit=20&recent=true`,
         );
         if (postsResponse.data.length > 0) {
            setPosts((prevPosts) =>
               [...prevPosts, ...postsResponse.data].reverse(),
            );
            setPage((prevPage) => prevPage + 1);
         } else {
            setHasMore(false);
         }
         setIsLoading(false);
         const titles = postsResponse.data.map(
            (post: PostType) => `${post.postTitle}`,
         );

         const agentsResponse = await axios.get(
            'https://valorant-api.com/v1/agents?isPlayableCharacter=true',
         );

         const mapsResponse = await fetch('https://valorant-api.com/v1/maps');
         const mapsData = await mapsResponse.json();
         const mapTitles = mapsData.data.map(
            (map: { displayName: string }) => `${map.displayName}`,
         );

         // Extract displayNames for suggestions
         const displayNames = agentsResponse.data.data.map(
            (agent: { displayName: string }) => `${agent.displayName}`,
         );

         const abilities = agentsResponse.data.data.flatMap(
            (agent: {
               displayName: string;
               abilities: {
                  displayName: string;
               }[];
            }) => {
               return agent.abilities.map(
                  (ability) => `${ability.displayName}`,
               );
            },
         );

         const itemsToRemove = [
            'The Range',
            'Kasbah',
            'District',
            'Piazza',
            'Drift',
         ].map((item) => item.toLowerCase().trim());
         const filteredSuggestions = suggestions.filter(
            (suggestion) =>
               !itemsToRemove.includes(suggestion.toLowerCase().trim()),
         );
         setSuggestions((prevSuggestions) => [
            ...new Set([
               ...titles,
               ...prevSuggestions,
               ...mapTitles,
               ...displayNames,
               ...abilities,
               ...filteredSuggestions,
            ]),
         ]);
      } catch (err) {
         console.log(err);
         setHasMore(false);
         setIsLoading(false);
      }
   };

   const getSuggestions = async () => {
      try {
         const postsResponse = await axios.get(`/post/Valorant`);
         const titles = postsResponse.data.map(
            (post: PostType) => `${post.postTitle}`,
         );

         const agentsResponse = await axios.get(
            'https://valorant-api.com/v1/agents?isPlayableCharacter=true',
         );

         const mapsResponse = await fetch('https://valorant-api.com/v1/maps');
         const mapsData = await mapsResponse.json();
         const mapTitles = mapsData.data.map(
            (map: { displayName: string }) => `${map.displayName}`,
         );

         // Extract displayNames for suggestions
         const displayNames = agentsResponse.data.data.map(
            (agent: { displayName: string }) => `${agent.displayName}`,
         );

         const abilities = agentsResponse.data.data.flatMap(
            (agent: {
               displayName: string;
               abilities: {
                  displayName: string;
               }[];
            }) => {
               return agent.abilities.map(
                  (ability) => `${ability.displayName}`,
               );
            },
         );

         const itemsToRemove = [
            'The Range',
            'Kasbah',
            'District',
            'Piazza',
            'Drift',
         ].map((item) => item.toLowerCase().trim());
         const filteredSuggestions = suggestions.filter(
            (suggestion) =>
               !itemsToRemove.includes(suggestion.toLowerCase().trim()),
         );
         setSuggestions((prevSuggestions) => [
            ...new Set([
               ...titles,
               ...prevSuggestions,
               ...mapTitles,
               ...displayNames,
               ...abilities,
               ...filteredSuggestions,
            ]),
         ]);
      } catch (err) {
         console.log(err);
      }
   };

   useEffect(() => {
      document.title = 'Valorant';
      getSuggestions();
      setPosts([]); // Reset posts when component mounts
      setPage(1); // Reset to first page
      setHasMore(true); // Reset loading state
   }, []);

   useEffect(() => {
      if (posts.length === 0 && hasMore) {
         fetchData();
      }
   }, []);

   const handleSearch = (value: string) => {
      value = value.toLowerCase();
   };

   const handleObserver = (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && hasMore && !isLoading) {
         fetchData();
      }
   };

   useEffect(() => {
      const observer = new IntersectionObserver(handleObserver, {
         root: null,
         rootMargin: '100px',
         threshold: 0.1,
      });

      if (loadingTriggerRef.current) {
         observer.observe(loadingTriggerRef.current);
      }

      return () => {
         if (loadingTriggerRef.current) {
            observer.unobserve(loadingTriggerRef.current);
         }
      };
   }, [hasMore, isLoading]);

   return (
      <>
         {value && open && (
            <ValorantPopup setOpen={setOpen} setValue={setValue} />
         )}
         <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">
               <SideNavWrapper />
               <div
                  className="flex flex-col items-center h-96 relative bg-center bg-no-repeat"
                  style={{
                     backgroundImage: `url(${VALORANT_BANNER})`,
                     backgroundSize: '100%',
                     backgroundPosition: '90% 10%',
                  }}
               >
                  <div className="absolute inset-0 bg-black bg-opacity-50"></div>
                  <h1 className="text-lg mb-4 pt-10 font-bold z-10">
                     Valorant
                  </h1>

                  <Searchbar
                     onChange={(e) => handleSearch(e.target.value)}
                     onSearch={handleSearch}
                     placeholder="Search for Valorant Lineups"
                     suggestions={suggestions}
                     game={'Valorant'}
                  />
               </div>
               <div className="flex flex-col items-center pt-5 pb-5 bg-black bg-opacity-50 backdrop-blur-md px-4 sm:px-8">
                  <div className="w-full sm:w-3/4 md:w-1/2 ">
                     <Carousel images={VALORANT_MAPS} />
                  </div>
               </div>
               <h1 className="text-3xl font-bold text-center mt-10 mb-5">
                  Recently added Lineups
               </h1>
               <article className="pl-4 pr-4 md:pl-0 md:pr-2 md:ml-20 grid grid-cols-1 gap-x-4 gap-y-5 md:grid-cols-2 lg:grid-cols-4">
                  {posts.map((post) => (
                     <Posts
                        postData={post}
                        key={post.landingPosition.public_id}
                     />
                  ))}
               </article>
               <div
                  ref={loadingTriggerRef}
                  className="h-20 flex items-center justify-center"
               >
                  {isLoading && (
                     <FaSpinner className="animate-spin text-4xl text-gray-500" />
                  )}
               </div>
            </main>
            <Footer className="mt-auto" />
         </div>
      </>
   );
};

export default Valorant;
