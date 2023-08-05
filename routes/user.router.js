const router = require('express').Router();
const userCtrl = require('../controllers/user.controllers');
const jwtService = require('../helper/jwt.service');

router.post('/user', jwtService.verifyAccessToken, userCtrl.searchUser);

router.get('/user/:id', jwtService.verifyAccessToken, userCtrl.getUser);
router.get(
    '/suggested_users',
    jwtService.verifyAccessToken,
    userCtrl.getSuggestedUser
);

router.patch('/user/:id', jwtService.verifyAccessToken, userCtrl.updateUser);

router.patch('/user/:id/follow', jwtService.verifyAccessToken, userCtrl.follow);

router.patch(
    '/user/:id/unfollow',
    jwtService.verifyAccessToken,
    userCtrl.unfollow
);

module.exports = router;
