import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PostType, UserType } from '../../global.types';
import {
   Tooltip,
   PreviewImage,
   ReportPopup,
   PostOptionBar,
   SharePopup,
} from '../../Components';
import { CDN_URL } from '../../Constants';
import { useContext } from 'react';
import { AuthContext } from '../../App';
import { timeAgo } from './helper';
import decoy from '../../assets/svg/decoy.svg';
import smoke from '../../assets/svg/smoke.svg';
import molotov from '../../assets/svg/molotov.svg';
import he from '../../assets/svg/he.svg';
import flash from '../../assets/svg/flash.svg';
import { FaCheckCircle } from 'react-icons/fa';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { CiDesktopMouse2 } from 'react-icons/ci';
import { useValorantAgents } from '../../contexts/ValorantAgentContext';

interface PostsProps {
   postData: PostType;
   userCache: Record<string, UserType>;
   fetchUsers: (userIds: string[]) => void;
}

const Posts: React.FC<PostsProps> = ({ postData, userCache, fetchUsers }) => {
   const [optionsBarPosition, setOptionsBarPosition] = useState({
      top: 0,
      left: 0,
   });
   const [showOptions, setShowOptions] = useState(false);
   const [showReportPopup, setShowReportPopup] = useState(false);
   const [showSharePopup, setShowSharePopup] = useState(false);
   const onReport = () => {
      setShowReportPopup(true);
      setShowOptions(false);
   };
   const [user, setUser] = useState<UserType | null>(null);
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
   const images = [
      `${postData.landingPosition.public_id}`,
      `${postData.standingPosition.public_id}`,
      `${postData.aimingPosition.public_id}`,
   ];

   // Conditionally use ValorantAgentContext
   const valorantContext =
      postData.game === 'Valorant' ? useValorantAgents() : null;

   useEffect(() => {
      if (userCache[postData.UserID]) {
         setUser(userCache[postData.UserID]);
      } else {
         fetchUsers([postData.UserID]);
      }
   }, [postData.UserID, userCache, fetchUsers]);

   useEffect(() => {
      if (userCache[postData.UserID]) {
         setUser(userCache[postData.UserID]);
      }
   }, [userCache, postData.UserID]);

   const onShare = () => {
      setShowSharePopup(true);
      setShowOptions(false);
   };

   const renderIcon = () => {
      if (postData.game === 'Valorant') {
         const valorantAgentIcon = valorantContext?.valorantAgents.find(
            (agent) =>
               agent.displayName ===
               (postData.valorantAgent === 'KAYO'
                  ? 'KAY/O'
                  : postData.valorantAgent),
         )?.displayIcon;

         const findAbilityIcon = (agentName: string, abilityName: string) => {
            const agent = valorantContext?.valorantAgents.find(
               (agent) =>
                  agent.displayName ===
                  (agentName === 'KAYO' ? 'KAY/O' : agentName),
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

         return (
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
         );
      } else {
         // CS2 grenade icons
         switch (postData.grenadeType) {
            case 'flash':
               return (
                  <Tooltip text="Flash">
                     <img
                        className="svg-icon absolute top-0 right-0 w-8 h-8 mt-[-32px] filter invert"
                        src={flash}
                        alt="Flash"
                     />
                  </Tooltip>
               );
            case 'smoke':
               return (
                  <Tooltip text="Smoke">
                     <img
                        className="svg-icon absolute top-0 right-0 w-8 h-8 mt-[-32px] filter invert"
                        src={smoke}
                        alt="Smoke"
                     />
                  </Tooltip>
               );
            case 'molotov':
               return (
                  <Tooltip text="Molotov">
                     <img
                        className="svg-icon absolute top-0 right-0 w-8 h-8 mt-[-32px] filter invert"
                        src={molotov}
                        alt="Molotov"
                     />
                  </Tooltip>
               );
            case 'he':
               return (
                  <Tooltip text="HE">
                     <img
                        className="svg-icon absolute top-0 right-0 w-8 h-8 mt-[-32px] filter invert"
                        src={he}
                        alt="HE"
                     />
                  </Tooltip>
               );
            case 'decoy':
               return (
                  <Tooltip text="Decoy">
                     <img
                        className="svg-icon absolute top-0 right-0 w-8 h-8 mt-[-32px] filter invert"
                        src={decoy}
                        alt="Decoy"
                     />
                  </Tooltip>
               );
            default:
               return null;
         }
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
               <div
                  style={{
                     paddingBottom: '56.25%',
                     position: 'relative',
                     backgroundColor: 'black',
                  }}
                  className="rounded-lg overflow-hidden"
               >
                  <img
                     className="absolute top-0 left-0 w-full h-full object-contain cursor-pointer"
                     src={`${CDN_URL}/${postData.landingPosition.public_id}`}
                     alt={postData.postTitle}
                     onClick={async () => {
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
                  {renderIcon()}
               </div>
               {isHovering && (
                  <PreviewImage
                     images={images}
                     onClick={async () => {
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
                  <div className="flex items-start space-x-2">
                     <Link
                        className="text-lg font-bold m-0 no-underline w-full sm:w-[12rem] line-clamp-2"
                        to={`/game/${postData.game}/${encodeURIComponent(postData._id)}`}
                     >
                        {postData.postTitle}
                     </Link>
                     <BsThreeDotsVertical
                        className="cursor-pointer ml-4"
                        onClick={(event: React.MouseEvent<SVGElement>) => {
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
                              adjustedLeft = windowWidth - PostOptionBarWidth;
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
                              left: adjustedLeft + 20,
                           });
                           setShowOptions(true);
                        }}
                        size="24"
                     />
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
         {showSharePopup && (
            <SharePopup
               shareUrl={`${window.location.origin}/game/${postData.game}/${encodeURIComponent(postData._id)}`}
               isOpen={showSharePopup}
               onClose={() => setShowSharePopup(false)}
            />
         )}
      </>
   );
};

export default Posts;
