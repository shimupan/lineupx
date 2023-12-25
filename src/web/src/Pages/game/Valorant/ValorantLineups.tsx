import React, { useContext, useEffect, useState } from 'react';
import { Header, Footer, SideNavWrapper } from '../../../Components';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../../../App';
import 'react-toastify/dist/ReactToastify.css';

interface Map {
     uuid: string;
     displayName: string;
     splash: string;
     // Add other properties if needed
}

const ValorantLineups: React.FC = () => {
    const [maps, setMaps] = useState<Map[]>([]);
    const Auth = useContext(AuthContext);
    const navigate = useNavigate();
    const { agentName } = useParams<{ agentName: string }>();

    useEffect(() => {
        fetch('https://valorant-api.com/v1/maps')
            .then(response => response.json())
            .then(data => setMaps(data.data));

        if (Auth?.accessToken && Auth.username) {
            // Your authentication related logic
        }
    }, [Auth?.username]);

    const handleClick = (mapName: string) => {
        navigate(`/game/valorant/agents/${agentName}/lineups/${mapName}`);
    };

    return (
        <>
            <Header />
            <main>
                <SideNavWrapper />
                <div className="flex flex-1 h-screen">
                    <div className="flex-1 flex justify-center items-center">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4 ml-10">
                        {maps.filter(map => !['The Range', 'Kasbah','District', 'Piazza','Drift'].includes(map.displayName)).map((map) => (
                                <div
                                    key={map.uuid}
                                    className="bg-gray-800 rounded overflow-hidden shadow-lg hover:shadow-2xl transition ease-in-out duration-300 cursor-pointer"
                                    onClick={() => handleClick(map.displayName)}
                                >
                                    <img
                                        src={map.splash}
                                        alt={map.displayName}
                                        className="w-full h-60 object-cover"
                                    />
                                    <div className="text-center text-white py-2">
                                        {map.displayName}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
};

export default ValorantLineups;