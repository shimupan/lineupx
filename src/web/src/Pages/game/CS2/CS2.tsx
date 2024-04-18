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
} from '../../../Components';
import { CS2_MAPS, CS2_BANNER } from '../../../Constants';

const CS2: React.FC = () => {
   const [posts, setPosts] = useState<PostType[]>([]);
   const [page, setPage] = useState(1);
   const [hasMore, setHasMore] = useState(true);

   /*
   const [filteredPosts, setFilteredPosts] = useState<PostType[]>([]);
   const [searchTerm, setSearchTerm] = useState('');
   */
   const [suggestions, setSuggestions] = useState<string[]>([]);
   const pageRef = useRef(page);
   useEffect(() => {
      pageRef.current = page; 
   }, [page]);

   const fetchData = () => {
      const currentPage = pageRef.current;
      axios
         .get(`/post/CS2?page=${currentPage}&limit=20&recent=true`)
         .then((res) => {
            if (res.data.length > 0) {
               setPosts((prevPosts) => [...prevPosts, ...res.data]);
               setPage((prevPage) => prevPage + 1);
            } else {
               setHasMore(false);
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
               ...new Set([
                  ...titles,
                  ...prevSuggestions,
                  ...nades,
                  ...maps,
               ]),
            ]);
         })
         .catch((err) => {
            console.log(err);
            setHasMore(false);
         });
   };

   useEffect(() => {
      document.title = 'CS2';
      setPosts([]); // Reset posts when component mounts
      setPage(1);   // Reset to first page
      setHasMore(true); // Reset loading state
  }, []);
  
   const handleSearch = (value: string) => {
      value = value.toLowerCase();
   };

   useEffect(() => {
      const handleScroll = () => {
          if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight || !hasMore) return;
          fetchData();
      };
  
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, page]); // Include page in the dependency array
  
  

   return (
      <div className="flex flex-col min-h-screen">
         <Header />
         <main className="flex-1">
            <SideNavWrapper />
            <div
               className="flex flex-col items-center h-72 relative bg-center bg-no-repeat"
               style={{
                  backgroundImage: `url(${CS2_BANNER})`,
                  backgroundSize: '100%',
                  backgroundPosition: '90% 10%',
               }}
            >
               <div className="absolute inset-0 bg-black bg-opacity-50"></div>
               <h1 className="text-lg mb-4 pt-10 font-bold z-10">CS2</h1>

               <Searchbar
                  onChange={(e) => handleSearch(e.target.value)}
                  onSearch={handleSearch}
                  placeholder="Search for CS2 Lineups"
                  suggestions={suggestions}
                  game={'CS2'}
               />
            </div>
            <div className="flex flex-col items-center pt-5 pb-5 bg-black bg-opacity-50 backdrop-blur-md px-4 sm:px-8">
               <div className="w-full sm:w-3/4 md:w-1/2 ">
                  <Carousel images={CS2_MAPS} />
               </div>
            </div>
            {/* TODO: STYLING BELOW */}
            <h1 className="text-3xl font-bold text-center mt-10 mb-5">
               Recently added Lineups
            </h1>
            <article className="pl-4 pr-4 md:pl-0 md:pr-2 md:ml-20 grid grid-cols-1 gap-x-4 gap-y-5 md:grid-cols-2 lg:grid-cols-4">
               {posts.map((post) => (
                  <React.Fragment key={post.landingPosition.public_id}>
                     <Posts postData={post} />
                  </React.Fragment>
               ))}
            </article>
         </main>
         <Footer className="mt-auto" />
      </div>
   );
};

export default CS2;
