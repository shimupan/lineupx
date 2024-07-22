import { ReactNode, useContext } from 'react';
import { useLocation, Navigate, Outlet, useParams } from 'react-router-dom';
import { AuthContext } from '../../App';

type UserAuthProps = {
   allowedRoles?: string[];
   requireOwnership?: boolean;
   children?: ReactNode;
};

const UserAuth: React.FC<UserAuthProps> = ({
   allowedRoles,
   requireOwnership = false,
   children,
}) => {
   const location = useLocation();
   const Auth = useContext(AuthContext);
   const { id } = useParams();

   const isOwner = requireOwnership ? Auth?.username === id : true;

   if (!Auth?.role) {
      return <Navigate to="/login" state={{ from: location }} replace />;
   }

   if (allowedRoles?.includes(Auth.role) && isOwner) {
      return children ? <>{children}</> : <Outlet />;
   }

   return <Navigate to="/" state={{ from: location }} replace />;
};

export default UserAuth;
