const router = require('express').Router();
const commentCtrl = require('../controllers/comment.controllers');
const jwtService = require('../helper/jwt.service');

router.post(
    '/comment',
    jwtService.verifyAccessToken,
    commentCtrl.createComment
);

router.patch(
    '/comment',
    jwtService.verifyAccessToken,
    commentCtrl.updateComment
);
router.patch(
    '/comment/:id/like',
    jwtService.verifyAccessToken,
    commentCtrl.likeComment
);
router.patch(
    '/comment/:id/unlike',
    jwtService.verifyAccessToken,
    commentCtrl.unlikeComment
);

router.delete(
    '/comment',
    jwtService.verifyAccessToken,
    commentCtrl.deleteComment
);

module.exports = router;
