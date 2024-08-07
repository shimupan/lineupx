import { FaFacebook, FaWhatsapp, FaEnvelope, FaReddit } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { IoMdShareAlt } from 'react-icons/io';

const SharePopup = ({
   shareUrl,
   isOpen,
   onClose,
}: {
   shareUrl: string;
   isOpen: boolean;
   onClose: () => void;
}) => {
   if (!isOpen) return null;

   return (
      <div className="fixed inset-0 flex items-center justify-center z-10 bg-black bg-opacity-50">
         <div className="bg-[#212121] text-white rounded-lg shadow-lg p-6 w-[32rem] relative">
            <button
               className="absolute top-2 right-2 text-gray-400 hover:text-white text-2xl"
               onClick={onClose}
            >
               &times;
            </button>
            <div className="flex flex-col items-center">
               <div className="flex items-center gap-3 mb-6">
                  <IoMdShareAlt className="text-3xl text-white" />
                  <span className="text-lg font-medium">Share</span>
               </div>
               <div className="flex justify-between gap-6 mb-6">
                  <a
                     href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                     target="_blank"
                     rel="noopener noreferrer"
                  >
                     <FaFacebook className="text-3xl text-white hover:text-blue-600" />
                  </a>
                  <a
                     href={`https://twitter.com/intent/tweet?url=${shareUrl}`}
                     target="_blank"
                     rel="noopener noreferrer"
                  >
                     <FaXTwitter className="text-3xl text-white hover:text-blue-400" />
                  </a>
                  <a
                     href={`https://wa.me/?text=${shareUrl}`}
                     target="_blank"
                     rel="noopener noreferrer"
                  >
                     <FaWhatsapp className="text-3xl text-white hover:text-green-500" />
                  </a>
                  <a
                     href={`https://www.reddit.com/submit?url=${shareUrl}`}
                     target="_blank"
                     rel="noopener noreferrer"
                  >
                     <FaReddit className="text-3xl text-white hover:text-orange-500" />
                  </a>
                  <a
                     href={`mailto:?subject=Check this out&body=${shareUrl}`}
                     target="_blank"
                     rel="noopener noreferrer"
                  >
                     <FaEnvelope className="text-3xl text-white hover:text-gray-500" />
                  </a>
               </div>
               <div className="flex items-center w-full">
                  <input
                     type="text"
                     value={shareUrl}
                     readOnly
                     className="flex-grow px-3 py-2 border border-gray-600 rounded-lg text-sm bg-[#333] text-white"
                  />
                  <button
                     onClick={() => {
                        navigator.clipboard.writeText(shareUrl);
                        alert('Link copied to clipboard!');
                     }}
                     className="ml-2 px-3 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600"
                  >
                     Copy
                  </button>
               </div>
            </div>
         </div>
      </div>
   );
};

export default SharePopup;
