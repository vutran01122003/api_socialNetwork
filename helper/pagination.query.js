module.exports = {
    queryDB: async (queryDB, queryURL) => {
        const { page, currentPostCount } = queryURL;

        const limit = 3;
        let skip = (page - 1) * limit;

        if (currentPostCount) {
            const changedPosts = currentPostCount - (page - 1) * limit;
            skip += changedPosts;
        }

        return queryDB.skip(skip).limit(limit);
    }
};
