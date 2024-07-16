import { useNavigate, Link } from 'react-router-dom';
import { PostType, UserType, ValorantAgent } from '../../global.types';
import {
   Tooltip,
   PreviewImage,
   ReportPopup,
   PostOptionBar,
} from '../../Components';
import { CDN_URL } from '../../Constants';
import axios from 'axios';
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../App';
import { timeAgo } from './helper';
import decoy from '../../assets/svg/decoy.svg';
import smoke from '../../assets/svg/smoke.svg';
import molotov from '../../assets/svg/molotov.svg';
import he from '../../assets/svg/he.svg';
import flash from '../../assets/svg/flash.svg';
import { getUserByID } from '../../util/getUser';
import { FaCheckCircle } from 'react-icons/fa';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { CiDesktopMouse2 } from 'react-icons/ci';

interface PostsProps {
   postData: PostType;
}

const Posts: React.FC<PostsProps> = ({ postData }) => {
   const [optionsBarPosition, setOptionsBarPosition] = useState({
      top: 0,
      left: 0,
   });
   const [showOptions, setShowOptions] = useState(false);
   const onShare = () => {
      copyPostLinkToClipboard();
      setShowOptions(false);
   };
   const onReport = () => {
      setShowReportPopup(true);
      setShowOptions(false);
   };
   const [showReportPopup, setShowReportPopup] = useState(false);
   const [valorantAgents, setValorantAgents] = useState<ValorantAgent['data']>(
      [],
   );
   const [user, setUser] = useState<UserType>();
   const navigate = useNavigate();
   const Auth = useContext(AuthContext);
   const user_Id = Auth?._id;
   const [isHovering, setIsHovering] = useState(false);
   const handleMouseEnter = () => {
      setIsHovering(true);
   };
   const handleMouseLeave = () => {
      setIsHovering(false);
   };
   const [currentImage, setCurrentImage] = useState(0);
   const images = [
      postData.landingPosition.public_id,
      postData.standingPosition.public_id,
      postData.aimingPosition.public_id,
   ];

   useEffect(() => {
      axios
         .get('https://valorant-api.com/v1/agents?isPlayableCharacter=true')
         .then((response) => {
            setValorantAgents(response.data.data);
         });
      getUserByID(postData.UserID).then((response) => {
         setUser(response);
      });

      const interval = setInterval(() => {
         setCurrentImage((prevImage) => (prevImage + 1) % images.length);
      }, 1000);

      return () => clearInterval(interval); // Clean up on component unmount
   }, [currentImage]);

   const valorantAgentIcon = valorantAgents.find(
      (agent) =>
         agent.displayName ===
         (postData.valorantAgent === 'KAYO' ? 'KAY/O' : postData.valorantAgent),
   )?.displayIcon;

   const findAbilityIcon = (agentName: string, abilityName: string) => {
      const agent = valorantAgents.find(
         (agent) =>
            agent.displayName === (agentName === 'KAYO' ? 'KAY/O' : agentName),
      );
      const ability = agent?.abilities.find(
         (ability) => ability.displayName === abilityName,
      );
      return ability?.displayIcon;
   };

   const abilityIcon = findAbilityIcon(
      postData.valorantAgent,
      postData.ability,
   );

   const incrementViewCount = async () => {
      axios
         .post(`/post/${postData._id}/increment-view-count`,{
            game: postData.game,
         })

         .then((response) => {
            console.log('Successfully incremented view count:', response);
         })
         .catch((error) => {
            console.error('Failed to increment view count:', error);
            // Handle error
         });
   };

   const copyPostLinkToClipboard = async () => {
      const postUrl = `${window.location.origin}/game/${
         postData.game
      }/${encodeURIComponent(postData._id)}`;

      try {
         await navigator.clipboard.writeText(postUrl);
         alert('Link copied to clipboard!');
      } catch (err) {
         console.error('Failed to copy: ', err);
      }
   };

   return (
      <>
         <div>
            <div
               onMouseEnter={handleMouseEnter}
               onMouseLeave={handleMouseLeave}
               className="relative"
            >
               <div style={{ paddingBottom: '56.25%', position: 'relative' }}>
                  <img
                     className="absolute top-0 left-0 w-full h-full object-cover bg-gray-400 rounded-lg cursor-pointer"
                     src={`${CDN_URL}/${postData.landingPosition.public_id}`}
                     alt={postData.postTitle}
                     onClick={async () => {
                        await incrementViewCount();
                        navigate(`/game/${postData.game}/${postData._id}`, {
                           state: { postData },
                        });
                     }}
                  />
               </div>
               <div className="">
                  <Tooltip text={'Lineup requires a jump throw'}>
                     {postData.jumpThrow && (
                        <CiDesktopMouse2
                           size={20}
                           className="svg-icon absolute bottom-0 left-0 w-8 h-8 mt-[-25px] filter invert"
                        />
                     )}
                  </Tooltip>
                  {postData.game === 'Valorant' ? (
                     <>
                        <Tooltip text={postData.ability}>
                           <img
                              className="svg-icon absolute top-0 bottom-20 w-8 h-8 mt-[-32px] mr-[20px] filter invert"
                              style={{ right: '20px' }}
                              src={abilityIcon}
                              alt={postData.ability}
                           />
                        </Tooltip>
                        <Tooltip text={postData.valorantAgent}>
                           <img
                              className="svg-icon absolute bottom-0 right-0 w-8 h-8 mt-[-25px] "
                              src={valorantAgentIcon}
                              alt={postData.valorantAgent}
                           />
                        </Tooltip>
                     </>
                  ) : postData.grenadeType === 'flash' ? (
                     <Tooltip text="Flash">
                        <img
                           className="svg-icon absolute top-0 right-0 w-8 h-8 mt-[-32px] filter invert"
                           src={flash}
                           alt="Flash"
                        />
                     </Tooltip>
                  ) : postData.grenadeType === 'smoke' ? (
                     <Tooltip text="Smoke">
                        <img
                           className="svg-icon absolute top-0 right-0 w-8 h-8 mt-[-32px] filter invert"
                           src={smoke}
                           alt="Smoke"
                           title="Smoke"
                        />
                     </Tooltip>
                  ) : postData.grenadeType === 'molotov' ? (
                     <Tooltip text="Molotov">
                        <img
                           className="svg-icon absolute top-0 right-0 w-8 h-8 mt-[-32px] filter invert"
                           src={molotov}
                           alt="Molotov"
                           title="Molotov"
                        />
                     </Tooltip>
                  ) : postData.grenadeType === 'shock' ? (
                     <Tooltip text="Decoy">
                        <img
                           className="svg-icon absolute top-0 right-0 w-8 h-8 mt-[-32px] filter invert"
                           src={decoy}
                           alt="Decoy"
                           title="Decoy"
                        />
                     </Tooltip>
                  ) : postData.grenadeType === 'he' ? (
                     <Tooltip text="HE">
                        <img
                           className="svg-icon absolute top-0 right-0 w-8 h-8 mt-[-32px] filter invert"
                           src={he}
                           alt="HE"
                           title="HE"
                        />
                     </Tooltip>
                  ) : (
                     'Unknown'
                  )}
               </div>
               {isHovering && (
                  <PreviewImage
                     images={images}
                     currentImage={currentImage}
                     onClick={async () => {
                        await incrementViewCount();
                        navigate(`/game/${postData.game}/${postData._id}`, {
                           state: { postData },
                        });
                     }}
                  />
               )}
            </div>

            <div className="flex items-center mt-4">
               <Link to={`/user/${postData.Username}`}>
                  <img
                     src={user?.ProfilePicture}
                     className="mr-3 rounded-full w-9 h-9 bg-gray-400 mb-8"
                  />
               </Link>
               <div className="flex flex-col flex-grow">
                  <div className="flex justify-between">
                     <Link
                        className="text-lg font-bold m-0 no-underline"
                        to={`/game/${postData.game}/${encodeURIComponent(
                           postData._id,
                        )}`}
                     >
                        {postData.postTitle.length > 23
                           ? `${postData.postTitle.substring(0, 23)}...`
                           : postData.postTitle}
                     </Link>
                     <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-2">
                           <BsThreeDotsVertical
                              className="cursor-pointer"
                              onClick={(
                                 event: React.MouseEvent<SVGElement>,
                              ) => {
                                 const rect =
                                    event.currentTarget.getBoundingClientRect();
                                 const top = rect.top + window.scrollY;
                                 const left = rect.left + window.scrollX;
                                 const PostOptionBarWidth = 200;
                                 const PostOptionBarHeight = 100;
                                 const windowWidth = window.innerWidth;
                                 const windowHeight = window.innerHeight;

                                 let adjustedLeft = left;
                                 let adjustedTop = top + rect.height;

                                 if (left + PostOptionBarWidth > windowWidth) {
                                    adjustedLeft =
                                       windowWidth - PostOptionBarWidth;
                                 } else {
                                    adjustedLeft += 25;
                                 }

                                 if (
                                    top + rect.height + PostOptionBarHeight >
                                    windowHeight
                                 ) {
                                    adjustedTop = top - PostOptionBarHeight;
                                 }

                                 setOptionsBarPosition({
                                    top: adjustedTop + 85,
                                    left: adjustedLeft,
                                 });
                                 setShowOptions(true);
                              }}
                              size="24"
                           />
                        </div>
                     </div>
                  </div>
                  <div className="flex flex-row">
                     <Tooltip text={postData.Username}>
                        <Link
                           className="no-underline m-0 transition-colors duration-150 text-gray-300 hover:text-white"
                           to={`/user/${postData.Username}`}
                        >
                           {postData.Username}
                        </Link>
                     </Tooltip>
                     {user?.role == 'admin' && (
                        <Tooltip text={user?.role}>
                           <span className="flex justify-center items-center ml-1 mt-0.2">
                              <FaCheckCircle size={13} />
                           </span>
                        </Tooltip>
                     )}
                  </div>

                  <div>
                     <span className="text-gray-300">
                        {postData.views} views
                     </span>
                     <span className="ml-1 mr-1 text-gray-300">•</span>
                     <span className="text-gray-300">
                        {timeAgo(new Date(postData.date))}
                     </span>
                  </div>
               </div>
            </div>
         </div>
         {showReportPopup && user_Id && (
            <ReportPopup
               postId={postData._id}
               userId={user_Id}
               onClose={() => setShowReportPopup(false)}
            />
         )}
         {showOptions && (
            <PostOptionBar
               onClose={() => setShowOptions(false)}
               onShare={onShare}
               onReport={onReport}
               style={{
                  position: 'absolute',
                  top: optionsBarPosition.top,
                  left: optionsBarPosition.left,
                  width: '150px',
               }}
            />
         )}
      </>
   );
};

export default Posts;
