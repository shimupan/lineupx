import { useState, createContext } from "react";

import { FaAngleLeft } from "react-icons/fa6";
import { IoLogOut } from "react-icons/io5";
import { GiHamburgerMenu } from "react-icons/gi";

type SideNavProps = {
   children: React.ReactNode;
};

export const SideNavContext = createContext<boolean>(true);
const SideNav: React.FC<SideNavProps> = ( { children }:any ) => {

   const [expanded, setExpanded] = useState<boolean>(false);

   // TODO: Make closing transition smoother on mobile
   return (
      <aside className={`${expanded ? "h-full" : ""} md:h-screen absolute z-50`}>
         <nav className={`${expanded ? "transition-all w-screen md:w-[400px]" : "transition-all w-[50px] md:w-[70px]"} h-full flex flex-col ${expanded ? "bg-white" : "bg-transparent"} md:bg-white md:border-r shadow-sm`}>
            <div className={`md:p-4 pb-2 flex ${expanded ? "justify-end" : ""} items-center`}>
               <button className='p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 text-black text-2xl' onClick={ () => {
                  setExpanded(curr => !curr);
                  console.log(expanded);
               }}>
                  {expanded ? <FaAngleLeft /> : <GiHamburgerMenu />}
               </button>
            </div>

            <div className={`${expanded ? "" : "hidden md:block"} border-t flex p-3`}>
               <img src="https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true&name=Shimu+Pan" className="ml-[2px] w-10 h-10 rounded-md"/>
               <div className={`flex justify-between items-center ${expanded ? "w-52 ml-3" : "w-0 ml-0"}`}>
                  <div className={`leading-4 ${expanded ? "w-52 ml-3" : "hidden"}`}>
                     <h4 className="font-semibold text-black">Shimu Pan</h4>
                     <span className="text-xs text-gray-600">pans@rpi.edu</span>
                  </div>
                  <IoLogOut size={25} className="text-black"/>
               </div>
            </div>
            
            <SideNavContext.Provider value={expanded}>
               <ul className={`${expanded ? "" : "hidden"} md:inline flex-1 px-3`}>{children}</ul>
            </SideNavContext.Provider>
         </nav>
      </aside>
   );
};
  
export default SideNav;