const router = require('express').Router();
const passwordCtrl = require('../controllers/password.controllers');

router.post('/password/code', passwordCtrl.sendCode);
router.post('/password/confirm_code', passwordCtrl.confirmCode);
router.post('/password/reset', passwordCtrl.resetPassword);

module.exports = router;
