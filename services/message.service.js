const { queryMessage, queryDB } = require('../helper/pagination.query');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');

module.exports = {
    getConversation: async ({ receiver, sender, populate }) => {
        const conversation = await Conversation.findOne({
            recipients: { $all: [receiver, sender] }
        }).populate(populate);
        return conversation;
    },
    getConversations: async ({ recipientId, populate, queryUrl, limit }) => {
        const conversations = await queryDB(
            Conversation.find({ recipients: recipientId })
                .populate(populate)
                .sort({ createdAt: -1 }),
            queryUrl,
            limit
        );
        return conversations;
    },
    createMessage: async ({ conversation, messageData }) => {
        const createdMessage = await Message.create({
            conversationId: conversation._id,
            ...messageData
        });
        return createdMessage;
    },
    createConversation: async ({ receiver, sender }) => {
        const newConversation = await Conversation.findOneAndUpdate(
            { $or: [{ recipients: [receiver, sender] }, { recipients: [sender, receiver] }] },
            {
                recipients: [receiver, sender],
                readedUsers: [sender]
            },
            { new: true, upsert: true }
        );
        return newConversation;
    },
    updateReadedConversation: async ({ conversationId, userId }) => {
        const updatedConversation = await Conversation.findByIdAndUpdate(
            conversationId,
            {
                $push: { readedUsers: userId }
            },
            {
                new: true
            }
        ).populate('recipients', 'username fullname avatar');

        return updatedConversation;
    },
    countMessage: async ({ conversationId }) => {
        const countDocs = await Message.countDocuments({ conversationId });
        return countDocs;
    },
    paginateMessage: async ({ conversationId, queryUrl, totalDocs, limit }) => {
        const messages = await queryMessage({
            queryDB: Message.find({ conversationId }),
            queryUrl,
            totalDocs,
            limit
        });
        return messages;
    },
    deleteMessage: async ({ messageId }) => {
        const deletedMessage = await Message.findOneAndDelete({ _id: messageId });
        return deletedMessage;
    },
    deleteConversation: async ({ conversationId }) => {
        const deletedConversation = await Conversation.findByIdAndDelete(conversationId);
        const res = await Message.deleteMany({ conversationId });
        return deletedConversation;
    }
};
