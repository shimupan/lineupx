import { useState, useContext } from 'react';
import { Dropzone } from '../Components';
import { Header, SideNavWrapper } from '../Components';
import { AuthContext } from '../App';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import axios from 'axios';

const Upload: React.FC = () => {
   const [postName, setPostName] = useState<string>('');
   const [mapName, setMapName] = useState<string>('');
   const [grenadeType, setGrenadeType] = useState<string>('');
   const [jumpThrow, setJumpThrow] = useState<string>('');
   const [standingPosition, setStandingPosition] = useState<string>('');
   const [aimingPosition, setAimingPosition] = useState<string>('');
   const [landingPosition, setLandingPosition] = useState<string>('');

   const Auth = useContext(AuthContext);
   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const id = toast.loading('Uploading Post...');
      try {
         const user = await (async () => {
            try {
               const response = await axios.get(`/user/${Auth?.username}`);
               return response.data;
            } catch (error) {
               return error;
            }
         })();
         await axios.post('/post', {
            postName,
            mapName,
            standingPosition,
            aimingPosition,
            landingPosition,
            grenadeType,
            jumpThrow,
            user,
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

   return (
      <>
         <Header />

         <SideNavWrapper />

         <div className="h-screen md:h-full md:w-1/2 lg:w-1/3 container flex flex-col mx-auto bg-white rounded-lg md:pt-12 md:my-5 md:p-10 lg:p-0">
            <div className="flex justify-center w-full h-full my-auto xl:gap-14 lg:justify-normal md:gap-5 draggable">
               <div className="flex items-center justify-center w-full lg:p-12">
                  <div className="flex items-center xl:p-10">
                     <form
                        className="flex flex-col w-full h-full pb-6 text-center bg-white rounded-3xl"
                        onSubmit={handleSubmit}
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
                           value={postName}
                           onChange={(e) => setPostName(e.target.value)}
                           className="flex text-black items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-grey-400 mb-7 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl"
                        />
                        <label
                           htmlFor="mapName"
                           className="mb-2 text-sm text-start text-gray-900"
                        >
                           Map Name*
                        </label>
                        <input
                           id="mapName"
                           type="mapName"
                           placeholder="Enter a map name"
                           value={mapName}
                           onChange={(e) => setMapName(e.target.value)}
                           className="flex text-black items-center w-full px-5 py-4 mb-5 mr-2 text-sm font-medium outline-none focus:bg-grey-400 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl"
                        />
                        <label
                           htmlFor="grenadeType"
                           className="mb-2 text-sm text-start text-gray-900"
                        >
                           Grenade Type*
                        </label>
                        <select
                           id="grenadeType"
                           value={grenadeType}
                           onChange={(e) => setGrenadeType(e.target.value)}
                           className="flex text-black items-center w-full px-5
                           py-4 mb-5 mr-2 text-sm font-medium outline-none
                           focus:bg-grey-400 placeholder:text-grey-700
                           bg-grey-200 text-dark-grey-900 rounded-2xl"
                        >
                           <option value="">--</option>
                           <option value="smoke">Smoke</option>
                           <option value="flash">Flash</option>
                           <option value="molotov">Molotov</option>
                           <option value="shock">Decoy</option>
                           <option value="he">HE</option>
                        </select>
                        <label
                           htmlFor="jumpThrow"
                           className="mb-2 text-sm text-start text-gray-900"
                        >
                           Is this a jump throw?
                        </label>
                        <select
                           id="jumpThrow"
                           placeholder="Enter a map name"
                           value={jumpThrow}
                           onChange={(e) => setJumpThrow(e.target.value)}
                           className="flex text-black items-center w-full px-5
                           py-4 mb-5 mr-2 text-sm font-medium outline-none
                           focus:bg-grey-400 placeholder:text-grey-700
                           bg-grey-200 text-dark-grey-900 rounded-2xl"
                        >
                           <option value="">--</option>
                           <option value="yes">Yes</option>
                           <option value="no">No</option>
                        </select>
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
