module.exports = {
    queryDB: async (queryDB, queryURL, limit) => {
        const { page, currentQuantity } = queryURL;

        let skip = (page - 1) * limit;
        if (currentQuantity) {
            const changedPosts = currentQuantity - (page - 1) * limit;
            skip += changedPosts;
        }

        return queryDB.skip(skip).limit(limit);
    },
    queryMessage: async ({ queryDB, queryUrl, totalDocs, limit }) => {
        const { page } = queryUrl;
        let _limit = limit;
        let skip = totalDocs - page * _limit;
        if (skip < 0) {
            if (-skip >= limit) return [];
            _limit += skip;
            skip = 0;
        }

        return queryDB.skip(skip).limit(_limit).sort({ createdAt: 1 });
    }
};
