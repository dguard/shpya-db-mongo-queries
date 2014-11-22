//В строке четыре поля: метраж, минимальная цена, средняя цена, максимальная.
print("метраж, минимальная цена, средняя цена, максимальная");

db.advs.aggregate(
    [
        {
            $group: {
                _id: "$area",
                minPrice: { $min: "$price" },
                avgPrice: { $avg: "$price" },
                maxPrice: { $max: "$price" }
            }
        },
        {
            $sort: { _id: -1 }
        }
    ]
).forEach(function(item){
    print(
        [item._id, item.minPrice, item.avgPrice.toFixed(0), item.maxPrice].join(';')
    )
});