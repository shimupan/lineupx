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

    interface StatCardProps {
        topText: string;
        middleText: string;
        bottomText: string;
        altText: string;
        src: string;
    }

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
    }, [{
    "_id": { "$oid": "65c6c44f2e0dc09b91ed0c07" },
    "Username": "kagiriez",
    "UserID": { "$oid": "65a70095dc44d590069824e2" },
    "postTitle": "B Camera",
    "mapName": "bind",
    "lineupLocation": "B Site",
    "lineupDescription": "1. Jump on the elevator then on the two superimposed crates, then stand where it is indicated.\n2. Aim the camera as shown (as high as possible).\n3. Jump and throw the camera as high as possible.",
    "teamSide": "Defender",
    "likes": [
      {
        "userId": "65a70095dc44d590069824e2",
        "_id": { "$oid": "666354fdbea00eaf176ef56f" }
      }
    ],
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
    "comments": [
      {
        "username": "kagiriez",
        "user": "65a70095dc44d590069824e2",
        "text": "very cool lineup!",
        "createdAt": { "$date": "2024-03-16T20:37:05.413Z" },
        "_id": { "$oid": "65f602f1674cd62852a4d26a" }
      }
    ],
    "date": { "$date": "2024-02-10T00:33:19.373Z" },
    "__v": 2,
    "reports": []
  },
  {
    "_id": { "$oid": "65fde52f674cd62852a54d56" },
    "Username": "kagiriez",
    "UserID": { "$oid": "65a70095dc44d590069824e2" },
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
    "comments": [
      {
        "username": "kagiriez",
        "user": "65a70095dc44d590069824e2",
        "text": "Wow!",
        "createdAt": { "$date": "2024-03-22T20:08:33.922Z" },
        "_id": { "$oid": "65fde541674cd62852a5502a" }
      },
      {
        "username": "ooccupate",
        "user": "65a70055dc44d590069824da",
        "text": "yo this won me 1v1",
        "createdAt": { "$date": "2024-03-22T21:03:05.072Z" },
        "_id": { "$oid": "65fdf209674cd62852a65f31" }
      }
    ],
    "date": { "$date": "2024-03-22T20:08:15.408Z" },
    "__v": 2,
    "reports": []
  },
  {
    "_id": { "$oid": "65fde629674cd62852a5793c" },
    "Username": "kagiriez",
    "UserID": { "$oid": "65a70095dc44d590069824e2" },
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
    "date": { "$date": "2024-03-22T20:12:25.145Z" },
    "__v": 0,
    "reports": []
  },
  {
    "_id": { "$oid": "65fde6e4674cd62852a59ed2" },
    "Username": "kagiriez",
    "UserID": { "$oid": "65a70095dc44d590069824e2" },
    "postTitle": "C Main Haunt from C Link",
    "mapName": "lotus",
    "lineupLocation": "C Main",
    "lineupDescription": "1. Stand in line with the left side of the beam.\n2. Aim the bottom left HUD line at the edge of the pillar.\n3. Left-click.",
    "teamSide": "Defender",
    "likes": [],
    "dislikes": [],
    "views": 3,
    "standingPosition": {
      "public_id": "Valorant/bmm3knckr8itva62qk5z",
      "asset_id": "3e48c7f5c9d920adddf8daa44d8c13ba"
    },
    "aimingPosition": {
      "public_id": "Valorant/poy4ghjjwvbtgx7rb3ls",
      "asset_id": "ee00a492c52a5a977fd6e7c7ba6f19e2"
    },
    "landingPosition": {
      "public_id": "Valorant/pr0j9ryol6nnptjxlncj",
      "asset_id": "59b982f33445c454da3278fc27a46317"
    },
    "grenadeType": "",
    "jumpThrow": false,
    "game": "Valorant",
    "approved": true,
    "valorantAgent": "Fade",
    "ability": "Haunt",
    "lineupLocationCoords": {
      "x": 674.816,
      "y": 1155.0720000000001,
      "name": "B Door"
    },
    "lineupPositionCoords": { "x": 646.2333869816987, "y": 946.1240249364633 },
    "comments": [],
    "date": { "$date": "2024-03-22T20:15:32.076Z" },
    "__v": 0,
    "reports": []
  },
  {
    "_id": { "$oid": "65fde797674cd62852a5df0d" },
    "Username": "kagiriez",
    "UserID": { "$oid": "65a70095dc44d590069824e2" },
    "postTitle": "A Lobby to Backsite B",
    "mapName": "breeze",
    "lineupLocation": "Backsite B",
    "lineupDescription": "Aim at corner and TP",
    "teamSide": "Attacker",
    "likes": [],
    "dislikes": [],
    "views": 9,
    "standingPosition": {
      "public_id": "Valorant/bhqerdfousbglrpp9npw",
      "asset_id": "f54f68c6d49d4be15ee259f7cd2cee61"
    },
    "aimingPosition": {
      "public_id": "Valorant/lgcu7famlc2iqaakshv1",
      "asset_id": "313242a905e6a8f821abc86135149434"
    },
    "landingPosition": {
      "public_id": "Valorant/a5uzdchiozngunkdffxk",
      "asset_id": "48e3ba53dc2c99504ac38515c9f936ba"
    },
    "grenadeType": "",
    "jumpThrow": false,
    "game": "Valorant",
    "approved": true,
    "valorantAgent": "Yoru",
    "ability": "GATECRASH",
    "lineupLocationCoords": {
      "x": 105.47200000000001,
      "y": 593.92,
      "name": "B Backsite"
    },
    "lineupPositionCoords": {
      "x": 1469.3954447784051,
      "y": 1726.2493929313027
    },
    "comments": [],
    "date": { "$date": "2024-03-22T20:18:31.728Z" },
    "__v": 0,
    "reports": []
  }]);

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
                    {posts.slice(0, 3).map((post, index) => (
                    <StatCard 
                        key={index}
                        topText={post.postTitle} 
                        middleText={`${post.views} views`} 
                        bottomText={new Date(post.date).toLocaleDateString()} 
                        altText="Post Image" 
                        src={`${CDN_URL}/${post.standingPosition.public_id}.${post.standingPosition.asset_id}`} 
                    />
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