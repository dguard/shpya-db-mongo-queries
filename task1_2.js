var mapAdvsFunc = function(){
    emit(this.owner_id, {totalAdv: 1})
};
var reduceAdvsFunc = function(key, values){
    var totalAdv = 0;
    values.forEach(function(value) {
        totalAdv += value.totalAdv;
    });
    return { totalAdv: totalAdv };
};
// count adverts
db.advs.mapReduce(mapAdvsFunc, reduceAdvsFunc, {
    out: 'tmp'
});

var mapAgentFunc = function(){
    emit(this._id, {
        fullname: this.fullname,
        phone: this.phone
    })
};
var reduceAgentFunc = function (key, values) {
    var res = {totalAdv: 0};
    values.forEach(function (item) {
        item.fullname && (res.fullname = item.fullname);
        item.phone && (res.phone = item.phone);
        item.totalAdv && (res.totalAdv = item.totalAdv);
    });
    return res;
};
// add owner info
db.agents.mapReduce(mapAgentFunc, reduceAgentFunc, {
    out: {reduce: 'tmp'}
});

print("имя;телефон;кол-во предложений");
db.tmp.find({'value.totalAdv': {$gt: 1}}).sort({'value.totalAdv': -1}).forEach(function(item){
    print(
        [item.value.fullname, item.value.phone, item.value.totalAdv].join(';')
    );
});

db.tmp.drop();