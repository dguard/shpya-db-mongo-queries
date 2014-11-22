// Лучшие цены на 3к квартиры: таблица с лучшими ценами на 3-х комнатные квартиры.
// По вертикали - районы, по горизонтали 5 предложений. В каждой ячейке id и цена.

db.all_out.drop();

db.advs.aggregate(
    [
        {
            $match: {"rooms_number" : 3}
        },
        {
            $group: {
                _id: {
                    district: "$district",
                    price: "$price",
                    adv_id: "$_id"
                },
                bestPrice: { $min: "$price" }
            }
        },
        {
            $sort: { district: -1, bestPrice: 1 }
        },
        {
            $group : {
                _id :  "$_id.district",
                prices: {
                    $push: {
                        bestPrice: "$bestPrice",
                        adv_id: "$_id.adv_id"
                    }
                }
            }
        },
        {
            $out: "all_out"
        }
    ]
);

db.all_out.update({}, {
    $push: {
        prices: {
            $each: [],
            $slice: 5
        }
    }
}, {
    multi:true
});


// process output
var items = db.all_out.find(),
    LIMIT = 5;

// Object.create makes clone of object
var thead = Object.create(items).map(function(item){
    return item._id ? item._id : '-';
}).join(';');

print(thead);

for(var i = 0; i < LIMIT; i++) {
    var row = Object.create(items).map(function(item){
        return item.prices[i] ? [item.prices[i].adv_id, item.prices[i].bestPrice].join(',') : '-';
    }).join(';');
    print(row);
}

db.all_out.drop();