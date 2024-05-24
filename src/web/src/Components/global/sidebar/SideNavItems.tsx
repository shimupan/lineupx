import { useContext } from 'react';

import { SideNavContext } from './SideNav';

type SideNavItemsProps = {
   icon: React.ReactElement;
   text: string;
   onClick: () => void;
   active?: boolean;
   alert?: boolean;
};

const SideNavItems: React.FC<SideNavItemsProps> = ({
   icon,
   text,
   active,
   alert,
   onClick,
}: any) => {
   const expanded = useContext(SideNavContext);

   return (
      <>
         <li
            className={`text-black relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors ${
               active
                  ? 'bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800'
                  : 'hover:bg-indigo-50 text-gray-600'
            }`}
            onClick={onClick}
         >
            <span className="w-6 h-6 flex items-center justify-center">
               {icon}
            </span>
            <span
               className={`overflow-hidden transition-all ${
                  expanded ? 'w-32 ml-3' : 'w-0'
               }`}
            >
               {text}
            </span>
            {alert && (
               <div
                  className={`absolute right-2 w-2 h-2 rounded bg-indigo-400 ${
                     expanded ? '' : 'hidden'
                  }`}
               />
            )}

            {!expanded && (
               <div className="absolute left-full rounded-md px-2 py-1 ml-6 bg-indigo-100 text-indigo-800 text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0">
                  {text}
               </div>
            )}
         </li>
      </>
   );
};

export default SideNavItems;
