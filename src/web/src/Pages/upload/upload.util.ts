import { toast } from 'react-toastify';
import { StateVariables } from './upload.types';
import { getUserByUsername } from '../../util/getUser';
import axios from 'axios';
import { AxiosError } from 'axios';

function isAxiosError(error: unknown): error is AxiosError {
   return (error as AxiosError).response !== undefined;
}

export const handleSubmit = async (
   e: React.FormEvent<HTMLFormElement>,
   params: {
      state: StateVariables;
      game: string;
      standingPosition: string;
      aimingPosition: string;
      landingPosition: string;
      username: string;
   },
) => {
   e.preventDefault();

   const {
      state,
      game,
      standingPosition,
      aimingPosition,
      landingPosition,
      username,
   } = params;

   if (!state.postName) toast.error('Post name is required.');
   else if (game === 'CS2' && !state.mapName)
      toast.error('Map name is required.');
   else if (game === 'CS2' && !state.grenadeType)
      toast.error('Grenade Type is required.');
   else if (game === 'Valorant' && !state.valorantAgent)
      toast.error('Valorant Agent is required.');
   else if (game === 'Valorant' && !state.ability)
      toast.error('Ability is required.');
   else if (!state.teamSide) toast.error('Team Side is required.');
   else if (!state.lineupDescription)
      toast.error('Line up description is required.');
   else if (!state.lineupLocation) toast.error('Line up location is required.');
   else if (!standingPosition)
      toast.error('Standing Position image is required.');
   else if (!aimingPosition) toast.error('Aiming Position image is required.');
   else if (!landingPosition)
      toast.error('Landing Position image is required.');

   const id = toast.loading('Uploading Post...');
   try {
      const user = await getUserByUsername(username, username);

      await axios.post('/post', {
         postName: state.postName,
         mapName: state.mapName,
         standingPosition,
         aimingPosition,
         landingPosition,
         grenadeType: state.grenadeType,
         jumpThrow: state.jumpThrow,
         game,
         user,
         lineupDescription: state.lineupDescription,
         lineupLocation: state.lineupLocation,
         teamSide: state.teamSide,
         valorantAgent: state.valorantAgent,
         ability: state.ability,
         lineupLocationCoords: state.lineupLocationCoords,
         lineupPositionCoords: state.lineupPositionCoords,
      });
      toast.update(id, {
         render:
            'Post Uploaded Successfully!. Your Lineup will be reviewed by our admins',
         type: 'success',
         isLoading: false,
         autoClose: 1000,
         hideProgressBar: false,
      });
   } catch (error) {
      let errorMessage = 'Post Failed to Upload...';
      if (
         isAxiosError(error) &&
         error.response &&
         error.response.status === 429
      ) {
         if (typeof error.response.data === 'string') {
            errorMessage = error.response.data;
         }
      }
      toast.update(id, {
         render: errorMessage,
         type: 'error',
         isLoading: false,
         autoClose: 1000,
         hideProgressBar: false,
      });
      console.log(error);
   }
};
