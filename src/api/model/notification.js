import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['like', 'comment', 'follow', 'mention', 'post_approval']
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PostData',
        required: false
    },
    read: {
        type: Boolean,
        default: false
    },
    message: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Notification', NotificationSchema);