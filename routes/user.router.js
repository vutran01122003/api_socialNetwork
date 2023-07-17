const router = require('express').Router();
const userRouter = require('../controllers/user.controllers');

router.post('/user', userRouter.searchUser);

router.get('/user/:id', userRouter.getUser);

router.patch('/user/:id', userRouter.updateUser);

router.patch('/user/:id/follow', userRouter.follow);

router.patch('/user/:id/unfollow', userRouter.unfollow);

module.exports = router;
