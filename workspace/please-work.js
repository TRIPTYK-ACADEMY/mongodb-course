let db = connect("mongodb://root:test123@localhost:27017?authSource=admin");

/**
 * {
        date: ISODate('2001-02-09T00:00:00.000Z'),
        amount: 5286,
        transaction_code: 'sell',
        symbol: 'nvda',
        price: '6.84957187854324356379720484255813062191009521484375',
        total: '36206.83694997958547823202480'
      }
*/
db = db.getSiblingDB("sample_analytics");

const result = db.transactions.aggregate([
    {
        $match: {
            account_id: {
                $exists: true
            }
        }
    },
    {
        $project: {
            account_id: true,
            total: true
        }
    },
    {
        $group: {
            _id: "$account_id",
            somme: { $sum: { $toDecimal: "$total" } }
        }
    }
]);

console.log(result);
