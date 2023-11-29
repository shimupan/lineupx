import { Header } from "../Components";
import { Game } from "../Components";

const Page = () => {

   return (
      <div>
         <Header />
         <div className="flex">
            <p className="text-2xl justify-center items-center">
               <Game />
            </p>
         </div>
      </div>
   );
};
 
 export default Page;