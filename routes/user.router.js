const router = require('express').Router();
const userRouter = require('../controllers/user.controllers');

router.post('/user', userRouter.searchUser);

router.get('/user/:id', userRouter.getUser);

router.patch('/user/:id', userRouter.updateUser);

module.exports = router;
