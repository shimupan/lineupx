import { useEffect, useState, useCallback } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Posts, FilterMenu, Layout } from '../../Components';
import { PostType } from '../../global.types';
import { ValorantAgentProvider } from '../../contexts/ValorantAgentContext';
import { UserProvider } from '../../contexts/UserContext';
import useUserCache from '../../hooks/useUserCache';
import axios from 'axios';

export const SearchResults = () => {
   const { game, query } = useParams<{ game: string; query: string }>();
   const location = useLocation();
   const navigate = useNavigate();
   const searchParams = new URLSearchParams(location.search);
   const filter = searchParams.get('filter');
   const [posts, setPosts] = useState<PostType[]>([]);
   const { userCache, fetchUsers } = useUserCache();

   const fetchPosts = useCallback(async () => {
      try {
         let url = `/post/${game}?page=1&search=${query}`;
         if (filter) {
            url += `&filter=${filter}`;
         }
         const res = await axios.get(url);
         setPosts(res.data);

         // Fetch user data for all posts
         const userIds = res.data.map((post: PostType) => post.UserID);
         fetchUsers(userIds);
      } catch (error) {
         console.error('Error fetching posts:', error);
      }
   }, [game, query, filter, fetchUsers]);

   useEffect(() => {
      fetchPosts();
   }, [fetchPosts]);

   const handleFilterChange = (filter: string) => {
      const newSearchParams = new URLSearchParams(location.search);
      newSearchParams.set('filter', filter);
      navigate(`${location.pathname}?${newSearchParams.toString()}`);
   };

   return (
      <Layout>
         <div className="flex flex-col items-center justify-center mt-4">
            <h1 className="text-4xl font-bold">
               Search Results for {query} in {game}{' '}
            </h1>
            <div className="relative inline-block text-left mt-4">
               <FilterMenu onFilterChange={handleFilterChange} />
            </div>
         </div>
         <article className="pt-4 pl-4 pr-4 md:pl-0 md:pr-2 md:ml-20 grid grid-cols-1 gap-x-4 gap-y-5 md:grid-cols-2 lg:grid-cols-5">
            {posts.length === 0 ? (
               <p className="text-lg mt-2">
                  Sorry, we couldn't find any results for your search.
               </p>
            ) : (
               posts.map((post) => (
                  <UserProvider key={post.landingPosition.public_id}>
                     {post.game === 'Valorant' ? (
                        <ValorantAgentProvider>
                           <Posts
                              postData={post}
                              userCache={userCache}
                              fetchUsers={fetchUsers}
                           />
                        </ValorantAgentProvider>
                     ) : (
                        <Posts
                           postData={post}
                           userCache={userCache}
                           fetchUsers={fetchUsers}
                        />
                     )}
                  </UserProvider>
               ))
            )}
         </article>
      </Layout>
   );
};

export default SearchResults;
