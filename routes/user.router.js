const router = require('express').Router();
const userRouter = require('../controllers/user.controllers');

router.post('/user', userRouter.searchUser);

router.get('/user/:id', userRouter.getUser);

module.exports = router;
