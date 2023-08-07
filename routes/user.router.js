const router = require('express').Router();
const userCtrl = require('../controllers/user.controllers');
const { auth } = require('../middleware/auth');

router.post('/user', auth, userCtrl.searchUser);

router.get('/user/:id', auth, userCtrl.getUser);
router.get('/suggested_users', auth, userCtrl.getSuggestedUser);

router.patch('/user/:id', auth, userCtrl.updateUser);
router.patch('/user/:id/follow', auth, userCtrl.follow);
router.patch('/user/:id/unfollow', auth, userCtrl.unfollow);

module.exports = router;
