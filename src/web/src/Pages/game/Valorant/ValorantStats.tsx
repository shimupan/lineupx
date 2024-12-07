import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Layout } from '../../../Components';
import VALORANT_BANNER from '../../../assets/valorantbanner.webp';
import { getUserByUsername } from '../../../util/getUser';
import { UserType, PostType } from '../../../global.types';
import { AuthContext } from '../../../App';
import { GAMES, CDN_URL } from '../../../Constants';
import axios from 'axios';
import { toast } from 'react-toastify';

const ValorantStats: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [, setUser] = useState<UserType>({
        role: '',
        _id: '',
        username: '',
        email: '',
        password: '',
        Verified: false,
        ProfilePicture: '',
        verificationCode: '',
        likes: [''],
        dislikes: [''],
        saved: [''],
        comments: [
            {
                text: '',
                createdAt: new Date(),
                post: '',
            },
        ],
        followers: [''],
        following: [''],
        resetPasswordToken: '',
        resetPasswordExpires: new Date(),
    });
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const [_, setLoading] = useState(true);
    const [posts, setPosts] = useState<PostType[]>([]);
    const Auth = useContext(AuthContext);

    useEffect(() => {
        // Fetch Users
        getUserByUsername(id!, Auth!.username)
        .then((response) => {
            setUser(response);
            // Fetch User Posts
            const postsPromises = GAMES.map((game) =>
                axios.get(`/post/${game}/${response._id}`),
            );
            return Promise.all(postsPromises);
        })
        .then((responses) => {
            const allPosts = responses.flatMap((response) => response.data);
            // Sort posts by views in descending order
            allPosts.sort((a, b) => b.views - a.views);
            setPosts(allPosts);
        })
        .catch((error) => {
            toast.error('Error Fetching Data');
            return error;
        })
        .finally(() => {
            setLoading(false);
        })
    }, []);

    interface StatCardProps {
        topText: string;
        middleText: string;
        bottomText: string;
        altText: string;
        src: string;
    }

    interface AgentCardProps {
        agentRole: string;
        agentName: string;
        pickRate: string;
        winRate: string;
        killDeathRatio: string;
        altText: string;
        src: string;
    }

    const StatCard: React.FC<StatCardProps> = ({ topText, middleText, bottomText, altText, src }) => (
        <div className="w-52 h-64 bg-white flex flex-col items-center rounded-lg">
            <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mt-4 overflow-hidden">
                <img 
                    src={src} 
                    alt={altText} 
                    className="w-full h-full object-cover" />
            </div>
            <span className="text-black flex-grow flex items-end justify-center">{topText}</span>
            <span className="text-black flex-grow flex items-center justify-center font-bold text-2xl">{middleText}</span>
            <span className="text-gray-500 mb-10 font-bold text-2xl">{bottomText}</span>
        </div>
    );

    const StatCardMobile: React.FC<StatCardProps> = ({ topText, middleText, bottomText, altText, src }) => (
        <div className="w-52 h-64 bg-white flex flex-col items-center rounded-lg mt-4">
            <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mt-4">
                <img 
                    src={src} 
                    alt={altText} 
                    className="w-8 h-8" />
            </div>
            <span className="text-black flex-grow flex items-end justify-center">{topText}</span>
            <span className="text-black flex-grow flex items-center justify-center font-bold text-2xl">{middleText}</span>
            <span className="text-gray-500 mb-10 font-bold text-2xl">{bottomText}</span>
        </div>
    );

    const AgentCard: React.FC<AgentCardProps> = ({ agentRole, agentName, pickRate, winRate, killDeathRatio, altText, src }) => (
        <div className="flex flex-row mt-4">
            <img
                src={src}
                alt={altText}
                className="w-auto h-16 rounded-lg"
            />
            <div className="ml-4">
                <div className="grid grid-cols-4 gap-4">
                    <div className="text-gray-500 font-bold">{agentRole}</div>
                    <div className="text-gray-500 font-bold text-center">Pick Rate</div>
                    <div className="text-gray-500 font-bold text-center">Win Rate</div>
                    <div className="text-gray-500 font-bold text-center">K/D Ratio</div>
                </div>
                <div className="grid grid-cols-4 gap-4 mt-2 text-lg">
                    <div className="text-black font-bold">{agentName}</div>
                    <div className="text-black font-bold text-center">{pickRate}</div>
                    <div className="text-black font-bold text-center">{winRate}</div>
                    <div className="text-black font-bold text-center">{killDeathRatio}</div>
                </div>
            </div>
        </div>
    );
    
    return (    
        <Layout>
            <div className="hidden md:flex flex-col items-center justify-center mt-16">
                <div
                    className="flex flex-col items-center h-96 relative bg-center bg-no-repeat bg-cover w-9/12"
                    style={{
                    backgroundImage: `url(${VALORANT_BANNER})`,
                    backgroundSize: '100%',
                    backgroundPosition: '90% 10%'
                    }}
                >
                    <div className="w-full h-full bg-black opacity-50 absolute inset-0"></div>
                    <h1 className="text-4xl mb-16 z-10 font-bold mt-20 text-white">Valorant Stats</h1>
                    <div className="w-full px-4 z-10 flex justify-center items-center absolute inset-0">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        placeholder="Search..."
                        className="w-8/12 p-4 rounded text-black text-center shadow-lg bg-white"
                    />
                    </div>
                </div>
                </div>

            <div className="md:hidden flex flex-col items-center justify-center mt-16">
                <div className="flex flex-col items-center h-96 relative bg-center bg-no-repeat bg-cover w-full"
                    style={{
                        backgroundImage: `url(${VALORANT_BANNER})`,
                        backgroundSize: '120%',
                        backgroundPosition: '90% 10%'
                    }}
                >
                    <div className="w-full h-full bg-black opacity-50 absolute inset-0"></div>
                    <h1 className="text-4xl z-10 mt-20 font-bold text-white">Valorant Stats</h1>
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
            </div>
            <div className="hidden md:flex flex-row justify-center mt-8 space-x-12">
                <StatCard 
                    topText="Top NA Player" 
                    middleText="DJ Alex" 
                    bottomText="1028 Rating" 
                    altText="Player 1 Logo" 
                    src="https://imgsvc.trackercdn.com/url/size(128),fit(cover)/https%3A%2F%2Ftitles.trackercdn.com%2Fvalorant-api%2Fplayercards%2F1c9c0ecf-487f-0c7b-6a06-d8bb37118db7%2Fdisplayicon.png/image.jpg"
                />
                <StatCard 
                    topText="Top EU Player" 
                    middleText="Slovenski" 
                    bottomText="1038 Rating" 
                    altText="Player 2 Logo" 
                    src="https://imgsvc.trackercdn.com/url/size(128),fit(cover)/https%3A%2F%2Ftitles.trackercdn.com%2Fvalorant-api%2Fplayercards%2Fe6027fd8-49e9-5e91-40fd-00abd1077878%2Fdisplayicon.png/image.jpg"
                />
                <StatCard 
                    topText="Top SEA Player" 
                    middleText="DLC 3" 
                    bottomText="1024 Rating" 
                    altText="Player 3 Logo" 
                    src="https://imgsvc.trackercdn.com/url/size(128),fit(cover)/https%3A%2F%2Ftitles.trackercdn.com%2Fvalorant-api%2Fplayercards%2Fdee6814e-42f5-50c2-9f5d-da88301ba56b%2Fdisplayicon.png/image.jpg"
                />
            </div>
            <div className="hidden md:flex flex-row justify-center mt-8 space-x-12">
            <div className="w-[430px] h-80 bg-white flex flex-col rounded-lg p-4">
                    <span className="text-black mt-4 text-xl font-bold text-center">Lineups</span>
                  {posts.slice(0, 3).map((post) => (
                    <div key={post._id} className="flex flex-row items-center mt-2">
                      <img
                        src={`${CDN_URL}/${post.landingPosition.public_id}.png`}
                        alt="Post Image"
                        className="w-auto h-16 rounded-lg"
                      />
                      <div className="ml-4">
                        <div className="text-black font-bold">{post.postTitle}</div>
                        <div className="text-black"> by {post.Username}</div>
                        <div className="text-black">{`${post.views} views • ${Math.floor((new Date().getTime() - new Date(post.date).getTime()) / (1000 * 60 * 60 * 24))} days ago`}</div>
                      </div>
                    </div>
                  ))}
                </div>
            <div className="w-430px h-80 bg-white flex flex-col rounded-lg p-4">
                <span className="text-black mt-4 text-xl font-bold text-center">Agents</span>
                <AgentCard
                    agentRole="Duelist"
                    agentName="Jett"
                    pickRate="64%"
                    winRate="50.8%"
                    killDeathRatio="1.1"
                    altText="Jett Logo"
                    src={`https://media.valorant-api.com/agents/add6443a-41bd-e414-f6ad-e58d267f4e95/displayicon.png`}
                />
                <AgentCard
                    agentRole="Duelist"
                    agentName="Reyna"
                    pickRate="60%"
                    winRate="51.4%"
                    killDeathRatio="1.0"
                    altText="Reyna Logo"
                    src={`https://media.valorant-api.com/agents/a3bfb853-43b2-7238-a4f1-ad90e9e46bcc/displayicon.png`}
                />
                <AgentCard
                    agentRole="Sentinel"
                    agentName="Breach"
                    pickRate="10%"
                    winRate="55%"
                    killDeathRatio="1.2"
                    altText="Breach Logo"
                    src={`https://media.valorant-api.com/agents/5f8d3a7f-467b-97f3-062c-13acf203c006/displayicon.png`}
                />
            </div>
            </div>

            <div className="flex flex-col md:hidden items-center mt-8">
                <StatCardMobile
                    topText="Top NA Player" 
                    middleText="DJ Alex" 
                    bottomText="1028 Rating" 
                    altText="Player 1 Logo" 
                    src="https://imgsvc.trackercdn.com/url/size(128),fit(cover)/https%3A%2F%2Ftitles.trackercdn.com%2Fvalorant-api%2Fplayercards%2F1c9c0ecf-487f-0c7b-6a06-d8bb37118db7%2Fdisplayicon.png/image.jpg"
                />
                <StatCardMobile
                    topText="Top EU Player" 
                    middleText="Slovenski" 
                    bottomText="1038 Rating" 
                    altText="Player 2 Logo" 
                    src="https://imgsvc.trackercdn.com/url/size(128),fit(cover)/https%3A%2F%2Ftitles.trackercdn.com%2Fvalorant-api%2Fplayercards%2Fe6027fd8-49e9-5e91-40fd-00abd1077878%2Fdisplayicon.png/image.jpg"
                />
                <StatCardMobile
                    topText="Top SEA Player" 
                    middleText="DLC 3" 
                    bottomText="1024 Rating" 
                    altText="Player 3 Logo" 
                    src="https://imgsvc.trackercdn.com/url/size(128),fit(cover)/https%3A%2F%2Ftitles.trackercdn.com%2Fvalorant-api%2Fplayercards%2Fdee6814e-42f5-50c2-9f5d-da88301ba56b%2Fdisplayicon.png/image.jpg"
                />
                </div>
                <div className="flex flex-col md:hidden items-center mt-8 space-x-2">
                    <div className="w-[430px] h-auto bg-white flex flex-col rounded-lg p-4">
                        <span className="text-black mt-4 text-xl text-center font-bold">Lineups</span>
                    {posts.slice(0, 3).map((post) => (
                        <div key={post._id} className="flex flex-row items-center mt-2">
                        <img
                            src={`${CDN_URL}/${post.landingPosition.public_id}.png`}
                            alt="Post Image"
                            className="w-auto h-16 rounded-lg"
                        />
                        <div className="ml-4">
                            <div className="text-black font-bold">{post.postTitle}</div>
                            <div className="text-black"> by {post.Username}</div>
                            <div className="text-black">{`${post.views} views • ${Math.floor((new Date().getTime() - new Date(post.date).getTime()) / (1000 * 60 * 60 * 24))} days ago`}</div>
                        </div>
                        </div>
                    ))}
                    </div>
                    <div className="w-[430px] h-auto bg-white flex flex-col rounded-lg p-4 mt-4">
                        <span className="text-black mt-4 text-xl text-center font-bold">Agents</span>
                        <AgentCard
                            agentRole="Duelist"
                            agentName="Jett"
                            pickRate="64%"
                            winRate="50.8%"
                            killDeathRatio="1.1"
                            altText="Jett Logo"
                            src={`https://media.valorant-api.com/agents/add6443a-41bd-e414-f6ad-e58d267f4e95/displayicon.png`}
                        />
                        <AgentCard
                            agentRole="Duelist"
                            agentName="Reyna"
                            pickRate="60%"
                            winRate="51.4%"
                            killDeathRatio="1.0"
                            altText="Reyna Logo"
                            src={`https://media.valorant-api.com/agents/a3bfb853-43b2-7238-a4f1-ad90e9e46bcc/displayicon.png`}
                        />
                        <AgentCard
                            agentRole="Sentinel"
                            agentName="Breach"
                            pickRate="10%"
                            winRate="55%"
                            killDeathRatio="1.2"
                            altText="Breach Logo"
                            src={`https://media.valorant-api.com/agents/5f8d3a7f-467b-97f3-062c-13acf203c006/displayicon.png`}
                        />
                    </div>
                </div>
        </Layout>
    );
};

export default ValorantStats;