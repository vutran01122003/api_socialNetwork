const router = require('express').Router();
const commentCtrl = require('../controllers/comment.controllers');

router.post('/comment', commentCtrl.createComment);
router.patch('/comment', commentCtrl.updateComment);
router.patch('/comment/:id/like', commentCtrl.likeComment);
router.patch('/comment/:id/unlike', commentCtrl.unlikeComment);
router.delete('/comment', commentCtrl.deleteComment);

module.exports = router;
