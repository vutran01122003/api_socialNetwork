module.exports = {
    queryDB: async (queryDB, queryURL, limit) => {
        const { page, currentQuantity } = queryURL;

        let skip = (page - 1) * limit;
        if (currentQuantity) {
            const changedPosts = currentQuantity - (page - 1) * limit;
            skip += changedPosts;
        }

        return queryDB.skip(skip).limit(limit);
    }
};
