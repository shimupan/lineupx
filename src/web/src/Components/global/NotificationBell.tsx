import { useEffect, useState, useRef } from 'react';
import { Bell, BellRing } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
   timeAgo,
   joinNotificationRoom,
   onNotification,
   offNotification,
   type Notification,
} from '../post/helper';

const NotificationBell = ({ userId }: { userId: string }) => {
   const [notifications, setNotifications] = useState<Notification[]>([]);
   const [unreadCount, setUnreadCount] = useState(0);
   const [isOpen, setIsOpen] = useState(false);
   const dropdownRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
      // Join notification room on mount
      if (userId) {
         joinNotificationRoom(userId);
      }

      // Fetch initial notifications
      const fetchNotifications = async () => {
         try {
            const response = await axios.get(
               `/notifications/${userId}?limit=10`,
            );
            setNotifications(response.data.notifications);

            const unreadResponse = await axios.get(
               `/notifications/unread/${userId}`,
            );
            setUnreadCount(unreadResponse.data.unreadCount);
         } catch (error) {
            console.error('Error fetching notifications:', error);
         }
      };

      fetchNotifications();

      // Listen for new notifications
      onNotification((notification: Notification) => {
         setNotifications((prev) => [notification, ...prev]);
         setUnreadCount((prev) => prev + 1);
      });

      // Handle click outside
      const handleClickOutside = (event: MouseEvent) => {
         if (
            dropdownRef.current &&
            !dropdownRef.current.contains(event.target as Node)
         ) {
            setIsOpen(false);
         }
      };

      document.addEventListener('mousedown', handleClickOutside);

      return () => {
         offNotification();
         document.removeEventListener('mousedown', handleClickOutside);
      };
   }, [userId]);

   const handleMarkAsRead = async () => {
      try {
         const unreadNotifications = notifications
            .filter((n) => !n.read)
            .map((n) => n._id);
         if (unreadNotifications.length === 0) return;

         await axios.post('/notifications/read', {
            notificationIds: unreadNotifications,
         });

         setNotifications((prev) =>
            prev.map((notification) => ({
               ...notification,
               read: true,
            })),
         );
         setUnreadCount(0);
      } catch (error) {
         console.error('Error marking notifications as read:', error);
      }
   };

   const getNotificationLink = (notification: Notification) => {
      if (notification.type === 'comment' && notification.post) {
         return `/post/${notification.post._id}`;
      } else if (notification.type === 'follow') {
         return `/user/${notification.sender.username}`;
      }
      return '#';
   };

   return (
      <div className="relative" ref={dropdownRef}>
         <button
            onClick={() => {
               setIsOpen(!isOpen);
               if (!isOpen && unreadCount > 0) handleMarkAsRead();
            }}
            className="relative p-2 text-white hover:bg-gray-700 rounded-full"
         >
            {unreadCount > 0 ? (
               <BellRing className="h-6 w-6" />
            ) : (
               <Bell className="h-6 w-6" />
            )}
            {unreadCount > 0 && (
               <span className="absolute -top-1 -right-1 bg-red-500 text-xs text-white rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadCount}
               </span>
            )}
         </button>

         {isOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-[#212121] rounded-lg shadow-lg py-1 z-50 max-h-[80vh] overflow-y-auto">
               <div className="p-4 border-b border-gray-700">
                  <h3 className="text-lg font-semibold text-white">
                     Notifications
                  </h3>
               </div>

               {notifications.length > 0 ? (
                  notifications.map((notification) => (
                     <Link
                        key={notification._id}
                        to={getNotificationLink(notification)}
                        className="block"
                     >
                        <div
                           className={`p-4 border-b border-gray-700 hover:bg-gray-700 transition-colors
                    ${notification.read ? 'opacity-75' : 'opacity-100'}`}
                        >
                           <div className="flex items-start">
                              <img
                                 src={
                                    notification.sender.ProfilePicture ||
                                    `https://ui-avatars.com/api/?background=random&color=fff&name=${notification.sender.username}`
                                 }
                                 alt=""
                                 className="w-10 h-10 rounded-full mr-3"
                              />
                              <div>
                                 <p className="text-sm text-white">
                                    <span className="font-semibold">
                                       {notification.sender.username}
                                    </span>{' '}
                                    {notification.message}
                                 </p>
                                 <p className="text-xs text-gray-400 mt-1">
                                    {timeAgo(notification.createdAt)}
                                 </p>
                              </div>
                           </div>
                        </div>
                     </Link>
                  ))
               ) : (
                  <div className="p-4 text-center text-gray-400">
                     No notifications yet
                  </div>
               )}
            </div>
         )}
      </div>
   );
};

export default NotificationBell;
