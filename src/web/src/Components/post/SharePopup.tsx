import { FaFacebook, FaLinkedin, FaWhatsapp, FaEnvelope } from 'react-icons/fa';
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
         <div className="bg-white rounded-lg shadow-lg p-6 w-96 relative">
            <button
               className="absolute top-2 right-2 text-gray-600 hover:text-black"
               onClick={onClose}
            >
               &times;
            </button>
            <h2 className="text-lg font-semibold mb-4">Share in a post</h2>
            <div className="mb-4 text-gray-500 text-sm">725 subscribers</div>
            <div className="flex items-center justify-between mb-4">
               <div className="flex items-center gap-3">
                  <IoMdShareAlt className="text-2xl text-gray-700" />
                  <span className="text-md font-medium">Share</span>
               </div>
               <div className="flex items-center gap-4">
                  <a
                     href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                     target="_blank"
                     rel="noopener noreferrer"
                  >
                     <FaFacebook className="text-xl text-gray-700 hover:text-blue-600" />
                  </a>
                  <a
                     href={`https://twitter.com/intent/tweet?url=${shareUrl}`}
                     target="_blank"
                     rel="noopener noreferrer"
                  >
                     <FaXTwitter className="text-xl text-gray-700 hover:text-blue-400" />
                  </a>
                  <a
                     href={`https://wa.me/?text=${shareUrl}`}
                     target="_blank"
                     rel="noopener noreferrer"
                  >
                     <FaWhatsapp className="text-xl text-gray-700 hover:text-green-500" />
                  </a>
                  <a
                     href={`https://www.linkedin.com/shareArticle?url=${shareUrl}`}
                     target="_blank"
                     rel="noopener noreferrer"
                  >
                     <FaLinkedin className="text-xl text-gray-700 hover:text-blue-700" />
                  </a>
                  <a
                     href={`mailto:?subject=Check this out&body=${shareUrl}`}
                     target="_blank"
                     rel="noopener noreferrer"
                  >
                     <FaEnvelope className="text-xl text-gray-700 hover:text-gray-500" />
                  </a>
               </div>
            </div>
            <div className="border-t border-gray-300 pt-4 flex items-center justify-between">
               <input
                  type="text"
                  value={shareUrl}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
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
   );
};

export default SharePopup;
