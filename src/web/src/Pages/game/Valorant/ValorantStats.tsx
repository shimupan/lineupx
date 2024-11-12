import { Layout } from '../../../Components';
import { useState } from 'react';
import VALORANT_BANNER from '../../../assets/valorantbanner.webp';
import cs2Logo from '../../../assets/svg/csgo.svg';

const ValorantStats: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    interface StatCardProps {
        topText: string;
        middleText: string;
        bottomText: string;
        altText: string;
        src: string;
    }

    const StatCard: React.FC<StatCardProps> = ({ topText, middleText, bottomText, altText, src }) => (
        <div className="w-52 h-64 bg-white flex flex-col items-center rounded-lg">
            <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mt-4">
                <img 
                    src={src} 
                    alt={altText} 
                    className="w-8 h-8" />
            </div>
            <span className="text-black flex-grow flex items-center justify-center mt-4">{topText}</span>
            <span className="text-black flex-grow flex items-end justify-center">{middleText}</span>
            <span className="text-black mt-10">{bottomText}</span>
        </div>
    );

    return (    
        <Layout>
            <div className="hidden md:flex flex-col items-center justify-center mt-32">
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
            <div className="md:hidden flex flex-col items-center justify-center mt-32">
                <h1 className="text-4xl mb-16 font-bold text-white">Valorant Stats</h1>
                <div
                    className="flex flex-col items-center h-96 relative bg-center bg-no-repeat bg-cover w-full"
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
            <div className="hidden md:flex flex-row justify-center mt-8 space-x-24">
                <div className="w-60 h-72 bg-white flex flex-col items-center rounded-lg">
                    <span className="text-black mt-4 text-xl">Lineups</span> 
                </div>
                <StatCard 
                    topText="Top Text 1" 
                    middleText="Middle Text 1" 
                    bottomText="Bottom Text 1" 
                    altText="CS2 Logo" 
                    src={cs2Logo} 
                />
                <StatCard 
                    topText="Top Text 2" 
                    middleText="Middle Text 2" 
                    bottomText="Bottom Text 2" 
                    altText="CS2 Logo" 
                    src={cs2Logo} 
                />
                <StatCard 
                    topText="Top Text 3" 
                    middleText="Middle Text 3" 
                    bottomText="Bottom Text 3" 
                    altText="CS2 Logo" 
                    src={cs2Logo} 
                />
                <div className="w-60 h-72 bg-white flex flex-col items-center rounded-lg">
                    <span className="text-black mt-4 text-xl">Agent Data</span> 
                </div>
            </div>

            <div className="flex md:hidden items-center mt-8 space-x-2">
                <StatCard 
                    topText="Top Text 1" 
                    middleText="Middle Text 1" 
                    bottomText="Bottom Text 1" 
                    altText="CS2 Logo" 
                    src={cs2Logo} 
                />
                <StatCard 
                    topText="Top Text 2" 
                    middleText="Middle Text 2" 
                    bottomText="Bottom Text 2" 
                    altText="CS2 Logo" 
                    src={cs2Logo} 
                />
                <StatCard 
                    topText="Top Text 3" 
                    middleText="Middle Text 3" 
                    bottomText="Bottom Text 3" 
                    altText="CS2 Logo" 
                    src={cs2Logo} 
                />
            </div>
        </Layout>
    );
};

export default ValorantStats;