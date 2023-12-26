import { useEffect, useState } from 'react';
import Posts from '../../Components/Posts';
import { PostType } from '../../db.types';
import axios from 'axios';

import {
   Header,
   SideNavWrapper,
   Searchbar,
   Footer,
   Carousel,
} from '../../Components';
import { CS2_MAPS, CS2_BANNER } from '../../Constants';

const CS2: React.FC = () => {
   const [posts, setPosts] = useState<PostType[]>([]);

   useEffect(() => {
      document.title = 'Counter-Strike 2';
      axios
         .get('/post/CS2')
         .then((res) => {
            setPosts(res.data.slice(0, 10));
         })
         .catch((err) => {
            console.log(err);
         });
   }, []);

   const handleSearch = (searchTerm: string) => {
      console.log('Searching for:', searchTerm);
      // TODO: Implement search functionality and logic
   };

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
               <h1 className="text-lg mb-4 pt-10 font-bold z-10">
                  Counter-Strike 2
               </h1>
               <Searchbar
                  onSearch={handleSearch}
                  placeholder="Search for CS2 Lineups"
                  className="z-10"
               />
            </div>
            <div className="flex flex-col items-center pt-5 pb-5 bg-black bg-opacity-50 backdrop-blur-md">
               <div className="w-1/2">
                  <Carousel images={CS2_MAPS} />
               </div>
            </div>
            {/* TODO: STYLING BELOW */}
            
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 pl-20">
               {posts.map((post) => {
                  return (
                     <div key={post.landingPosition.public_id} className="max-w-md mx-auto">
                        <Posts
                           postData={post}
                        />
                     </div>
                  );
               })}
            </div>
         </main>
         <Footer className="mt-auto" />
      </div>
   );
};

export default CS2;
