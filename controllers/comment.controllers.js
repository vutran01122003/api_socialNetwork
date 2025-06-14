const {
    getCommentsService,
    createCommentService,
    deleteCommentService,
    updateCommentService,
    updateLikedCommentService,
    updateUnlikedCommentService,
    getRepliesService
} = require('../services/comment.service');

const {
    getPostService,
    increaseNumberOfCommentService,
    decreaseNumberOfCommentService
} = require('../services/post.service');

module.exports = {
    getComments: async (req, res, next) => {
        try {
            const { commentQuantity, limit } = req.query;
            const comments = await getCommentsService({
                postId: req.params.postId,
                commentQuantity,
                limit
            });

            res.status(200).send({
                status: 'Get comments successful',
                data: comments
            });
        } catch (error) {
            console.log(error);
            next(error);
        }
    },

    getReplyComments: async (req, res, next) => {
        try {
            const { postId, commentId } = req.params;
            const { replyQuantity, limit } = req.query;

            const replyData = await getRepliesService({
                postId,
                commentId,
                replyQuantity,
                limit
            });

            res.status(200).send({
                status: 'Get replies successful',
                replyData
            });
        } catch (error) {
            console.log(error);
            next(error);
        }
    },

    createComment: async (req, res, next) => {
        try {
            const commentData = req.body.commentData;
            const createdComment = await createCommentService(commentData);
            await increaseNumberOfCommentService({ postId: commentData.postId });

            res.status(200).send({
                status: 'create comment successful',
                newComment: createdComment
            });
        } catch (error) {
            next(error);
        }
    },

    deleteComment: async (req, res, next) => {
        try {
            const { postId, commentId } = req.body.data.commentData;
            await decreaseNumberOfCommentService({ postId: postId });
            await deleteCommentService(commentId);

            res.status(200).send({
                status: 'Comment deleted successfully'
            });
        } catch (error) {
            console.log(error);
            next(error);
        }
    },

    updateComment: async (req, res, next) => {
        try {
            const { postId, ...commentData } = req.body.commentData;

            const updatedComment = await updateCommentService(commentData);

            res.status(200).send({
                status: 'Edit comment successfully',
                data: updatedComment
            });
        } catch (error) {
            console.log(error);
            next(error);
        }
    },

    likeComment: async (req, res, next) => {
        try {
            const commentId = req.params.id;
            const { userId, postId } = req.body.data;

            await updateLikedCommentService({
                commentId,
                userId
            });
            const post = await getPostService({ postId });

            res.status(200).send({
                status: 'Like comment successful',
                newPost: post
            });
        } catch (error) {
            next(error);
        }
    },

    unlikeComment: async (req, res, next) => {
        try {
            const commentId = req.params.id;
            const { userId, postId } = req.body.data;

            await updateUnlikedCommentService({
                commentId,
                userId
            });
            const post = await getPostService({ postId });

            res.status(200).send({
                status: 'Unlike comment successful',
                newPost: post
            });
        } catch (error) {
            next(error);
        }
    }
};
