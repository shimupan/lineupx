import { Header, Register } from "../Components";

const Page = () => {

   return (
      <div>
         <Header />
         <Register />
         <div className="flex">
            <p className="text-2xl justify-center items-center">
               Welcome to LineupX
            </p>
         </div>
      </div>
   );
};
 
 export default Page;