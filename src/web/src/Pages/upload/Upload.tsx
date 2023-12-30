import React, { useReducer, useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { Dropzone } from '../../Components';
import { Header, SideNavWrapper, AgentSelector } from '../../Components';
import { AuthContext } from '../../App';
import { ToastContainer } from 'react-toastify';
import { reducer, UploadDefaults } from './upload.reducer';
import { handleSubmit } from './upload.util';
import axios from 'axios';

const Upload: React.FC = () => {
   // TODO: ADD Agents and Agent specific stuff if the game is valorant
   // Future state variables will go in the reducer
   const [state, dispatch] = useReducer(reducer, UploadDefaults);
   // Images are outside since they are used as props
   const [standingPosition, setStandingPosition] = useState<string>('');
   const [aimingPosition, setAimingPosition] = useState<string>('');
   const [landingPosition, setLandingPosition] = useState<string>('');

   // This part checks for the game that was passed in from the previous page
   // Dont change this part
   const { state: locationState } = useLocation();
   const game = locationState.game.substring(6);

   const Auth = useContext(AuthContext);
   const verified = Auth?.Verified;

   useEffect(() => {
      axios
         .get('https://valorant-api.com/v1/agents?isPlayableCharacter=true')
         .then((response) => {
            dispatch({ type: 'setAgents', payload: response.data });
         });
   }, []);

   if (!verified) {
      return (
         <>
            <Header />
            <SideNavWrapper />

            <div className="flex items-center justify-center h-screen">
               <div className="px-4 py-6 text-center border border-gray-300 rounded-lg shadow-lg bg-white">
                  <svg
                     xmlns="http://www.w3.org/2000/svg"
                     className="w-16 h-16 mx-auto mb-4 text-blue-600"
                     fill="none"
                     viewBox="0 0 24 24"
                     stroke="currentColor"
                  >
                     <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h1m0 0h-1m1 0a1 1 0 011 1v3m-4-7h4m-4 0H9m4 0V9"
                     />
                  </svg>
                  <h3 className="mb-2 text-xl font-semibold text-gray-800">
                     Email Verification Required
                  </h3>
                  <p className="text-gray-600">
                     You need to verify your email before you can upload. Check
                     your spam folder if you cannot find it.
                  </p>
               </div>
            </div>
         </>
      );
   }

   return (
      <>
         <Header />

         <SideNavWrapper />

         <div className="min-h-screen md:h-full md:w-1/2 lg:w-1/3 container flex flex-col mx-auto bg-white rounded-lg md:pt-12 md:my-5 md:p-10 lg:p-0">
            <div className="flex justify-center w-full h-full my-auto xl:gap-14 lg:justify-normal md:gap-5 draggable">
               <div className="flex items-center justify-center w-full lg:p-12">
                  <div className="flex items-center xl:p-10">
                     <form
                        className="flex flex-col w-full h-full pb-6 text-center bg-white rounded-3xl"
                        onSubmit={(e) => {
                           handleSubmit(e, {
                              state: state,
                              game: game,
                              standingPosition: standingPosition,
                              aimingPosition: aimingPosition,
                              landingPosition: landingPosition,
                              username: Auth?.username,
                           });
                        }}
                     >
                        <h3 className="mb-3 text-4xl font-extrabold text-blue-900">
                           Upload a New Post
                        </h3>
                        <label
                           htmlFor="postName"
                           className="mb-2 text-sm text-start text-gray-900"
                        >
                           Post Name*
                        </label>
                        <input
                           id="postName"
                           type="postName"
                           placeholder="Enter a post name (please be descriptive)"
                           value={state.postName}
                           onChange={(e) =>
                              dispatch({
                                 type: 'setPostName',
                                 payload: e.target.value,
                              })
                           }
                           className="flex text-black items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-grey-400 mb-7 placeholder:text-grey-700 bg-[#edf2f7] text-dark-grey-900 rounded-2xl"
                        />
                        <label
                           htmlFor="mapName"
                           className="mb-2 text-sm text-start text-gray-900"
                        >
                           Map Name*
                        </label>
                        {game === 'CS2' && (
                           <>
                              <select
                                 id="mapName"
                                 value={state.mapName}
                                 onChange={(e) =>
                                    dispatch({
                                       type: 'setMapName',
                                       payload: e.target.value,
                                    })
                                 }
                                 className="flex text-black items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-grey-400 mb-7 placeholder:text-grey-700 bg-[#edf2f7] text-dark-grey-900 rounded-2xl"
                              >
                                 <option value="">--</option>
                                 <option value="mirage">Mirage</option>
                                 <option value="dust2">Dust 2</option>
                                 <option value="vertigo">Vertigo</option>
                                 <option value="nuke">Nuke</option>
                                 <option value="inferno">Inferno</option>
                                 <option value="overpass">Overpass</option>
                                 <option value="anubis">Anubis</option>
                                 <option value="ancient">Ancient</option>
                              </select>

                              <label
                                 htmlFor="grenadeType"
                                 className="mb-2 text-sm text-start text-gray-900"
                              >
                                 Grenade Type*
                              </label>
                              <select
                                 id="grenadeType"
                                 value={state.grenadeType}
                                 onChange={(e) =>
                                    dispatch({
                                       type: 'setGrenadeType',
                                       payload: e.target.value,
                                    })
                                 }
                                 className="flex text-black items-center w-full px-5
                                    py-4 mb-5 mr-2 text-sm font-medium outline-none
                                    focus:bg-grey-400 placeholder:text-grey-700
                                    bg-[#edf2f7] text-dark-grey-900 rounded-2xl"
                              >
                                 <option value="">--</option>
                                 <option value="smoke">Smoke</option>
                                 <option value="flash">Flash</option>
                                 <option value="molotov">Molotov</option>
                                 <option value="shock">Decoy</option>
                                 <option value="he">HE</option>
                              </select>
                              <label
                                 htmlFor="grenadeType"
                                 className="mb-2 text-sm text-start text-gray-900"
                              >
                                 Team Side*
                              </label>
                              <select
                                 id="teamSide"
                                 value={state.teamSide}
                                 onChange={(e) =>
                                    dispatch({
                                       type: 'setTeamSide',
                                       payload: e.target.value,
                                    })
                                 }
                                 className="flex text-black items-center w-full px-5
                                    py-4 mb-5 mr-2 text-sm font-medium outline-none
                                    focus:bg-grey-400 placeholder:text-grey-700
                                    bg-[#edf2f7] text-dark-grey-900 rounded-2xl"
                              >
                                 <option value="">--</option>
                                 <option value="CT">Counter Terrorist</option>
                                 <option value="T">Terrorist</option>
                              </select>
                           </>
                        )}
                        {game === 'Valorant' && (
                           <>
                              <select
                                 id="mapName"
                                 value={state.mapName}
                                 onChange={(e) =>
                                    dispatch({
                                       type: 'setMapName',
                                       payload: e.target.value,
                                    })
                                 }
                                 className="flex text-black items-center w-full px-5 py-4 mb-5 mr-2 text-sm font-medium outline-none focus:bg-grey-400 placeholder:text-grey-700 bg-[#edf2f7] text-dark-grey-900 rounded-2xl"
                              >
                                 <option value="">--</option>
                                 <option value="bind">Bind</option>
                                 <option value="haven">Haven</option>
                                 <option value="split">Split</option>
                                 <option value="icebox">Icebox</option>
                                 <option value="ascent">Ascent</option>
                                 <option value="breeze">Breeze</option>
                                 <option value="fracture">Fracture</option>
                                 <option value="pearl">Pearl</option>
                                 <option value="lotus">Lotus</option>
                                 <option value="sunset">Sunset</option>
                              </select>

                              <label
                                 htmlFor="grenadeType"
                                 className="mb-2 text-sm text-start text-gray-900"
                              >
                                 Agent*
                              </label>
                              <AgentSelector
                                 agents={state.agents?.data}
                                 onSelectAgent={(selectedAgent) => {
                                    dispatch({
                                       type: 'setValorantAgent',
                                       payload: selectedAgent.displayName,
                                    });
                                    dispatch({
                                       type: 'setSelectedAgentAbilities',
                                       payload: selectedAgent.abilities.map(
                                          (ability) => ability.displayName,
                                       ),
                                    });
                                 }}
                              />

                              <label
                                 htmlFor="agentAbility"
                                 className="mb-2 text-sm text-start text-gray-900"
                              >
                                 Agent Ability*
                              </label>
                              <select
                                 id="ability"
                                 value={state.ability}
                                 onChange={(e) =>
                                    dispatch({
                                       type: 'setAbility',
                                       payload: e.target.value,
                                    })
                                 }
                                 className={`flex text-black items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-grey-400 mb-7 placeholder:text-grey-700 bg-[#edf2f7] text-dark-grey-900 rounded-2xl ${
                                    state.selectedAgentAbilities.length === 0
                                       ? 'opacity-50 cursor-not-allowed'
                                       : ''
                                 }`}
                                 disabled={
                                    state.selectedAgentAbilities.length === 0
                                 }
                              >
                                 <option value="">--</option>
                                 {state.selectedAgentAbilities.map(
                                    (ability, index) => (
                                       <option key={index} value={ability}>
                                          {ability}
                                       </option>
                                    ),
                                 )}
                              </select>

                              <label
                                 htmlFor="grenadeType"
                                 className="mb-2 text-sm text-start text-gray-900"
                              >
                                 Team Side*
                              </label>
                              <select
                                 id="teamSide"
                                 value={state.teamSide}
                                 onChange={(e) =>
                                    dispatch({
                                       type: 'setTeamSide',
                                       payload: e.target.value,
                                    })
                                 }
                                 className="flex text-black items-center w-full px-5
                                    py-4 mb-5 mr-2 text-sm font-medium outline-none
                                    focus:bg-grey-400 placeholder:text-grey-700
                                    bg-[#edf2f7] text-dark-grey-900 rounded-2xl"
                              >
                                 <option value="">--</option>
                                 <option value="Defender">Defender</option>
                                 <option value="Attacker">Attacker</option>
                              </select>
                           </>
                        )}
                        <label
                           htmlFor="jumpThrow"
                           className="mb-2 text-sm text-start text-gray-900"
                        >
                           Is this a jump throw?
                        </label>
                        <select
                           id="jumpThrow"
                           placeholder="Enter a map name"
                           value={state.jumpThrow}
                           onChange={(e) =>
                              dispatch({
                                 type: 'setJumpThrow',
                                 payload: e.target.value,
                              })
                           }
                           className="flex text-black items-center w-full px-5
                           py-4 mb-5 mr-2 text-sm font-medium outline-none
                           focus:bg-grey-400 placeholder:text-grey-700
                           bg-[#edf2f7] text-dark-grey-900 rounded-2xl"
                        >
                           <option value="">--</option>
                           <option value="yes">Yes</option>
                           <option value="no">No</option>
                        </select>
                        <label
                           htmlFor="lineupDescription"
                           className="mb-2 text-sm text-start text-gray-900"
                        >
                           Lineup Description*
                        </label>
                        <textarea
                           id="lineupDescription"
                           placeholder="Enter the description of the lineup"
                           value={state.lineupDescription}
                           onChange={(e) =>
                              dispatch({
                                 type: 'setLineupDescription',
                                 payload: e.target.value,
                              })
                           }
                           className="flex text-black items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-grey-400 mb-7 placeholder:text-grey-700 bg-[#edf2f7] text-dark-grey-900 rounded-2xl"
                        />
                        <label
                           htmlFor="lineupLocation"
                           className="mb-2 text-sm text-start text-gray-900"
                        >
                           Lineup Location*
                        </label>
                        <input
                           id="lineupLocation"
                           type="lineupLocation"
                           placeholder="Enter the location of the lineup"
                           value={state.lineupLocation}
                           onChange={(e) =>
                              dispatch({
                                 type: 'setLineupLocation',
                                 payload: e.target.value,
                              })
                           }
                           className="flex text-black items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-grey-400 mb-7 placeholder:text-grey-700 bg-[#edf2f7] text-dark-grey-900 rounded-2xl"
                        />
                        <label
                           htmlFor="jumpThrow"
                           className="mb-2 text-sm text-start text-gray-900"
                        >
                           Upload the Grenade Landing Position
                        </label>
                        <Dropzone setFile={setLandingPosition} />
                        <label
                           htmlFor="jumpThrow"
                           className="mb-2 text-sm text-start text-gray-900"
                        >
                           Upload the Grenade Standing Position
                        </label>
                        <Dropzone setFile={setStandingPosition} />
                        <label
                           htmlFor="jumpThrow"
                           className="mb-2 text-sm text-start text-gray-900"
                        >
                           Upload the Grenade Aiming Position
                        </label>
                        <Dropzone setFile={setAimingPosition} />
                        <button
                           type="submit"
                           className="w-full px-6 py-5 mb-5 mt-5 text-sm font-bold leading-none text-white transition duration-300 rounded-2xl hover:bg-purple-blue-600 focus:ring-4 focus:ring-purple-blue-100 bg-blue-900"
                        >
                           Upload
                        </button>
                     </form>
                  </div>
               </div>
            </div>
         </div>
         <ToastContainer position="top-center" />
      </>
   );
};

export default Upload;