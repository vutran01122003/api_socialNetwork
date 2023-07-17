const router = require('express').Router();
const authRouter = require('../controllers/auth.controllers');
const jwtService = require('../helper/jwt.service');

router.post('/register', authRouter.register);

router.post('/login', authRouter.login);

router.post(
    '/refresh_token',
    jwtService.verifyRefreshToken,
    authRouter.refreshToken
);

router.get(
    '/access_token',
    jwtService.verifyAccessToken,
    authRouter.accessToken
);

router.get('/logout', jwtService.verifyRefreshToken, authRouter.logout);

module.exports = router;
