import { toast } from 'react-toastify';
import { StateVariables } from './upload.types';
import { getUserByUsername } from '../../util/getUser';
import axios from 'axios';

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
      const user = await getUserByUsername(username);

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
      });
      toast.update(id, {
         render: 'Post Uploaded Successfully!',
         type: 'success',
         isLoading: false,
         autoClose: 1000,
         hideProgressBar: false,
      });
   } catch (error) {
      toast.update(id, {
         render: 'Post Failed to Upload...',
         type: 'error',
         isLoading: false,
         autoClose: 1000,
         hideProgressBar: false,
      });
      console.log(error);
   }
};
