import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaTrophy, FaMedal } from 'react-icons/fa';

interface LeaderboardPosition {
   position: number;
   username: string;
   ProfilePicture: string;
   totalPosts: number;
}

const UserLeaderboardPosition: React.FC<{ userId: string }> = ({ userId }) => {
   const [positionData, setPositionData] = useState<LeaderboardPosition | null>(
      null,
   );
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);

   useEffect(() => {
      const fetchLeaderboardPosition = async () => {
         try {
            const response = await axios.get(`/leaderboard/position/${userId}`);
            setPositionData(response.data);
            setLoading(false);
         } catch (err) {
            setError('Error fetching leaderboard position');
            setLoading(false);
         }
      };

      fetchLeaderboardPosition();
   }, [userId]);

   if (loading || error || !positionData) return null;

   const getMedal = () => {
      switch (positionData.position) {
         case 1:
            return <FaTrophy className="text-yellow-500 text-2xl mr-2" />;
         case 2:
            return <FaMedal className="text-gray-400 text-2xl mr-2" />;
         case 3:
            return <FaMedal className="text-yellow-600 text-2xl mr-2" />;
         default:
            return null;
      }
   };

   return (
      <div className="relative flex items-center ml-4">
         {getMedal()}
         {positionData.position <= 3 && (
            <span className="text-lg font-bold">#{positionData.position}</span>
         )}
         <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-max bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 transition-opacity duration-300 pointer-events-none group-hover:opacity-100">
            {positionData.username} - {positionData.totalPosts} posts
         </div>
      </div>
   );
};

export default UserLeaderboardPosition;
