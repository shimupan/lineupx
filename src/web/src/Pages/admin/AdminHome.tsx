import { Header, SideNavWrapper } from '../../Components';
import PanelCard from '../../Components/admin/PanelCard';

const AdminHome: React.FC = () => {
   return (
      <>
         <Header />

         <div>
            <PanelCard />
            <PanelCard />
         </div>

         <SideNavWrapper />
      </>
   );
};

export default AdminHome;
