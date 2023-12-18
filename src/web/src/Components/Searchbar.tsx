import { useState, FormEvent, ChangeEvent } from 'react';

interface SearchBarProps {
   onSearch: (searchTerm: string) => void;
   placeholder: string;
   className?: string; // Add this line
}

const SearchBar = ({
   onSearch,
   placeholder,
   className = '',
}: SearchBarProps) => {
   const [searchTerm, setSearchTerm] = useState('');

   const handleSubmit = (event: FormEvent) => {
      event.preventDefault();
      onSearch(searchTerm);
   };

   const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(event.target.value);
   };

   return (
      <form
         onSubmit={handleSubmit}
         className={`flex items-center rounded w-2/5 ${className}`}
      >
         <button type='submit'></button>
         <input
            type='text'
            placeholder={placeholder}
            value={searchTerm}
            onChange={handleChange}
            className="flex text-black items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-grey-400 mb-7 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl"
         />
      </form>
   );
};

export default SearchBar;
