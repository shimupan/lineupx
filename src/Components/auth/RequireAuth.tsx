import { useContext } from 'react';
import { useLocation, Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../../App';

const RequireAuth = () => {
   const location = useLocation();
   const Auth = useContext(AuthContext);
   console.log(Auth);
   return Auth?.accessToken ? (
      <Outlet />
   ) : (
      <Navigate to='/login' state={{ from: location }} replace />
   );
};

export default RequireAuth;
