const { queryDB } = require('../helper/pagination.query');
const Notification = require('../models/Notification');

module.exports = {
    createNotification: async (req, res, next) => {
        try {
            const createdNotification = await Notification.create(req.body);
            res.status(200).send({
                status: 'create notification successful',
                createdNotification
            });
        } catch (error) {
            next(error);
        }
    },

    getNotifications: async (req, res, next) => {
        try {
            const userId = res.locals.userId;

            const notifications = await queryDB(
                Notification.find({
                    receiver: userId
                }).sort({ createdAt: -1 }),
                req.query,
                10
            );
            res.status(200).send({
                status: 'get notification successful',
                notifications
            });
        } catch (error) {
            next(error);
        }
    },

    updateNotification: async (req, res, next) => {
        try {
            const notificationId = req.body.notificationId;
            const userId = req.body.userId;

            const updatedNotification = await Notification.findByIdAndUpdate(
                notificationId,
                { $push: { readedUser: userId } },
                { new: true }
            ).exec();

            res.status(200).send({
                status: 'update notification successful',
                updatedNotification
            });
        } catch (error) {
            next(error);
        }
    },

    readedNotification: async (req, res, next) => {
        try {
            const notificationId = req.body.notificationId;
            const userId = req.body.userId;

            const readedNotification = await Notification.findByIdAndUpdate(
                notificationId,
                { $push: { readedUser: userId } },
                { new: true }
            ).exec();

            res.status(200).send({
                status: 'read notification successful',
                type: 'read',
                readedNotification
            });
        } catch (error) {
            next(error);
        }
    },

    readedNotifications: async (req, res, next) => {
        try {
            const userId = req.body.userId;

            const readedAllNotifications = await Notification.updateMany(
                { receiver: userId, readedUser: { $nin: [userId] } },
                {
                    $push: { readedUser: userId }
                }
            ).exec();

            res.status(200).send({
                status: 'read all notifications successful',
                type: 'read',
                readedAllNotifications
            });
        } catch (error) {
            next(error);
        }
    },

    unreadedNotification: async (req, res, next) => {
        try {
            const notificationId = req.body.notificationId;
            const userId = req.body.userId;

            const unreadedNotification = await Notification.findByIdAndUpdate(
                notificationId,
                { $pull: { readedUser: userId } },
                { new: true }
            ).exec();

            res.status(200).send({
                status: 'unread notification successful',
                type: 'unread',
                unreadedNotification
            });
        } catch (error) {
            next(error);
        }
    },

    deleteNotification: async (req, res, next) => {
        try {
            const notificationId = req.params.id;
            const userId = req.body.data.userId;

            const deletedNotification = await Notification.findByIdAndUpdate(
                notificationId,
                { $pull: { receiver: userId } },
                { new: true }
            );

            if (deletedNotification.receiver.length === 0) {
                await Notification.findByIdAndDelete(notificationId);
            }

            res.status(200).send({
                status: 'delete notification successful',
                deletedNotification
            });
        } catch (error) {
            next(error);
        }
    },

    deleteNotifications: async (req, res, next) => {
        try {
            const userId = req.body.data.userId;

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

            res.status(200).send({
                status: 'delete all notifications successful',
                deletedAllNotifications
            });
        } catch (error) {
            next(error);
        }
    }
};
