import { useNavigate, Link } from 'react-router-dom';
import { PostType, UserType, ValorantAgent } from '../../global.types';
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
/*
import views from '../../assets/svg/views.svg';
import like from '../../assets/svg/like.svg';
import dislike from '../../assets/svg/dislike.svg';
*/
import { getUserByID } from '../../util/getUser';

import { FaCheckCircle } from 'react-icons/fa';

interface PostsProps {
   postData: PostType;
}

interface TooltipProps {
   text: string;
   children: React.ReactNode;
}

const Posts: React.FC<PostsProps> = ({ postData }) => {
   const [valorantAgents, setValorantAgents] = useState<ValorantAgent['data']>(
      [],
   );
   const [user, setUser] = useState<UserType>();
   const navigate = useNavigate();
   const Auth = useContext(AuthContext);
   const user_Id = Auth?._id;

   useEffect(() => {
      axios
         .get('https://valorant-api.com/v1/agents?isPlayableCharacter=true')
         .then((response) => {
            setValorantAgents(response.data.data);
         });
      getUserByID(postData.UserID).then((response) => {
         setUser(response);
      });
   }, []);

   const valorantAgentIcon = valorantAgents.find(
      (agent) => agent.displayName === postData.valorantAgent,
   )?.displayIcon;

   const findAbilityIcon = (agentName: string, abilityName: string) => {
      const agent = valorantAgents.find(
         (agent) => agent.displayName === agentName,
      );
      const ability = agent?.abilities.find(
         (ability) => ability.displayName === abilityName,
      );
      return ability?.displayIcon;
   };

   const Tooltip = ({ text, children }: TooltipProps) => {
      const [showTooltip, setShowTooltip] = useState(false);

      return (
         <div className="relative flex items-center">
            <div
               onMouseEnter={() => setShowTooltip(true)}
               onMouseLeave={() => setShowTooltip(false)}
            >
               {children}
            </div>
            {showTooltip && (
               <div className="absolute top-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded-md z-10">
                  {text}
               </div>
            )}
         </div>
      );
   };

   const abilityIcon = findAbilityIcon(
      postData.valorantAgent,
      postData.ability,
   );

   const incrementViewCount = async () => {
      axios
         .post(`/post/${postData._id}/increment-view-count`, {
            userId: user_Id,
         })
         .then((response) => {
            console.error('Successfully incremented view count:', response);
         })
         .catch((error) => {
            console.error('Failed to increment view count:', error);
            // Handle error
         });
   };
   /*
   const incrementLikeCount = async () => {
      axios
         .post(`/post/${postData._id}/increment-like`, {
            userId: user_Id,
         })
         .then((response) => {
            console.log('Successfully incremented like count:', response);
         })
         .catch((error) => {
            console.error('Failed to increment like count:', error);
            // Handle error
         });
   };

   const incrementDislikeCount = async () => {
      axios
         .post(`/post/${postData._id}/increment-dislike`)
         .then((response) => {
            console.log('Successfully incremented dislike count:', response);
         })
         .catch((error) => {
            console.error('Failed to increment dislike count:', error);
            // Handle error
         });
   };
   */

   return (
      <>
         <div>
            <div className="relative">
               <img
                  className="w-full max-h-80 min-w-[250px] min-h-[150px] bg-gray-400 rounded-lg cursor-pointer"
                  src={`${CDN_URL}/${postData.landingPosition.public_id}`}
                  alt={postData.postTitle}
                  onClick={async () => {
                     await incrementViewCount();
                     navigate(`/game/${postData.game}/${postData.postTitle}`, {
                        state: { postData },
                     });
                  }}
               />
               <div className="">
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
                     <img
                        className="svg-icon absolute top-0 right-0 w-8 h-8 mt-[-32px] filter invert"
                        src={decoy}
                        alt="Decoy"
                        title="Decoy"
                     />
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
            </div>

            <div className="flex items-start mt-4">
               <Link to={`/user/${postData.Username}`}>
                  <img
                     src={user?.ProfilePicture}
                     className="mr-3 rounded-full w-9 h-9 bg-gray-400"
                  />
               </Link>
               <div className="flex flex-col">
                  <Link
                     className="text-lg font-bold m-0 no-underline"
                     to={`/game/${postData.game}/${postData.postTitle}`}
                  >
                     {postData.postTitle.length > 23
                        ? `${postData.postTitle.substring(0, 23)}...`
                        : postData.postTitle}
                  </Link>
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
      </>
   );
};

export default Posts;