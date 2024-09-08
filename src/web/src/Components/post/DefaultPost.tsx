import { PostType, UserType, ValorantAgent } from '../../global.types';
import { Tooltip } from '../../Components';
import { CDN_URL } from '../../Constants';
import axios from 'axios';
import { useState, useEffect } from 'react';
import decoy from '../../assets/svg/decoy.svg';
import smoke from '../../assets/svg/smoke.svg';
import molotov from '../../assets/svg/molotov.svg';
import he from '../../assets/svg/he.svg';
import flash from '../../assets/svg/flash.svg';
import { getUserByID } from '../../util/getUser';

interface PostsProps {
   postData: PostType;
}

const Posts: React.FC<PostsProps> = ({ postData }) => {
   const [valorantAgents, setValorantAgents] = useState<ValorantAgent['data']>(
      [],
   );
   const [user, setUser] = useState<UserType>();
   const [currentImage, setCurrentImage] = useState(0);
   const images = [
      `${postData.landingPosition.public_id}/f_auto,q_auto`,
      `${postData.standingPosition.public_id}/f_auto,q_auto`,
      `${postData.aimingPosition.public_id}/f_auto,q_auto`,
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

   return (
      <>
         <div>
            <div className="relative">
               <div style={{ paddingBottom: '56.25%', position: 'relative' }}>
                  <img
                     className="absolute top-0 left-0 w-full h-full object-cover bg-gray-400 rounded-lg cursor-pointer"
                     src={`${CDN_URL}/${postData.landingPosition.public_id}`}
                     alt={postData.postTitle}
                  />
               </div>
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
            </div>

            <div className="flex items-center mt-4">
               <img
                  src={user?.ProfilePicture}
                  className="mr-3 rounded-full w-9 h-9 bg-gray-400 mb-8"
               />

               <div className="flex flex-col flex-grow">
                  <div className="flex justify-between">
                     <p
                        className="text-lg font-bold m-0"
                        style={{ color: 'black' }}
                     >
                        {postData.postTitle.length > 23
                           ? `${postData.postTitle.substring(0, 23)}...`
                           : postData.postTitle}
                     </p>
                  </div>
               </div>
            </div>
         </div>
      </>
   );
};

export default Posts;
