import React, { useEffect, useState, useRef } from 'react';
import { PostType } from '../../../global.types';
import axios from 'axios';
import {
   Layout,
   Searchbar,
   Carousel,
   Posts,
   PostSkeleton,
} from '../../../Components';
import { CS2_MAPS, CS2_BANNER } from '../../../Constants';

const MINIMUM_SKELETON_TIME = 500; // 500ms minimum skeleton display time

const CS2: React.FC = () => {
   const [posts, setPosts] = useState<PostType[]>([]);
   const [page, setPage] = useState(1);
   const [hasMore, setHasMore] = useState(true);
   const [isLoading, setIsLoading] = useState(false);
   const [newPostsReady, setNewPostsReady] = useState(false);
   const [suggestions, setSuggestions] = useState<string[]>([]);
   const pageRef = useRef(page);

   useEffect(() => {
      pageRef.current = page;
   }, [page]);

   const fetchInitialData = async () => {
      setIsLoading(true);
      setNewPostsReady(false);
      const startTime = Date.now();
      try {
         const postsResponse = await axios.get(
            '/post/CS2?page=1&limit=20&recent=true',
         );
         const loadTime = Date.now() - startTime;
         const delay = Math.max(0, MINIMUM_SKELETON_TIME - loadTime);

         setTimeout(() => {
            setPosts(postsResponse.data.reverse());
            setPage(2);
            setHasMore(postsResponse.data.length === 20);
            setNewPostsReady(true);
            setIsLoading(false);
         }, delay);
      } catch (err) {
         console.log(err);
         setHasMore(false);
         setIsLoading(false);
      }
   };

   const fetchData = async () => {
      setIsLoading(true);
      setNewPostsReady(false);
      const currentPage = pageRef.current;
      const startTime = Date.now();
      try {
         const res = await axios.get(
            `/post/CS2?page=${currentPage}&limit=20&recent=true`,
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
            }, delay);
         } else {
            setHasMore(false);
            setIsLoading(false);
         }

         const titles = res.data.map((post: PostType) => post.postTitle);
         const nades = ['Flash', 'Smoke', 'Molotov', 'HE', 'Decoy'];
         const maps = [
            'Dust2',
            'Inferno',
            'Mirage',
            'Nuke',
            'Ancient',
            'Anubis',
            'Vertigo',
            'Overpass',
         ];
         setSuggestions((prevSuggestions) => [
            ...new Set([...titles, ...prevSuggestions, ...nades, ...maps]),
         ]);
      } catch (err) {
         console.log(err);
         setHasMore(false);
         setIsLoading(false);
      }
   };

   const getSuggestions = async () => {
      try {
         const res = await axios.get(`/post/CS2`);
         const titles = res.data.map((post: PostType) => post.postTitle);
         const nades = ['Flash', 'Smoke', 'Molotov', 'HE', 'Decoy'];
         const maps = [
            'Dust2',
            'Inferno',
            'Mirage',
            'Nuke',
            'Ancient',
            'Anubis',
            'Vertigo',
            'Overpass',
         ];
         setSuggestions((prevSuggestions) => [
            ...new Set([...titles, ...prevSuggestions, ...nades, ...maps]),
         ]);
      } catch (err) {
         console.log(err);
      }
   };

   useEffect(() => {
      document.title = 'CS2';
      getSuggestions();
      fetchInitialData();
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
      <Layout>
      <div className="flex flex-col min-h-screen">
         <main className="flex-1">
            <div
               className="flex flex-col items-center h-96 relative bg-center bg-no-repeat"
               style={{
                  backgroundImage: `url(${CS2_BANNER})`,
                  backgroundSize: '100%',
                  backgroundPosition: '90% 10%',
               }}
            >
               <div className="absolute inset-0 bg-black bg-opacity-50"></div>
               <h1 className="text-lg mb-4 pt-10 font-bold z-10">CS2</h1>

               <div className="w-full px-4 z-10">
                  <Searchbar
                     onChange={(e) => handleSearch(e.target.value)}
                     onSearch={handleSearch}
                     placeholder="Search for CS2 Lineups"
                     suggestions={suggestions}
                     game={'CS2'}
                  />
               </div>
            </div>
            <div className="flex flex-col items-center pt-5 pb-5 bg-black bg-opacity-50 backdrop-blur-md px-4 sm:px-8">
               <div className="w-full sm:w-3/4 md:w-1/2 ">
                  <Carousel images={CS2_MAPS} />
               </div>
            </div>
            <h1 className="text-3xl font-bold text-center mt-10 mb-5">
               Recently added Lineups
            </h1>
            <article className="pl-4 pr-4 md:pl-0 md:pr-2 md:ml-20 grid grid-cols-1 gap-x-4 gap-y-5 md:grid-cols-2 lg:grid-cols-5">
               {posts.map((post) => (
                  <Posts postData={post} key={post.landingPosition.asset_id} />
               ))}
               {isLoading &&
                  (newPostsReady
                     ? null
                     : Array(10)
                          .fill(null)
                          .map((_, index) => <PostSkeleton key={index} />))}
            </article>
         </main>
      </div>
      </Layout>
   );
};

export default CS2;