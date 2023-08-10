const notificationCtrl = require('../controllers/notification.controllers');
const { auth } = require('../middleware/auth');

const router = require('express').Router();

router.get('/notification', auth, notificationCtrl.getNotifications);

router.post('/notification', auth, notificationCtrl.createNotification);

router.patch('/notification', auth, notificationCtrl.updateNotification);
router.patch('/readed_notification', auth, notificationCtrl.readedNotification);
router.patch('/unreaded_notification', auth, notificationCtrl.unreadedNotification);

router.delete('/notification/:id', auth, notificationCtrl.deleteNotification);

module.exports = router;
