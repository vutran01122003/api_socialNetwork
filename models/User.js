const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const conn = require('../config/userDB');

const UserSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            require: true
        },
        username: {
            type: String,
            lowercase: true,
            trim: true,
            unique: true,
            require: true
        },
        gender: {
            type: String,
            lowercase: true,
            default: 'male'
        },
        fullname: {
            type: String,
            maxlength: 30,
            require: true
        },
        avatar: {
            type: String,
            default:
                'https://res.cloudinary.com/dzm0nupxy/image/upload/v1686510558/avatar/avatar_cvjdqk.jpg'
        },
        phone: {
            type: String,
            default: ''
        },
        role: {
            type: String,
            default: 'user'
        },
        story: {
            type: String,
            default: '',
            maxlength: 200
        },
        website: {
            type: String,
            default: ''
        },
        followers: [{ type: mongoose.Types.ObjectId, ref: 'user' }],
        following: [{ type: mongoose.Types.ObjectId, ref: 'user' }],
        saved: [{ type: mongoose.Types.ObjectId, ref: 'post' }]
    },
    { timestamps: true }
);

UserSchema.pre('save', function (next) {
    try {
        const hashedPassword = bcrypt.hashSync(this.password, 10);
        this.password = hashedPassword;
        next();
    } catch (error) {
        next(error);
    }
});

UserSchema.methods.checkPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = conn.model('user', UserSchema);
