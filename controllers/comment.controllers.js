const {
    createCommentService,
    createReplyCommentService,
    deleteCommentService,
    updateCommentService,
    updateLikedCommentService,
    updateUnlikedCommentService
} = require('../services/comment.service');
const {
    findUpdatedPost,
    getPostOfCreatedCommentService,
    getPostService,
    getPostOfDeletedCommentService
} = require('../services/post.service');

module.exports = {
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
                status: 'successful comment',
                newPost: updatedPost
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

            console.log(updatedPost);
            res.status(200).send({
                status: 'comment deleted successfully',
                newPost: updatedPost
            });
        } catch (error) {
            console.log(error);
            next(error);
        }
    },

    updateComment: async (req, res, next) => {
        try {
            const { postId, ...commentData } = req.body.commentData;

            await updateCommentService(commentData);
            const post = await getPostService({ _id: postId });

            res.status(200).send({
                status: 'edit comment successfully',
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
            const post = await getPostService({ _id: postId });

            res.status(200).send({
                status: 'like comment successful',
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
            const post = await getPostService({ _id: postId });

            res.status(200).send({
                status: 'unlike comment successful',
                newPost: post
            });
        } catch (error) {
            next(error);
        }
    }
};
