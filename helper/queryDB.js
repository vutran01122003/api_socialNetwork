module.exports = {
    queryDB: async (queryDB, queryURL) => {
        const { page, currentPostCount } = queryURL;

        if (page && currentPostCount) {
            const limit = 3;
            let skip = (page - 1) * limit;
            const changedPosts = currentPostCount - (page - 1) * limit;

            if (changedPosts > 0) {
                skip += changedPosts;
            } else {
                skip -= changedPosts;
            }
            return await queryDB.skip(skip).limit(limit);
        } else {
            return await queryDB.skip(0).limit(3);
        }
    }
};
