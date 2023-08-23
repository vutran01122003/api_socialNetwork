const User = require('../models/User');

module.exports = {
    createUserService: async (data) => {
        const userCreated = new User(data);
        await userCreated.save();
        return userCreated;
    },

    getUserService: async (filter, select) => {
        const user = await User.findOne(filter).select(select).exec();
        return user;
    },

    populateUserService: async (filter, select) => {
        const populatedUser = User.findOne(filter)
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
        return populatedUser;
    }
};
