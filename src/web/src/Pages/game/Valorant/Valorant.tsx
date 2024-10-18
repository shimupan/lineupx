import React, { useEffect, useState, useRef, useCallback } from 'react';
import Posts from '../../../Components/post/Posts';
import { PostType } from '../../../global.types';
import axios from 'axios';
import {
   Layout,
   Searchbar,
   Carousel,
   ValorantPopup,
   PostSkeleton,
} from '../../../Components';
import { VALORANT_MAPS, VALORANT_BANNER } from '../../../Constants';
import { useLocalStorage } from '../../../hooks';
import { ValorantAgentProvider } from '../../../contexts/ValorantAgentContext';
import { UserProvider } from '../../../contexts/UserContext';
import useUserCache from '../../../hooks/useUserCache';

const MINIMUM_SKELETON_TIME = 600;

const Valorant: React.FC = () => {
   const [open, setOpen] = useState<boolean>(true);
   const [posts, setPosts] = useState<PostType[]>([]);
   const [value, setValue] = useLocalStorage('valorantPopup', true);
   const [suggestions, setSuggestions] = useState<string[]>([]);
   const [page, setPage] = useState(1);
   const [hasMore, setHasMore] = useState(true);
   const [isLoading, setIsLoading] = useState(false);
   const [newPostsReady, setNewPostsReady] = useState(false);
   const { userCache, fetchUsers } = useUserCache();

   const pageRef = useRef(page);
   useEffect(() => {
      pageRef.current = page;
   }, [page]);

   const fetchRSOTokens = async () => {
     const queryParams = new URLSearchParams(location.search);
     const code = queryParams.get("code");

     // if user didn't sign in with RSO
     if (code === null) return;

     try {
       const res = await axios.get(`/rso/oauth?code=${code}`);
       console.log("Response: ", res);
     }
     catch (error){
       console.log("error fetching /rso/oauth: ", error);
     }
  }

   const fetchInitialData = useCallback(async () => {
      setIsLoading(true);
      setNewPostsReady(false);
      const startTime = Date.now();
      try {
         const postsResponse = await axios.get(
            '/post/Valorant?page=1&limit=20&recent=true',
         );
         const loadTime = Date.now() - startTime;
         const delay = Math.max(0, MINIMUM_SKELETON_TIME - loadTime);

         setTimeout(() => {
            const newPosts = postsResponse.data.reverse();
            setPosts(newPosts);
            setPage(2);
            setHasMore(newPosts.length === 20);
            setNewPostsReady(true);
            setIsLoading(false);

            // Fetch user data for all posts
            const userIds = newPosts.map((post: PostType) => post.UserID);
            fetchUsers(userIds);
         }, delay);
      } catch (err) {
         console.log(err);
         setHasMore(false);
         setIsLoading(false);
      }
   }, [fetchUsers]);

   const fetchData = async () => {
      setIsLoading(true);
      setNewPostsReady(false);
      const currentPage = pageRef.current;
      const startTime = Date.now();
      try {
         const res = await axios.get(
            `/post/Valorant?page=${currentPage}&limit=20&recent=true`,
         );
         const loadTime = Date.now() - startTime;
         const delay = Math.max(0, MINIMUM_SKELETON_TIME - loadTime);
         if (res.data.length > 0) {
            const newPosts = res.data.reverse();
            setTimeout(() => {
               setPosts((prevPosts) => [...prevPosts, ...newPosts]);
               setPage((prevPage) => prevPage + 1);
               setNewPostsReady(true);
               setIsLoading(false);

               // Fetch user data for new posts
               const userIds = newPosts.map((post: PostType) => post.UserID);
               fetchUsers(userIds);
            }, delay);
         } else {
            setHasMore(false);
            setIsLoading(false);
         }

         const titles = res.data.map((post: PostType) => `${post.postTitle}`);

         const agentsResponse = await axios.get(
            'https://valorant-api.com/v1/agents?isPlayableCharacter=true',
         );

         const mapsResponse = await fetch('https://valorant-api.com/v1/maps');
         const mapsData = await mapsResponse.json();
         const mapTitles = mapsData.data.map(
            (map: { displayName: string }) => `${map.displayName}`,
         );

         const displayNames = agentsResponse.data.data.map(
            (agent: { displayName: string }) => `${agent.displayName}`,
         );

         const abilities = agentsResponse.data.data.flatMap(
            (agent: {
               displayName: string;
               abilities: { displayName: string }[];
            }) => agent.abilities.map((ability) => `${ability.displayName}`),
         );

         const itemsToRemove = [
            'The Range',
            'Kasbah',
            'District',
            'Piazza',
            'Drift',
            'Basic Training',
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
      fetchInitialData();
      fetchRSOTokens();
   }, []);

   const handleSearch = (value: string) => {
      value = value.toLowerCase();
   };

   useEffect(() => {
      const handleScroll = () => {
         const threshold = 10;
         if (
            window.innerHeight + document.documentElement.scrollTop <
               document.documentElement.offsetHeight - threshold ||
            !hasMore ||
            isLoading
         )
            return;
         fetchData();
      };
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
   }, [hasMore, page, isLoading]);

   return (
      <>
         <UserProvider>
            <ValorantAgentProvider>
               {value && open && (
                  <ValorantPopup setOpen={setOpen} setValue={setValue} />
               )}
               <div className="flex flex-col min-h-screen">
                  <Layout>
                     <main className="flex-1">
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
                           <div className="w-full px-4 z-10">
                              <Searchbar
                                 onChange={(e) => handleSearch(e.target.value)}
                                 onSearch={handleSearch}
                                 placeholder="Search for Valorant Lineups"
                                 suggestions={suggestions}
                                 game={'Valorant'}
                              />
                           </div>
                        </div>
                        <div className="flex flex-col items-center pt-5 pb-5 bg-black bg-opacity-50 backdrop-blur-md px-4 sm:px-8">
                           <div className="w-full sm:w-3/4 md:w-1/2">
                              <Carousel images={VALORANT_MAPS} />
                           </div>
                        </div>
                        <h1 className="text-3xl font-bold text-center mt-10 mb-5">
                           Recently added Lineups
                        </h1>
                        <article className="pl-4 pr-4 md:pl-0 md:pr-2 md:ml-20 grid grid-cols-1 gap-x-4 gap-y-5 md:grid-cols-2 lg:grid-cols-5">
                           {posts.map((post) => (
                              <Posts
                                 postData={post}
                                 key={post.landingPosition.public_id}
                                 userCache={userCache}
                                 fetchUsers={fetchUsers}
                              />
                           ))}
                           {isLoading &&
                              (newPostsReady
                                 ? null
                                 : Array(10)
                                      .fill(null)
                                      .map((_, index) => (
                                         <PostSkeleton key={index} />
                                      )))}
                        </article>
                     </main>
                  </Layout>
               </div>
            </ValorantAgentProvider>
         </UserProvider>
      </>
   );
};

export default Valorant;
