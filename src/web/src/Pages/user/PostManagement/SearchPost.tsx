import React, { useState } from 'react';

const SearchPost: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState<string[]>([]);

    const items = ['Post 1', 'Post 2', 'Post 3', 'Another Post', 'More Posts'];

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const handleSearch = () => {
        const filteredItems = items.filter(item =>
            item.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setResults(filteredItems);
    };

    return (
        <div className="p-4">
            <input
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            placeholder="Search posts..."
            className="text-black h-11/12 w-11/12 p-2 border border-gray-800 rounded-md"
            />
            
            <button 
            onClick={handleSearch} 
            className="ml-2 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-700"
            >
            Search
            </button>
            <ul className="mt-4">
            {results.map((result, index) => (
            <li key={index} className="p-2 border-b border-gray-300">
            {result}
            </li>
            ))}
            </ul>
        </div>
    );
};

export default SearchPost;