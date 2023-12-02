import { useState, FormEvent, ChangeEvent } from 'react';

interface SearchBarProps {
    onSearch: (searchTerm: string) => void;
    placeholder: string;
    className?: string; // Add this line
}

const SearchBar = ({ onSearch, placeholder, className = '' }: SearchBarProps) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        onSearch(searchTerm);
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    return (
        <form onSubmit={handleSubmit} className={`flex items-center border border-gray-300 rounded w-2/5 ${className}`}>
            <button 
                type="submit"
            >
            </button>
            <input 
                type="text"
                placeholder={placeholder} 
                value={searchTerm}
                onChange={handleChange}
                className="p-2 flex-1 focus:outline-none rounded-r w-full" // Adjusted for length and rounded corners
            />
        </form>
    );
};

export default SearchBar;