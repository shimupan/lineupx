import React, { useState, FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Fuse from 'fuse.js';
import { PostType } from '../../../global.types';

interface SearchBarProps {
   onSearch: (searchTerm: string) => void;
   game: string;
   placeholder: string;
   className?: string;
   onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
   suggestions: string[];
   post: PostType[];
   searchTerm: string;
}

const SearchPost = ({
   onSearch,
   placeholder,
   className = '',
   onChange,
   game,
   post,
   searchTerm,
}: SearchBarProps) => {
   const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
   const navigate = useNavigate();

   const handleSubmit = (event: FormEvent) => {
      event.preventDefault();
      onSearch(searchTerm);
      const sanitizedSearchTerm = searchTerm.replace(/\//g, '');
      navigate(`/search/${game}/${sanitizedSearchTerm}`);
   };

   const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      onChange(event);

      const value = event.target.value;
      if (value.trim() === '') {
         setFilteredSuggestions([]);
         return;
      }

      // Setup Fuse.js for fuzzy search
      const fuse = new Fuse(post, {
         keys: ['postTitle'],
         includeScore: true,
         threshold: 0.3,
         isCaseSensitive: false,
      });

      // Perform the search with Fuse.js
      const result = fuse.search(value);
      const filtered = result.map(({ item }) => item.postTitle);

      setFilteredSuggestions(filtered);
   };

   return (
      <div className={`p-4 ${className}`}>
         <form onSubmit={handleSubmit}>
            <input
               type="text"
               value={searchTerm}
               onChange={handleChange}
               placeholder={placeholder}
               className="text-black h-11/12 w-full p-2 border border-gray-800 rounded-md"
               autoComplete="on"
            />
         </form>
      </div>
   );
};

export default SearchPost;
