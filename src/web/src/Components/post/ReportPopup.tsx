import React, { useState } from 'react';
import axios from 'axios';

interface ReportPopupProps {
   postId: string;
   userId: string;
   onClose: () => void;
}

const ReportPopup: React.FC<ReportPopupProps> = ({
   postId,
   userId,
   onClose,
}) => {
   const [reason, setReason] = useState('');

   const handleReportSubmit = async () => {
      try {
         axios.post('/post/report', {
            postId,
            userId,
            reason,
         });
         alert('Report submitted successfully');
         onClose();
      } catch (error) {
         console.error('Error reporting post:', error);
         alert('Failed to submit report');
      }
   };

   return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
         <div className="bg-[#181818] rounded-lg shadow-lg w-96">
            <div className="p-6">
               <h2 className="text-2xl font-bold mb-4">Report Post</h2>
               <textarea
                  className="w-full h-32 p-2 border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter the reason for reporting"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
               ></textarea>
            </div>
            <div className="bg-gray-100 px-6 py-4 flex justify-end rounded-b-lg">
               <button
                  className="px-4 py-2 mr-2 text-gray-600 hover:text-gray-800 focus:outline-none"
                  onClick={onClose}
               >
                  Cancel
               </button>
               <button
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none"
                  onClick={handleReportSubmit}
               >
                  Submit
               </button>
            </div>
         </div>
      </div>
   );
};

export default ReportPopup;