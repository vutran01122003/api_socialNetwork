const router = require('express').Router();
const authCtrl = require('../controllers/auth.controllers');
const { auth, checkRefreshToken } = require('../middleware/auth');

router.post('/register', authCtrl.register);

router.post('/login', authCtrl.login);

router.get('/refresh_token', checkRefreshToken, authCtrl.refreshToken);

router.get('/access_token', auth, authCtrl.accessToken);

router.get('/logout', authCtrl.logout);

module.exports = router;
