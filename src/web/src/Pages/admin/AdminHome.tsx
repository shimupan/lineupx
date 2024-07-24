import { Header, SideNavWrapper, BottomNav } from '../../Components';
import PanelCard from '../../Components/admin/PanelCard';
import useIsMobile from '../../hooks/isMobile';

const AdminHome: React.FC = () => {
   const isMobile = useIsMobile();
   return (
      <>
         <Header />

         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 m-4 sm:m-8 lg:m-32">
            <PanelCard
               name="Users"
               description="View all the Users"
               to="/admin/users"
            />
            <PanelCard
               name="Posts"
               description="View all the Posts"
               to="/admin/posts"
            />
            <PanelCard
               name="Approve/Reject"
               description="Approve/Reject Posts"
               to="/admin/check"
            />
         </div>
         {!isMobile && <SideNavWrapper />}
         <div style={{ paddingTop: '80px' }}>{isMobile && <BottomNav />}</div>
      </>
   );
};

export default AdminHome;
