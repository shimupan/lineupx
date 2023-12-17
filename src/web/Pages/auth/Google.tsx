import React, { useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../App';
import Cookies from 'universal-cookie';

// If you have a specific type for AuthContext, import it and use it here
// Example: AuthContextType
// import { AuthContextType } from 'path-to-auth-context-type';

const GoogleCallback: React.FC = () => {
   const location = useLocation();
   const navigate = useNavigate();
   const Auth = useContext(AuthContext); // useContext<AuthContextType>(AuthContext) if you have a specific type
   const cookies = new Cookies();

   useEffect(() => {
      const query = new URLSearchParams(location.search);
      const accessToken = query.get('accessToken');
      const refreshToken = query.get('refreshToken');

      if (accessToken && refreshToken) {
         // Assuming setAccessToken and setRefreshToken accept string | undefined
         // Adjust types according to your actual context type
         Auth?.setAccessToken(accessToken);
         Auth?.setRefreshToken(refreshToken);

         const expire = new Date();
         expire.setTime(expire.getTime() + 1000 * 60 * 60 * 24 * 7);
         cookies.set('accessToken', accessToken, {
            path: '/',
            expires: expire,
         });
         cookies.set('refreshToken', refreshToken, { path: '/' });

         navigate('/');
      } else {
         // Handle error or redirect to login page
         navigate('/login');
      }
   }, [location, navigate, Auth, cookies]);

   return <div>Loading...</div>;
};

export default GoogleCallback;
