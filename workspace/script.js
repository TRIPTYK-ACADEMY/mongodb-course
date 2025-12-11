let db = connect("mongodb://root:test123@localhost:27017?authSource=admin");
db = db.getSiblingDB("sample_mflix");

const result = db.movies.aggregate([
    {
        $lookup: {
            from: 'comments',
            localField: '_id',
            foreignField: 'movie_id',
            as: 'comments'
        }
    },
    {
        $match: {
            comments: {
                $ne: []
            }
        }
    },
    {
        $limit: 5
    },
    {
        $project: {
            title: true,
            comments: {
                name: true,
                email: true
            }
        }
    }
]);

console.log(result);
