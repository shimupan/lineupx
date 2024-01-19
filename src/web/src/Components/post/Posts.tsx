import { useNavigate } from 'react-router-dom';
import { PostType, ValorantAgent } from '../../global.types';
import { CDN_URL } from '../../Constants';
import axios from 'axios';
import { useState, useEffect } from 'react';

import decoy from '../../assets/svg/decoy.svg';
import smoke from '../../assets/svg/smoke.svg';
import molotov from '../../assets/svg/molotov.svg';
import he from '../../assets/svg/he.svg';
import flash from '../../assets/svg/flash.svg';
import views from '../../assets/svg/views.svg';
import like from '../../assets/svg/like.svg';
import dislike from '../../assets/svg/dislike.svg';

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
   const navigate = useNavigate();

   useEffect(() => {
      axios
         .get('https://valorant-api.com/v1/agents?isPlayableCharacter=true')
         .then((response) => {
            setValorantAgents(response.data.data);
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
         .post(`/post/${postData._id}/increment-view-count`)
         .then((response) => {
            console.error('Successfully incremented view count:', response);
         })
         .catch((error) => {
            console.error('Failed to increment view count:', error);
            // Handle error
         });
   };

   return (
      <>
         <div className="max-w-full my-5 p-4 border rounded-lg shadow-sm bg-white overflow-hidden">
            <div className="text-center text-sm text-gray-600">
               By: {postData.Username}
            </div>

            <div className="svg-container relative text-sm text-gray-600">
               {postData.game === 'Valorant' ? (
                  <>
                     <Tooltip text={postData.ability}>
                        <img
                           className="svg-icon absolute top-0 w-4 h-4 mt-[-25px] object-contain"
                           style={{ right: '20px', filter: 'brightness(0)' }}
                           src={abilityIcon}
                           alt={postData.ability}
                        />
                     </Tooltip>
                     <Tooltip text={postData.valorantAgent}>
                        <img
                           className="svg-icon absolute top-0 right-0 w-4 h-4 mt-[-25px]"
                           src={valorantAgentIcon}
                           alt={postData.valorantAgent}
                        />
                     </Tooltip>
                  </>
               ) : postData.grenadeType === 'flash' ? (
                  <Tooltip text="Flash">
                     <img
                        className="svg-icon absolute top-0 right-0 w-4 h-4 mt-[-25px]"
                        src={flash}
                        alt="Flash"
                     />
                  </Tooltip>
               ) : postData.grenadeType === 'smoke' ? (
                  <Tooltip text="Smoke">
                     <img
                        className="svg-icon absolute top-0 right-0 w-4 h-4 mt-[-25px]"
                        src={smoke}
                        alt="Smoke"
                        title="Smoke"
                     />
                  </Tooltip>
               ) : postData.grenadeType === 'molotov' ? (
                  <Tooltip text="Molotov">
                     <img
                        className="svg-icon absolute top-0 right-0 w-4 h-4 mt-[-25px]"
                        src={molotov}
                        alt="Molotov"
                        title="Molotov"
                     />
                  </Tooltip>
               ) : postData.grenadeType === 'shock' ? (
                  <Tooltip text="Decoy">
                     <img
                        className="svg-icon absolute top-0 right-0 w-4 h-4 mt-[-25px]"
                        src={decoy}
                        alt="Decoy"
                        title="Decoy"
                     />
                  </Tooltip>
               ) : postData.grenadeType === 'he' ? (
                  <Tooltip text="HE">
                     <img
                        className="svg-icon absolute top-0 right-0 w-4 h-4 mt-[-25px]"
                        src={he}
                        alt="HE"
                        title="HE"
                     />
                  </Tooltip>
               ) : (
                  'Unknown'
               )}
            </div>
            <div className="post-container w-80 h-48 relative overflow-hidden">
               <img
                  className="w-full h-full object-cover cursor-pointer"
                  src={`${CDN_URL}/${postData.landingPosition.public_id}`}
                  alt={postData.postTitle}
                  onClick={async () => {
                     await incrementViewCount();
                     navigate(`/game/${postData.game}/${postData.postTitle}`, {
                        state: { postData },
                     });
                  }}
               />
            </div>
            <div className="text-center mt-3">
               <div className="text-lg font-bold text-gray-800">
                  {postData.postTitle}
               </div>
               <div className="mt-2 text-sm text-gray-600 flex justify-between">
                  <div className="flex items-center">
                     <Tooltip text={postData.views.toString()}>
                        <img
                           className="svg-icon w-4 h-4 mr-2"
                           src={views}
                           alt="Views"
                        />
                     </Tooltip>
                     : {postData.views}
                  </div>
                  <div className="flex items-center">
                     <Tooltip text={postData.likes.toString()}>
                        <img
                           className="svg-icon w-4 h-4 mr-2"
                           src={like}
                           alt="Likes"
                        />
                     </Tooltip>
                     : {postData.likes}
                  </div>
                  <div className="flex items-center">
                     <Tooltip text={postData.dislikes.toString()}>
                        <img
                           className="svg-icon w-4 h-4 mr-2"
                           src={dislike}
                           alt="Dislikes"
                        />
                     </Tooltip>
                     : {postData.dislikes}
                  </div>
               </div>
            </div>
         </div>
      </>
   );
};

export default Posts;
