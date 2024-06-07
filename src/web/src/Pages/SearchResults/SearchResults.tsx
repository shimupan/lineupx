import { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import {
   Footer,
   Header,
   SideNavWrapper,
   Posts,
   FilterMenu,
} from '../../Components';
/*
import {
   getPostByMap,
   getPostByCoordinate,
   getPostByGrenade,
} from '../../util/getPost';
*/
import { PostType } from '../../global.types';
import axios from 'axios';

export const SearchResults = () => {
   const { game, query } = useParams<{ game: string; query: string }>();
   const location = useLocation();
   const navigate = useNavigate();
   const searchParams = new URLSearchParams(location.search);
   const filter = searchParams.get('filter');
   const [posts, setPosts] = useState<PostType[]>([]);
   useEffect(() => {
      if (filter) {
         console.log(filter);
         axios
            .get(`/post/${game}?page=1&search=${query}&filter=${filter}`)
            .then((res) => {
               setPosts(res.data);
            });

         /*
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
      */
      } else {
         // normal search
         console.log('searching');
         axios.get(`/post/${game}?page=1&search=${query}`).then((res) => {
            setPosts(res.data);
         });
      }
   }, [filter]);

   const handleFilterChange = (filter: string) => {
      const newSearchParams = new URLSearchParams(location.search);
      newSearchParams.set('filter', filter);
      navigate(`${location.pathname}?${newSearchParams.toString()}`);
   };

   return (
      <>
         <Header />
         <SideNavWrapper />
         <div className="flex flex-col items-center justify-center mt-4">
            <h1 className="text-4xl font-bold">
               Search Results for {query} in {game}{' '}
            </h1>
            <div className="relative inline-block text-left mt-4">
               <FilterMenu onFilterChange={handleFilterChange} />
            </div>
         </div>
         <article className="pt-4 pl-4 pr-4 md:pl-0 md:pr-2 md:ml-20 grid grid-cols-1 gap-x-4 gap-y-5 md:grid-cols-2 lg:grid-cols-5">
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
         </article>

         <Footer />
      </>
   );
};

export default SearchResults;
