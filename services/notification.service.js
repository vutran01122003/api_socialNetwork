const Notification = require('../models/Notification');
const { queryDB } = require('../helper/pagination.query');

module.exports = {
    createNotification: async (data) => {
        const createdNotification = await Notification.create(data);
        return createdNotification;
    },
    paginateNotifications: async ({ receiverId, queryURL, limit }) => {
        const notifications = await queryDB(
            Notification.find({
                receiver: receiverId
            }).sort({ createdAt: -1 }),
            queryURL,
            limit
        );

        return notifications;
    },
    updateReadedNotification: async ({ notificationId, userId }) => {
        const updatedNotification = await Notification.findByIdAndUpdate(
            notificationId,
            { $push: { readedUser: userId } },
            { new: true }
        ).exec();

        return updatedNotification;
    },
    updateReadedNotifications: async ({ userId }) => {
        const readedAllNotifications = await Notification.updateMany(
            { receiver: userId, readedUser: { $nin: [userId] } },
            {
                $push: { readedUser: userId }
            }
        ).exec();

        return readedAllNotifications;
    },
    updateUnreadedNotification: async ({ notificationId, userId }) => {
        const unreadedNotification = await Notification.findByIdAndUpdate(
            notificationId,
            { $pull: { readedUser: userId } },
            { new: true }
        ).exec();

        return unreadedNotification;
    },
    deleteNotification: async ({ notificationId, userId }) => {
        const deletedNotification = await Notification.findByIdAndUpdate(
            notificationId,
            { $pull: { receiver: userId } },
            { new: true }
        );

        if (deletedNotification.receiver.length === 0) {
            await Notification.findByIdAndDelete(notificationId);
        }

        return deletedNotification;
    },
    deleteNotifications: async ({ userId }) => {
        const deletedAllNotifications = await Notification.updateMany(
            {
                receiver: userId
            },
            {
                $pull: {
                    receiver: userId
                }
            }
        ).exec();

        await Notification.deleteMany({
            receiver: { $size: 0 }
        }).exec();

        return deletedAllNotifications;
    }
};
