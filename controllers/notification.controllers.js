const { queryDB } = require('../helper/pagination.query');
const Notification = require('../models/Notification');
const {
    createNotification,
    paginateNotifications,
    updateReadedNotification,
    updateReadedNotifications,
    updateUnreadedNotification,
    deleteNotification,
    deleteNotifications
} = require('../services/notification.service');

module.exports = {
    createNotification: async (req, res, next) => {
        try {
            const createdNotification = await createNotification(req.body);
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

            const notifications = await paginateNotifications({
                receiverId: userId,
                queryURL: req.query,
                limit: 10
            });
            res.status(200).send({
                status: 'get notification successful',
                notifications
            });
        } catch (error) {
            next(error);
        }
    },

    readedNotification: async (req, res, next) => {
        try {
            const notificationId = req.body.notificationId;
            const userId = req.body.userId;

            const readedNotification = await updateReadedNotification({
                notificationId,
                userId
            });

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

            const readedAllNotifications = await updateReadedNotifications({ userId });

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

            const unreadedNotification = await updateUnreadedNotification({
                notificationId,
                userId
            });

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

            const deletedNotification = await deleteNotification({
                notificationId,
                userId
            });
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

            const deletedAllNotifications = await deleteNotifications({ userId });

            res.status(200).send({
                status: 'delete all notifications successful',
                deletedAllNotifications
            });
        } catch (error) {
            next(error);
        }
    }
};
