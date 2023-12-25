import { Header, SideNavWrapper } from '../../Components';
import PanelCard from '../../Components/admin/PanelCard';

const AdminHome: React.FC = () => {
   return (
      <>
         <Header />

         <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 m-32">
            <PanelCard name="Users" description="View all the Users" to="/admin/users"/>
            <PanelCard name="Posts" description="View all the Posts" to="/admin/posts"/>
            <PanelCard name="Approve" description="Approve/Reject Posts" to="/admin/check"/>
         </div>

         <SideNavWrapper />
      </>
   );
};

export default AdminHome;
