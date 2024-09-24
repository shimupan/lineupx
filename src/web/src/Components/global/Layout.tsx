import { ReactNode } from 'react';
import {
   Header,
   Footer,
   SideNavWrapper,
   BottomNav,
   ServerStatusBannner,
} from '../../Components';
import useIsMobile from '../../hooks/isMobile';

interface LayoutProps {
   children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
   const isMobile = useIsMobile();

   return (
      <>
         <Header />
         <ServerStatusBannner />
         {!isMobile && <SideNavWrapper />}

         {children}

         <Footer />
         {isMobile && (
            <div className="pt-20">
               <BottomNav />
            </div>
         )}
      </>
   );
};

export default Layout;
