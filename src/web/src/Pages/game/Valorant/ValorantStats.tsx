import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '../../../Components';
import VALORANT_BANNER from '../../../assets/valorantbanner.webp';
import cs2Logo from '../../../assets/svg/csgo.svg';
import { getUserByUsername } from '../../../util/getUser';
import { UserType, PostType } from '../../../global.types';
import { AuthContext } from '../../../App';
import { GAMES, CDN_URL } from '../../../Constants';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

const ValorantStats: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [user, setUser] = useState<UserType>({
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

    const [loading, setLoading] = useState(true);
    const [posts, setPosts] = useState<PostType[]>([]);
    const [open, setOpen] = useState(false);
    const [postname, setPostName] = useState('');
    const [deletePopup, setDeletePopup] = useState({
        isOpen: false,
        postId: '',
        game: '',
    });
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
        });
        setPosts([{
          "_id": "65c6c44f2e0dc09b91ed0c07",
          "Username": "kagiriez",
          "UserID": "65a70095dc44d590069824e2",
          "postTitle": "B Camera",
          "mapName": "bind",
          "lineupLocation": "B Site",
          "lineupDescription": "1. Jump on the elevator then on the two superimposed crates, then stand where it is indicated.\n2. Aim the camera as shown (as high as possible).\n3. Jump and throw the camera as high as possible.",
          "teamSide": "Defender",
          "likes": [],
          "dislikes": [],
          "views": 26,
          "standingPosition": {
            "public_id": "Valorant/za9lk5vplpgqdj9bgxde",
            "asset_id": "a8e34c27e0de9bb207fdc55b9e3d8c59"
          },
          "aimingPosition": {
            "public_id": "Valorant/izvpcy5w10bm7oj1ct7w",
            "asset_id": "0e560ff2c9867b203c2e1e3202dabde3"
          },
          "landingPosition": {
            "public_id": "Valorant/ean3buk6wgmsdy1ywyvy",
            "asset_id": "af7dd0064e155add8c4aef425b9b4534"
          },
          "grenadeType": "",
          "jumpThrow": false,
          "game": "Valorant",
          "approved": true,
          "valorantAgent": "Cypher",
          "ability": "Spycam",
          "lineupLocationCoords": {
            "x": 592.896,
            "y": 581.6320000000001,
            "name": "Tube"
          },
          "lineupPositionCoords": { "x": 593.1825647504737, "y": 729.6727732154137 },
          "comments": [],
          "date": "2024-02-10T00:33:19.373Z" ,
          "__v": 2,
          "reports": []
        },
        {
          "_id": "65fde52f674cd62852a54d56" ,
          "Username": "kagiriez",
          "UserID": "65a70095dc44d590069824e2" ,
          "postTitle": "Sova A Site Recon ",
          "mapName": "ascent",
          "lineupLocation": "Ascent A Main",
          "lineupDescription": "1. Stand against the barrels outside of the ice cream shop.\n2. Look just above the flag pole, where the edge of the building is.\n3. Fire a 2 Bar 0 Bounce Recon Bolt, it should land on the top of A Site (image 3).",
          "teamSide": "Attacker",
          "likes": [],
          "dislikes": [],
          "views": 15,
          "standingPosition": {
            "public_id": "Valorant/eqr9y5uysgidcuwu8ziu",
            "asset_id": "14492df44a028d4119f14ab4fca2025f"
          },
          "aimingPosition": {
            "public_id": "Valorant/rnsajtbsaxj46bgiua3w",
            "asset_id": "24c5fc0fa791d4101a9acbe3a2a230ed"
          },
          "landingPosition": {
            "public_id": "Valorant/tlvx82dcxaqocd5qka63",
            "asset_id": "407441dcbfc98620ae2fbde058f42a3e"
          },
          "grenadeType": "",
          "jumpThrow": false,
          "game": "Valorant",
          "approved": true,
          "valorantAgent": "Sova",
          "ability": "Recon Bolt",
          "lineupLocationCoords": { "x": 735.936, "y": 303.104, "name": "A Site" },
          "lineupPositionCoords": { "x": 1414.7456816051797, "y": 493.214117850166 },
          "comments": [],
          "date": "2024-03-22T20:08:15.408Z" ,
          "__v": 2,
          "reports": []
        },
        {
          "_id": "65fde629674cd62852a5793c" ,
          "Username": "kagiriez",
          "UserID": "65a70095dc44d590069824e2" ,
          "postTitle": "Oneway for A Stairs ",
          "mapName": "ascent",
          "lineupLocation": "Ascent B Site",
          "lineupDescription": "Use this smoke to see the toes of people behind B Stairs",
          "teamSide": "Attacker",
          "likes": [],
          "dislikes": [],
          "views": 4,
          "standingPosition": {
            "public_id": "Valorant/nzrtcvo3rqx9oyz76x6p",
            "asset_id": "0cde1501be5682903ec64e61b5270143"
          },
          "aimingPosition": {
            "public_id": "Valorant/hg8hviwmzvnffxjeztkx",
            "asset_id": "f2962d0ee8bf0a70a9e861283265f46a"
          },
          "landingPosition": {
            "public_id": "Valorant/lhjs975yj5om7xk3is9w",
            "asset_id": "ed5330b6d77ea06465d5338bcfe31a3a"
          },
          "grenadeType": "",
          "jumpThrow": false,
          "game": "Valorant",
          "approved": true,
          "valorantAgent": "Omen",
          "ability": "Dark Cover",
          "lineupLocationCoords": { "x": 391.872, "y": 1359.872, "name": "B CT" },
          "lineupPositionCoords": { "x": 472.03726686704306, "y": 1560.933860635248 },
          "comments": [],
          "date": "2024-03-22T20:12:25.145Z" ,
          "__v": 0,
          "reports": []
        }])
    }, []);

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

    interface AgentCardProps {
        agentRole: string;
        agentName: string;
        pickRate: string;
        winRate: string;
        killDeathRatio: string;
        altText: string;
        src: string;
    }

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
                <div className="w-[430px] h-80 bg-white flex flex-col rounded-lg p-4">
                    <span className="text-black mt-4 text-xl text-center">Lineups</span>
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
                <div className="w-430px h-80 bg-white flex flex-col rounded-lg p-4">
                    <span className="text-black mt-4 text-xl text-center">Agents</span>
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

            <div className="flex flex-col md:hidden items-center mt-8 space-x-2">
                <div className="flex flex-row">
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
                <div className="flex mt-16">
                    <div className="w-[430px] h-80 bg-white flex flex-col rounded-lg p-4">
                        <span className="text-black mt-4 text-xl text-center">Lineups</span>
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
                        <span className="text-black mt-4 text-xl text-center">Agents</span>
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
            </div>
        </Layout>
    );
};

export default ValorantStats;