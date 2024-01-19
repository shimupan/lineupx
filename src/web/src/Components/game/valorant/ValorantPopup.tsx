import { useNavigate } from 'react-router-dom';

type ValorantPopupProps = {
   setOpen: React.Dispatch<React.SetStateAction<boolean>>;
   setValue: React.Dispatch<React.SetStateAction<boolean>>;
};

const ValorantPopup: React.FC<ValorantPopupProps> = ({ setOpen, setValue }) => {
   const navigate = useNavigate();
   return (
      <div
         className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 text-black"
         onClick={() => {
            setOpen(!open);
            setValue(false);
         }}
      >
         <div
            className="bg-white p-6 rounded-lg text-center w-full sm:w-3/4 md:w-1/2 lg:w-1/3 xl:w-1/4"
            onClick={(event) => event.stopPropagation()}
         >
            <div className="border-b border-gray-500 text-4xl">
               Welcome to Valorant
            </div>
            <div className="break-words">
               Would you like to select an agent and map to filter the posts
               available?
            </div>
            <div className="flex justify-center">
               <button
                  className="py-1.5 px-3 m-1 text-center bg-red-700 border rounded-md text-white  hover:bg-red-500 hover:text-gray-100 dark:text-gray-200 dark:bg-red-700"
                  type="submit"
                  onClick={() => {
                     setOpen(!open);
                     setValue(false);
                  }}
               >
                  Nah, Imma do my own thing
               </button>
               <button
                  className="py-1.5 px-3 m-1 text-center bg-green-700 border rounded-md text-white  hover:bg-green-500 hover:text-gray-100 dark:text-gray-200 dark:bg-green-700"
                  type="submit"
                  onClick={() => {
                     navigate('/game/Valorant/Agents');
                     setValue(false);
                  }}
               >
                  Pick an Agent
               </button>
            </div>
         </div>
      </div>
   );
};

export default ValorantPopup;
