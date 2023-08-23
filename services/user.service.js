const User = require('../models/User');

module.exports = {
    searchUsersService: async (searchValue, select) => {
        const regex = new RegExp(searchValue);
        return User.find({
            username: { $regex: regex, $options: 'i' }
        }).select(select);
    },

    findOneUserService: async (filter) => {
        return User.findOne(filter).exec();
    },

    getUserService: async (filter, select) => {
        return User.findOne(filter)
            .select(select)
            .populate([
                {
                    path: 'followers',
                    model: 'user',
                    select: 'fullname username avatar'
                },
                {
                    path: 'following',
                    model: 'user',
                    select: 'fullname username avatar following'
                },
                {
                    path: 'saved',
                    model: 'post'
                }
            ])
            .exec();
    },

    getSuggestedUserSerive: async (user, limit) => {
        return User.aggregate([
            {
                $match: {
                    _id: { $nin: [user._id, ...user.following] }
                }
            },
            { $sample: { size: limit } },
            { $project: { username: 1, avatar: 1, fullname: 1 } }
        ]);
    },

    updateEditUserService: async ({ userId, userData }, select) => {
        return User.findByIdAndUpdate(userId, userData, {
            new: true
        }).select(select);
    },

    updateFollowerUserService: async ({ authId, userId }) => {
        return User.findByIdAndUpdate(userId, { $push: { followers: authId } }, { new: true })
            .select('-password')
            .populate([
                {
                    path: 'followers',
                    model: 'user',
                    select: 'fullname username avatar'
                },
                {
                    path: 'following',
                    model: 'user',
                    select: 'fullname username avatar following'
                },
                {
                    path: 'saved',
                    model: 'post'
                }
            ])
            .exec();
    },

    updateFollowingUserService: async ({ authId, userId }) => {
        return User.findByIdAndUpdate(authId, { $push: { following: userId } }, { new: true })
            .select('-password')
            .populate([
                {
                    path: 'followers',
                    model: 'user',
                    select: 'fullname username avatar'
                },
                {
                    path: 'following',
                    model: 'user',
                    select: 'fullname username avatar following'
                },
                {
                    path: 'saved',
                    model: 'post'
                }
            ])
            .exec();
    },

    updateUnfollowerUserService: async ({ authId, userId }) => {
        return User.findByIdAndUpdate(userId, { $pull: { followers: authId } }, { new: true })
            .select('-password')
            .populate([
                {
                    path: 'followers',
                    model: 'user',
                    select: 'fullname username avatar'
                },
                {
                    path: 'following',
                    model: 'user',
                    select: 'fullname username avatar following'
                },
                {
                    path: 'saved',
                    model: 'post'
                }
            ])
            .exec();
    },

    updateUnfollowingUserService: async ({ authId, userId }) => {
        return User.findByIdAndUpdate(authId, { $pull: { following: userId } }, { new: true })
            .select('-password')
            .populate([
                {
                    path: 'followers',
                    model: 'user',
                    select: 'fullname username avatar'
                },
                {
                    path: 'following',
                    model: 'user',
                    select: 'fullname username avatar following'
                },
                {
                    path: 'saved',
                    model: 'post'
                }
            ])
            .exec();
    }
};
