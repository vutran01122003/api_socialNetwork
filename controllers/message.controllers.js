const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const { queryMessage } = require('../helper/pagination.query');
const {
    createConversation,
    getConversation,
    createMessage,
    countMessage,
    paginateMessage,
    getConversations,
    deleteMessage
} = require('../services/message.service');
module.exports = {
    createMessage: async (req, res, next) => {
        const { receiver, sender } = req.body.postData;

        try {
            let conversation = null;
            conversation = await getConversation({ receiver, sender });
            if (!conversation) {
                conversation = await createConversation({ receiver, sender });
            }

            const createdMessage = await createMessage({
                conversation,
                messageData: req.body.postData
            });

            res.status(200).send({
                status: 'create message successful',
                createdMessage,
                conversation
            });
        } catch (error) {
            next(error);
        }
    },
    getMessages: async (req, res, next) => {
        try {
            const conversationId = req.params.id;
            const countDocs = await countMessage({ conversationId });
            const messages = await paginateMessage({
                conversationId,
                queryUrl: req.query,
                totalDocs: countDocs,
                limit: 10
            });

            res.status(200).send({
                status: 'get messages successful',
                messages
            });
        } catch (error) {
            next(error);
        }
    },
    getConversation: async (req, res, next) => {
        try {
            const userId = req.params.id;
            const authId = res.locals.userId;
            const conversation = await getConversation({
                receiver: userId,
                sender: authId,
                populate: {
                    path: 'recipients',
                    select: 'avatar username fullname'
                }
            });

            res.status(200).send({
                status: 'get conversation successful',
                conversation
            });
        } catch (error) {
            next(error);
        }
    },
    getConversations: async (req, res, next) => {
        try {
            const userId = req.params.id;
            const conversations = await getConversations({
                recipientId: userId,
                populate: {
                    path: 'recipients',
                    select: 'avatar username fullname'
                }
            });
            res.status(200).send({
                status: 'get conversations successful',
                conversations
            });
        } catch (error) {
            next(error);
        }
    },
    deleteMessage: async (req, res, next) => {
        try {
            const messageId = req.params.id;
            const deletedMessage = await deleteMessage({ messageId });

            res.status(200).send({
                status: 'delete message successful',
                deletedMessage
            });
        } catch (error) {
            next(error);
        }
    }
};
