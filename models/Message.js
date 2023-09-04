const mongoose = require('mongoose');
const conn = require('../config/userDB');
const cloudinary = require('../config/cloudinary');

const MessageSchema = new mongoose.Schema(
    {
        conversationId: {
            type: mongoose.Types.ObjectId,
            ref: 'conversation'
        },
        sender: {
            type: mongoose.Types.ObjectId,
            ref: 'user'
        },
        receiver: {
            type: mongoose.Types.ObjectId,
            ref: 'user'
        },
        content: {
            type: String,
            default: ''
        },
        files: {
            type: Array,
            default: []
        },
        likes: {
            type: [{ type: mongoose.Types.ObjectId, ref: 'user' }],
            default: []
        }
    },
    {
        timestamps: true
    }
);

MessageSchema.pre('findOneAndDelete', async function (next) {
    try {
        const { _id } = this.getQuery();
        const message = await this.model.findById(_id);
        for (let file of message.files) {
            cloudinary.uploader.destroy(file.id, {
                resource_type: file.url.includes('/video/') ? 'video' : 'image'
            });
        }
        next();
    } catch (error) {
        next(error);
    }
});

MessageSchema.pre('deleteMany', async function (next) {
    try {
        const deletedDocs = await this.model.find(this._conditions).lean();
        for (let doc of deletedDocs) {
            for (let file of doc.files) {
                cloudinary.uploader
                    .destroy(file.id, {
                        resource_type: file.url.includes('/video/') ? 'video' : 'image'
                    })
                    .catch((e) => {
                        console.log(e);
                    });
            }
        }

        return next(); // normal save
    } catch (error) {
        return next(error);
    }
});

const Message = conn.model('message', MessageSchema);

module.exports = Message;
