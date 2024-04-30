const {
    getCommentsService,
    createCommentService,
    createReplyCommentService,
    deleteCommentService,
    updateCommentService,
    updateLikedCommentService,
    updateUnlikedCommentService,
    getRepliesService
} = require('../services/comment.service');

const {
    findUpdatedPost,
    getPostOfCreatedCommentService,
    getPostService,
    getPostOfDeletedCommentService
} = require('../services/post.service');

module.exports = {
    getComments: async (req, res, next) => {
        try {
            const postData = await getCommentsService({
                postId: req.params.postId,
                commentQuantity: req.query.commentQuantity
            });

            res.status(200).send({
                status: 'Get comments successful',
                commentsData: postData[0].comments
            });
        } catch (error) {
            console.log(error);
            next(error);
        }
    },

    getReplyComments: async (req, res, next) => {
        try {
            const { postId, commentId } = req.params;
            const replyQuantity = req.query.replyQuantity;

            const replyData = await getRepliesService({
                postId,
                commentId,
                replyQuantity
            });

            res.status(200).send({
                status: 'Get replies successful',
                replyData
            });
        } catch (error) {
            next(error);
        }
    },

    createComment: async (req, res, next) => {
        try {
            const { postId, ...commentData } = req.body.commentData;
            const createdComment = await createCommentService(commentData);
            let updatedPost = null;

            if (commentData.originCommentId) {
                await createReplyCommentService({
                    originCommentId: commentData.originCommentId,
                    createdCommentId: createdComment._id
                });
                updatedPost = await findUpdatedPost(postId);
            } else {
                updatedPost = await getPostOfCreatedCommentService({
                    postId,
                    createdCommentId: createdComment._id
                });
            }

            res.status(200).send({
                status: 'Successful comment',
                newComment: createdComment
            });
        } catch (error) {
            next(error);
        }
    },

    deleteComment: async (req, res, next) => {
        try {
            const { postId, commentId } = req.body.data.commentData;

            const deletedComment = await deleteCommentService(commentId);

            const updatedPost = await getPostOfDeletedCommentService({
                postId,
                deletedCommentId: deletedComment._id
            });

            res.status(200).send({
                status: 'Comment deleted successfully',
                newPost: updatedPost
            });
        } catch (error) {
            next(error);
        }
    },

    updateComment: async (req, res, next) => {
        try {
            const { postId, ...commentData } = req.body.commentData;

            await updateCommentService(commentData);
            const post = await getPostService({ postId });

            res.status(200).send({
                status: 'Edit comment successfully',
                newPost: post
            });
        } catch (error) {
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
