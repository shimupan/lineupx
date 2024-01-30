import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Footer, Header, SideNavWrapper, Posts } from '../../Components';
import {
   getPostByMap,
   getPostByCoordinate,
   getPostByGrenade,
} from '../../util/getPost';
import { PostType } from '../../global.types';
import axios from 'axios';

export const SearchResults = () => {
   const { game, query } = useParams<{ game: string; query: string }>();
   const location = useLocation();
   const searchParams = new URLSearchParams(location.search);
   const filter = searchParams.get('filter');
   const [posts, setPosts] = useState<PostType[]>([]);

   useEffect(() => {
      if (filter === null) return;
      if (filter) {
         if (filter === 'map') {
            getPostByMap(game!, query!)
               .then((coords) => {
                  let p: PostType[] = [];
                  coords.forEach((coord) => {
                     p.push(coord.post!);
                  });
                  setPosts(p);
               })
               .catch((error) => {
                  console.error(error);
               });
         } else if (filter === 'location') {
            const mapName = query?.split('+')[1];
            const location = query?.split('+')[0];
            getPostByCoordinate(location!, game!, mapName!)
               .then((coords) => {
                  let p: PostType[] = [];
                  coords.forEach((coord) => {
                     p.push(coord.post!);
                  });
                  setPosts(p);
               })
               .catch((error) => {
                  console.error(error);
               });
         } else if (filter === 'utility') {
            const mapName = query?.split('+')[1];
            const utility = query?.split('+')[0];
            getPostByGrenade(utility!, game!, mapName!)
               .then((coords) => {
                  let p: PostType[] = [];
                  coords.forEach((coord) => {
                     p.push(coord.post!);
                  });
                  setPosts(p);
               })
               .catch((error) => {
                  console.error(error);
               });
         } else if (filter === 'all') {
            const mapName = query?.split('+')[2];
            const utility = query?.split('+')[1];
            const location = query?.split('+')[0];
            getPostByGrenade(utility!, game!, mapName!)
               .then((coords) => {
                  let p: PostType[] = [];
                  coords.forEach((coord) => {
                     if (coord.post?.lineupLocationCoords.name === location) {
                        p.push(coord.post!);
                     }
                  });
                  setPosts(p);
               })
               .catch((error) => {
                  console.error(error);
               });
         }
      } else {
         // normal search
         axios.get(`/post/CS2?page=1&${query}`).then((res) => {
            setPosts(res.data);
         });
      }
   }, [filter]);

   useEffect(() => {
      console.log(posts);
   }, [posts]);

   return (
      <>
         <Header />
         <SideNavWrapper />
         <div className="flex flex-col items-center justify-center mt-4">
            <h1 className="text-4xl font-bold">
               Search Results for {query} in {game}{' '}
            </h1>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 p-4 md:pl-20 justify-items-center md:justify-items-start sm:justify-center">
            {!posts ? (
               <p className="text-lg mt-2">
                  Sorry, we couldn't find any results for your search.
               </p>
            ) : (
               posts.map((post) => (
                  <div key={post.landingPosition.public_id}>
                     <Posts postData={post} />
                  </div>
               ))
            )}
         </div>

         <Footer />
      </>
   );
};

export default SearchResults;
