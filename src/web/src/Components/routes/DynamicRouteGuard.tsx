import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ROUTE_CONFIG } from './routeGuard';

interface DynamicRouteGuardProps {
   children: React.ReactNode;
}

const DynamicRouteGuard: React.FC<DynamicRouteGuardProps> = ({ children }) => {
   const location = useLocation();
   const navigate = useNavigate();
   const [isValidRoute, setIsValidRoute] = useState(true);

   useEffect(() => {
      let isMounted = true;

      const checkRoute = async () => {
         try {
            // Find matching route pattern
            const routePattern = Object.keys(ROUTE_CONFIG).find((pattern) => {
               const regexPattern = pattern
                  .replace(/:[^/]+/g, '([^/]+)')
                  .replace(/\//g, '\\/');
               return new RegExp(`^${regexPattern}$`).test(location.pathname);
            });

            // If no matching pattern found, assume it's a valid route
            if (!routePattern) return;

            // Extract params from URL
            const params: Record<string, string> = {};
            const paramNames = (routePattern.match(/:[^/]+/g) || []).map((p) =>
               p.slice(1),
            );
            const paramValues = location.pathname
               .match(
                  new RegExp(
                     routePattern
                        .replace(/:[^/]+/g, '([^/]+)')
                        .replace(/\//g, '\\/'),
                  ),
               )
               ?.slice(1);

            if (paramValues) {
               paramNames.forEach((name, index) => {
                  params[name] = paramValues[index];
               });
            }

            // Validate route
            const isValid = await ROUTE_CONFIG[routePattern].validate(params);

            if (isMounted) {
               if (!isValid) {
                  throw new Error('Invalid route');
               }
               setIsValidRoute(true);
            }
         } catch (error) {
            if (isMounted) {
               console.error('Route validation error:', error);
               setIsValidRoute(false);
               navigate('/404', { replace: true });
            }
         }
      };

      checkRoute();

      return () => {
         isMounted = false;
      };
   }, [location.pathname, navigate]);

   return isValidRoute ? <>{children}</> : null;
};

export default DynamicRouteGuard;
