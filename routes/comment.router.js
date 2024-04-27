const router = require('express').Router();
const commentCtrl = require('../controllers/comment.controllers');
const { auth } = require('../middleware/auth');

router.get('/post/:postId/comments', auth, commentCtrl.getComments);
router.post('/comment', auth, commentCtrl.createComment);

router.patch('/comment', auth, commentCtrl.updateComment);
router.patch('/comment/:id/like', auth, commentCtrl.likeComment);
router.patch('/comment/:id/unlike', auth, commentCtrl.unlikeComment);

router.delete('/comment', auth, commentCtrl.deleteComment);

module.exports = router;
