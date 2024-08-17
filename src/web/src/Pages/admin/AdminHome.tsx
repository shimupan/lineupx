import { Layout } from '../../Components';
import PanelCard from '../../Components/admin/PanelCard';

const AdminHome: React.FC = () => {
   return (
      <>
         <Layout>
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
         </Layout>
      </>
   );
};

export default AdminHome;
