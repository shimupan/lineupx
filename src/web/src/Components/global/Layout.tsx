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

         <div className="min-h-screen flex flex-col">
            <div className="flex-1 flex justify-center items-center space-x-4">
               {children}
            </div>
         </div>

         <Footer />
         <div className="pt-20">{isMobile && <BottomNav />}</div>
      </>
   );
};

export default Layout;
