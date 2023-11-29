import { Header } from "../Components";
import { Game } from "../Components";

const Page = () => {

   return (
      <>
         <Header />
         <div className="flex">
            <p className="text-2xl justify-center items-center">
               <Game />
            </p>
         </div>
      </>
   );
};
 
 export default Page;