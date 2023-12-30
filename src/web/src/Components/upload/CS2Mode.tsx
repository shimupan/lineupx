import { StateVariables, StateActions } from '../../Pages/upload/upload.types';

type CS2ModeProps = {
   state: StateVariables;
   dispatch: React.Dispatch<StateActions>;
};

const CS2Mode: React.FC<CS2ModeProps> = ({ state, dispatch }) => {
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
   );
};

export default CS2Mode;
