import React from 'react';
import { StateVariables, StateActions } from '../../Pages/upload/upload.types';
import { AgentSelector } from '../../Components';

type ValorantModeProps = {
   state: StateVariables;
   dispatch: React.Dispatch<StateActions>;
};

const ValorantMode: React.FC<ValorantModeProps> = ({ state, dispatch }) => {
   return (
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
            disabled={state.selectedAgentAbilities.length === 0}
         >
            <option value="">--</option>
            {state.selectedAgentAbilities.map((ability, index) => (
               <option key={index} value={ability}>
                  {ability}
               </option>
            ))}
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
   );
};

export default ValorantMode;
