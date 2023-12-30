import { ValorantAgent } from '../../global.types';

export type StateVariables = {
   postName: string;
   mapName: string;
   grenadeType: string;
   jumpThrow: string;
   valorantAgent: string;
   ability: string;
   lineupLocation: string;
   lineupDescription: string;
   teamSide: string;
   agents: ValorantAgent | undefined;
   selectedAgentAbilities: string[];
};

export type StateActions =
   | { type: 'setPostName'; payload: string }
   | { type: 'setMapName'; payload: string }
   | { type: 'setGrenadeType'; payload: string }
   | { type: 'setJumpThrow'; payload: string }
   | { type: 'setValorantAgent'; payload: string }
   | { type: 'setAbility'; payload: string }
   | { type: 'setLineupLocation'; payload: string }
   | { type: 'setLineupDescription'; payload: string }
   | { type: 'setTeamSide'; payload: string }
   | { type: 'setAgents'; payload: ValorantAgent | undefined }
   | { type: 'setSelectedAgentAbilities'; payload: string[] };
