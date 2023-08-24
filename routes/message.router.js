const router = require('express').Router();
const messageCtrl = require('../controllers/message.controllers');
const { auth } = require('../middleware/auth');

router.get('/messages/:id', auth, messageCtrl.getMessages);
router.get('/conversation/:id', auth, messageCtrl.getConversation);
router.get('/conversations/:id', auth, messageCtrl.getConversations);
router.post('/message', auth, messageCtrl.createMessage);
router.delete('/message/:id', auth, messageCtrl.deleteMessage);
router.delete('/conversation/:id', auth, messageCtrl.deleteConversation);

module.exports = router;
