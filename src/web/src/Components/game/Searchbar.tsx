import { useState, FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Fuse from 'fuse.js';

interface SearchBarProps {
   onSearch: (searchTerm: string) => void;
   game: string;
   placeholder: string;
   className?: string;
   onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
   suggestions: string[];
}

const SearchBar = ({
   onSearch,
   placeholder,
   className = '',
   onChange,
   suggestions,
   game,
}: SearchBarProps) => {
   const [searchTerm, setSearchTerm] = useState('');
   const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
   const [isFocused, setIsFocused] = useState(false);
   const navigate = useNavigate();
   const handleSubmit = (event: FormEvent) => {
      event.preventDefault();
      onSearch(searchTerm);
   };

   const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setSearchTerm(value);
      onChange(event);

      if (value.trim() === '') {
         setFilteredSuggestions([]);
         return;
      }

      // Setup Fuse.js
      const fuse = new Fuse(suggestions, {
         keys: ['text'],
         includeScore: true,
         threshold: 0.3,
         isCaseSensitive: false,
      });

      // Use Fuse.js to search the suggestions
      const result = fuse.search(value);

      // Extract the item from each result
      const filtered = result.map(({ item }) => item);

      setFilteredSuggestions(filtered);
   };

   const handleClear = () => {
      setSearchTerm('');
      onSearch('');
   };

   const handleFocus = () => {
      setIsFocused(true);
   };

   const handleBlur = () => {
      setTimeout(() => {
         setIsFocused(false);
      }, 100);
   };

   const handleSuggestionClick = (suggestion: string) => {
      setSearchTerm(suggestion);
      onSearch(suggestion);
   };

   const renderSuggestions = () => {
      if (filteredSuggestions.length === 0) {
         return null;
      }

      return (
         <ul className="absolute z-10 bg-white w-full rounded-b-lg shadow-md border border-gray-200 mt-[-2px] py-1 overflow-y-auto max-h-64 scrollbar scrollbar-thumb-gray-500 scrollbar-track-gray-200">
            {filteredSuggestions.map((suggestion, index) => (
               <li
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="text-black px-4 py-2 cursor-pointer hover:bg-gray-100"
               >
                  {suggestion}
               </li>
            ))}
         </ul>
      );
   };

   return (
      <div className="relative w-full md:w-1/4 lg:w-1/4 xl:w-2/3 2xl:w-1/2 mx-auto">
         <form
            onSubmit={handleSubmit}
            className={`flex items-center justify-start ${
               isFocused && filteredSuggestions.length > 0 ? '' : 'rounded-b-lg'
            } rounded-t-lg bg-white text-lg ${className} p-4 w-full relative`}
         >
            <button
               type="submit"
               aria-label="Search"
               className="focus:outline-none"
            >
               <svg
                  width="24px"
                  height="24px"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 text-black"
               >
                  <path
                     d="M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z"
                     stroke="currentColor"
                     strokeWidth="2"
                     strokeLinecap="round"
                     strokeLinejoin="round"
                  />
               </svg>
            </button>
            <input
               type="text"
               placeholder={placeholder}
               value={searchTerm}
               onChange={handleChange}
               onFocus={handleFocus}
               onBlur={handleBlur}
               onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                     navigate(`/search/${game}/${searchTerm}`);
                  }
               }}
               aria-label="Search"
               className="flex-grow text-black rounded-full focus:outline-none text-lg pl-2 pr-10 w-full bg-white"
               autoComplete="on"
            />
            {searchTerm && (
               <button
                  type="button"
                  onClick={handleClear}
                  aria-label="Clear search"
                  className="absolute right-5 top-1/2 transform -translate-y-1/2 focus:outline-none"
               >
                  <svg
                     width="24px"
                     height="24px"
                     viewBox="0 0 24 24"
                     fill="none"
                     xmlns="http://www.w3.org/2000/svg"
                     className="w-6 h-6 text-black"
                  >
                     <path
                        d="M20.7457 3.32851C20.3552 2.93798 19.722 2.93798 19.3315 3.32851L12.0371 10.6229L4.74275 3.32851C4.35223 2.93798 3.71906 2.93798 3.32854 3.32851C2.93801 3.71903 2.93801 4.3522 3.32854 4.74272L10.6229 12.0371L3.32856 19.3314C2.93803 19.722 2.93803 20.3551 3.32856 20.7457C3.71908 21.1362 4.35225 21.1362 4.74277 20.7457L12.0371 13.4513L19.3315 20.7457C19.722 21.1362 20.3552 21.1362 20.7457 20.7457C21.1362 20.3551 21.1362 19.722 20.7457 19.3315L13.4513 12.0371L20.7457 4.74272C21.1362 4.3522 21.1362 3.71903 20.7457 3.32851Z"
                        fill="currentColor"
                     />
                  </svg>
               </button>
            )}
         </form>
         {isFocused && renderSuggestions()}
      </div>
   );
};

export default SearchBar;