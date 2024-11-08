import { Layout } from '../../../Components';
import { useState } from 'react';
import VALORANT_BANNER from '../../../assets/valorantbanner.webp';

const ValorantStats: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    return (    
        <Layout>
            <div className="flex flex-col items-center justify-center mt-32">
                <h1 className="text-4xl mb-16 font-bold text-white">Valorant Stats</h1>
                <div
                    className="flex flex-col items-center h-96 relative bg-center bg-no-repeat bg-cover w-9/12"
                    style={{
                        backgroundImage: `url(${VALORANT_BANNER})`,
                        backgroundSize: '100%',
                        backgroundPosition: '90% 10%',
                        opacity: 0.5,
                    }}
                ></div>
                    <div className="w-full px-4 z-10 flex justify-center items-center absolute inset-0">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            placeholder="Search..."
                            className="w-8/12 p-4 rounded text-black text-center" 
                        />
                    </div>
            </div>
            <div className="flex flex-row justify-center mt-8 space-x-4">
                <div className="w-32 h-32 bg-white"></div>
                <div className="w-32 h-32 bg-white"></div>
                <div className="w-32 h-32 bg-white"></div>
            </div>
        </Layout>
    );
};

export default ValorantStats;