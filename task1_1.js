// Агенты: возвращает список тех, у кого больше одного объявления. В строке 3 поля: phone, fullname, количество предложений. Отсортирован по количеству предложений по убыванию.
print("имя;телефон;количество предложений");

db.advs.aggregate(
    [
        {
            $group: { _id: "$owner_id", totalAdv: { $sum: 1 } }
        },
        {
            $match: { totalAdv: { $gt: 1 } }
        },
        {
            $sort: { totalAdv: -1 }
        }
    ]
).forEach(function(item) {
    var agent = db.agents.findOne({_id: item._id});
    print(
        [agent.fullname, agent.phone, item.totalAdv].join(';')
    );
});