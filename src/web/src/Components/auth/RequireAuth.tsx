import { useContext } from 'react';
import { useLocation, Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../../App';

type RequireAuthProps = {
   allowedRoles?: string[];
};

const RequireAuth: React.FC<RequireAuthProps> = ({ allowedRoles }) => {
   const location = useLocation();
   const Auth = useContext(AuthContext);
   console.log(Auth?.role, allowedRoles);
   return (
      <>
         Auth?.role && allowedRoles?.includes(Auth?.role) ? (
         <Outlet />
         ) : Auth?.role ? (
         <Navigate to="/" state={{ from: location }} replace />
         ) : (
         <Navigate to="/login" state={{ from: location }} replace />)
      </>
   );
};

export default RequireAuth;
