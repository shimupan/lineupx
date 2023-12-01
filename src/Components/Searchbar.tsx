import { useState, FormEvent, ChangeEvent } from 'react';

interface SearchBarProps {
    onSearch: (searchTerm: string) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        onSearch(searchTerm);
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    return (
        <form onSubmit={handleSubmit} className="flex items-center">
            <input 
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleChange}
                className="p-2 border border-gray-300 rounded-l-md focus:outline-none focus:border-blue-500"
            />
            <button 
                type="submit"
                className="bg-blue-500 text-white p-2 rounded-r-md"
            >
                Search
            </button>
        </form>
    );
};

export default SearchBar;