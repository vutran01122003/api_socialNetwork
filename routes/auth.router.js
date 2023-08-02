const router = require('express').Router();
const authCtrl = require('../controllers/auth.controllers');
const jwtService = require('../helper/jwt.service');

router.post('/register', authCtrl.register);

router.post('/login', authCtrl.login);

router.get(
    '/refresh_token',
    jwtService.verifyRefreshToken,
    authCtrl.refreshToken
);

router.get('/access_token', jwtService.verifyAccessToken, authCtrl.accessToken);

router.get('/logout', authCtrl.logout);

module.exports = router;
