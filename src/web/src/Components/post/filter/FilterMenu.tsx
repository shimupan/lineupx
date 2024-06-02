import { useState } from 'react';
import { FiFilter, FiX, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { useParams } from 'react-router-dom';

const FilterMenu = ({
   onFilterChange,
}: {
   onFilterChange: (filter: string) => void;
}) => {
   const [showFilterMenu, setShowFilterMenu] = useState(false);
   const [openSection, setOpenSection] = useState<string | null>(null);
   const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
   const { game } = useParams<{ game: string }>();

   const toggleFilterMenu = () => {
      setShowFilterMenu(!showFilterMenu);
   };

   const toggleSection = (section: string) => {
      setOpenSection(openSection === section ? null : section);
   };

   const handleFilterChange = (filter: string) => {
      if (selectedFilter === filter) {
         setSelectedFilter(null);
         onFilterChange('');
      } else {
         setSelectedFilter(filter);
         onFilterChange(filter);
      }
   };

   const gameFilters = {
      Valorant: [
         { label: 'Agent', value: 'agent' },
         { label: 'Post Name', value: 'postname' },
         { label: 'Location', value: 'location' },
         { label: 'Ability', value: 'ability' },
         { label: 'Map', value: 'map' },
      ],
      CS2: [
         { label: 'Post Name', value: 'postname' },
         { label: 'Location', value: 'location' },
         { label: 'Grenade', value: 'grenade' },
         { label: 'Map', value: 'map' },
      ],
      // Add other games and their filters here
   };

   const filters = gameFilters[game as keyof typeof gameFilters] || [];

   return (
      <div className="relative inline-block text-left mt-4">
         <button
            type="button"
            className="inline-flex justify-center rounded-md border border-gray-700 shadow-sm px-4 py-2 bg-gray-900 text-sm font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={toggleFilterMenu}
         >
            <FiFilter className="h-5 w-5 mr-2" />
            Filter
         </button>
         {showFilterMenu && (
            <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 z-50 flex justify-center items-center">
               <div className="bg-gray-900 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 divide-y divide-gray-800 text-white w-full md:w-96">
                  <div className="flex justify-between items-center px-4 py-2">
                     <h3 className="text-lg font-medium">Filter</h3>
                     <button onClick={toggleFilterMenu}>
                        <FiX className="h-5 w-5 text-white" />
                     </button>
                  </div>
                  <div
                     className="py-4 grid grid-cols-1 md:grid-cols-3 gap-4 px-4 justify-center"
                     role="menu"
                     aria-orientation="vertical"
                  >
                     <div className="md:block">
                        <p className="block px-4 text-sm font-medium mb-2 hidden md:block">
                           Upload Date
                        </p>
                        <div className="md:hidden">
                           <div
                              className="flex justify-between items-center cursor-pointer"
                              onClick={() => toggleSection('upload_date')}
                           >
                              <p className="block text-sm font-medium">
                                 Upload Date
                              </p>
                              {openSection === 'upload_date' ? (
                                 <FiChevronUp className="h-5 w-5" />
                              ) : (
                                 <FiChevronDown className="h-5 w-5" />
                              )}
                           </div>
                           {openSection === 'upload_date' && (
                              <div className="mt-2 pl-4">
                                 <a
                                    href="#"
                                    className="block py-2 text-sm hover:bg-gray-800"
                                    role="menuitem"
                                    onClick={() => handleFilterChange('today')}
                                 >
                                    Today
                                 </a>
                                 <a
                                    href="#"
                                    className="block py-2 text-sm hover:bg-gray-800"
                                    role="menuitem"
                                    onClick={() => handleFilterChange('this_week')}
                                 >
                                    This Week
                                 </a>
                                 <a
                                    href="#"
                                    className="block py-2 text-sm hover:bg-gray-800"
                                    role="menuitem"
                                    onClick={() => handleFilterChange('this_month')}
                                 >
                                    This Month
                                 </a>
                                 <a
                                    href="#"
                                    className="block py-2 text-sm hover:bg-gray-800"
                                    role="menuitem"
                                    onClick={() => handleFilterChange('this_year')}
                                 >
                                    This Year
                                 </a>
                              </div>
                           )}
                        </div>
                        <div className="hidden md:block">
                           <a
                              href="#"
                              className="block px-4 py-2 text-sm hover:bg-gray-800"
                              role="menuitem"
                              onClick={() => handleFilterChange('today')}
                           >
                              Today
                           </a>
                           <a
                              href="#"
                              className="block px-4 py-2 text-sm hover:bg-gray-800"
                              role="menuitem"
                              onClick={() => handleFilterChange('this_week')}
                           >
                              This Week
                           </a>
                           <a
                              href="#"
                              className="block px-4 py-2 text-sm hover:bg-gray-800"
                              role="menuitem"
                              onClick={() => handleFilterChange('this_month')}
                           >
                              This Month
                           </a>
                           <a
                              href="#"
                              className="block px-4 py-2 text-sm hover:bg-gray-800"
                              role="menuitem"
                              onClick={() => handleFilterChange('this_year')}
                           >
                              This Year
                           </a>
                        </div>
                     </div>
                     <div className="md:block">
                        <p className="block px-4 text-sm font-medium mb-2 hidden md:block">
                           Type
                        </p>
                        <div className="md:hidden">
                           <div
                              className="flex justify-between items-center cursor-pointer"
                              onClick={() => toggleSection('type')}
                           >
                              <p className="block text-sm font-medium">Type</p>
                              {openSection === 'type' ? (
                                 <FiChevronUp className="h-5 w-5" />
                              ) : (
                                 <FiChevronDown className="h-5 w-5" />
                              )}
                           </div>
                           {openSection === 'type' && (
                              <div className="mt-2 pl-4">
                                 {filters.map((filter) => (
                                    <a
                                       href="#"
                                       className="block py-2 text-sm hover:bg-gray-800"
                                       role="menuitem"
                                       onClick={() =>
                                          onFilterChange(filter.value)
                                       }
                                    >
                                       {filter.label}
                                    </a>
                                 ))}
                              </div>
                           )}
                        </div>
                        <div className="hidden md:block">
                           {filters.map((filter) => (
                              <a
                                 href="#"
                                 className="block px-4 py-2 text-sm hover:bg-gray-800"
                                 role="menuitem"
                                 onClick={() => onFilterChange(filter.value)}
                              >
                                 {filter.label}
                              </a>
                           ))}
                        </div>
                     </div>
                     <div className="md:block">
                        <p className="block px-4 text-sm font-medium mb-2 hidden md:block">
                           Sort By
                        </p>
                        <div className="md:hidden">
                           <div
                              className="flex justify-between items-center cursor-pointer"
                              onClick={() => toggleSection('sort_by')}
                           >
                              <p className="block text-sm font-medium">
                                 Sort By
                              </p>
                              {openSection === 'sort_by' ? (
                                 <FiChevronUp className="h-5 w-5" />
                              ) : (
                                 <FiChevronDown className="h-5 w-5" />
                              )}
                           </div>
                           {openSection === 'sort_by' && (
                              <div className="mt-2 pl-4">
                                 <a
                                    href="#"
                                    className="block py-2 text-sm hover:bg-gray-800"
                                    role="menuitem"
                                    onClick={() => handleFilterChange('rating')}
                                 >
                                    Rating
                                 </a>
                                 <a
                                    href="#"
                                    className="block py-2 text-sm hover:bg-gray-800"
                                    role="menuitem"
                                    onClick={() =>
                                       handleFilterChange('upload_date')
                                    }
                                 >
                                    Upload Date
                                 </a>
                                 <a
                                    href="#"
                                    className="block py-2 text-sm hover:bg-gray-800"
                                    role="menuitem"
                                    onClick={() => handleFilterChange('view_count')}
                                 >
                                    View Count
                                 </a>
                              </div>
                           )}
                        </div>
                        <div className="hidden md:block">
                           <a
                              href="#"
                              className="block px-4 py-2 text-sm hover:bg-gray-800"
                              role="menuitem"
                              onClick={() => handleFilterChange('rating')}
                           >
                              Rating
                           </a>
                           <a
                              href="#"
                              className="block px-4 py-2 text-sm hover:bg-gray-800"
                              role="menuitem"
                              onClick={() => handleFilterChange('upload_date')}
                           >
                              Upload Date
                           </a>
                           <a
                              href="#"
                              className="block px-4 py-2 text-sm hover:bg-gray-800"
                              role="menuitem"
                              onClick={() => handleFilterChange('view_count')}
                           >
                              View Count
                           </a>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
};
export default FilterMenu;
