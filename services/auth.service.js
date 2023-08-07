const User = require('../models/User');

module.exports = {
    createUserService: async (data) => {
        return User.create(data).exec();
    },

    getUserService: async (filter, select) => {
        return User.findOne(filter).select(select).exec();
    },

    populateUserService: async (filter, select) => {
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
                    select: 'fullname username avatar'
                },
                {
                    path: 'saved',
                    model: 'post'
                }
            ])
            .exec();
    }
};
