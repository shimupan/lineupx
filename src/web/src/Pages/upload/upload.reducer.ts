import { StateVariables, StateActions } from './upload.types';

export function reducer(
   state: StateVariables,
   action: StateActions,
): StateVariables {
   switch (action.type) {
      case 'setPostName':
         return { ...state, postName: action.payload };
      case 'setMapName':
         return { ...state, mapName: action.payload };
      case 'setGrenadeType':
         return { ...state, grenadeType: action.payload };
      case 'setJumpThrow':
         return { ...state, jumpThrow: action.payload };
      case 'setValorantAgent':
         return { ...state, valorantAgent: action.payload };
      case 'setAbility':
         return { ...state, ability: action.payload };
      case 'setLineupLocation':
         return { ...state, lineupLocation: action.payload };
      case 'setLineupDescription':
         return { ...state, lineupDescription: action.payload };
      case 'setTeamSide':
         return { ...state, teamSide: action.payload };
      case 'setAgents':
         return { ...state, agents: action.payload };
      case 'setSelectedAgentAbilities':
         return { ...state, selectedAgentAbilities: action.payload };
      default:
         return state;
   }
}

export const UploadDefaults = {
   postName: '',
   mapName: '',
   grenadeType: '',
   jumpThrow: '',
   valorantAgent: '',
   ability: '',
   lineupLocation: '',
   lineupDescription: '',
   teamSide: '',
   agents: undefined,
   selectedAgentAbilities: [],
};