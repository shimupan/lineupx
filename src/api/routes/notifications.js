// notifications.js
import express from 'express';
import Notification from '../model/notification.js';

const router = express.Router();



// Create notification helper function
const createNotification = async (params) => {
    const {
        recipientId,
        senderId,
        type,
        postId = null,
        message
    } = params;

    try {
        // Don't create notification if sender is recipient
        if (recipientId === senderId) {
            return null;
        }

        const notification = new Notification({
            recipient: recipientId,
            sender: senderId,
            type,
            post: postId,
            message
        });

        const savedNotification = await notification.save();

        // Populate sender details for real-time emission
        const populatedNotification = await Notification.findById(savedNotification._id)
            .populate('sender', 'username ProfilePicture')
            .populate('post', 'postTitle');

        return populatedNotification;
    } catch (error) {
        console.error('Error creating notification:', error);
        throw error;
    }
};

// Get all notifications for a user
router.get('/notifications/:userId', async (req, res) => {
    const { userId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    try {
        const notifications = await Notification.find({ recipient: userId })
            .populate('sender', 'username ProfilePicture')
            .populate('post', 'postTitle')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        const total = await Notification.countDocuments({ recipient: userId });

        res.status(200).json({
            notifications,
            totalPages: Math.ceil(total / limit),
            currentPage: page
        });
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get unread notification count
router.get('/notifications/unread/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const count = await Notification.countDocuments({
            recipient: userId,
            read: false
        });

        res.status(200).json({ unreadCount: count });
    } catch (error) {
        console.error('Error getting unread count:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Mark notifications as read
router.post('/notifications/read', async (req, res) => {
    const { notificationIds } = req.body;

    try {
        await Notification.updateMany(
            { _id: { $in: notificationIds } },
            { $set: { read: true } }
        );

        res.status(200).json({ message: 'Notifications marked as read' });
    } catch (error) {
        console.error('Error marking notifications as read:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete a notification
router.delete('/notifications/:notificationId', async (req, res) => {
    const { notificationId } = req.params;

    try {
        await Notification.findByIdAndDelete(notificationId);
        res.status(200).json({ message: 'Notification deleted' });
    } catch (error) {
        console.error('Error deleting notification:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export { createNotification };
export default router;