var mapFunc = function(){
  var time = new Date(this.created.getTime());
  time.setMinutes(Math.floor(time.getMinutes()/5));
  time.setSeconds(0);
  emit(
    {
      time: time.getTime(), 
      type: this.type
    }, 
    {
      symbol: this.symbol,       
      price: this.price, 
      created: this.created,
      time_of_open: null,
      price_of_open: null,
      price_max: null,
      time_of_price_max: null,
      price_min: null,
      time_of_price_min: null,
      time_of_end: null,
      price_of_end: null,
      price_avg: 0,
      count: 0
    });
};

var reduceFunc = function(key, values){
      var res = values.shift(),
        price_avg = 0;
      var count = values.length;

      values.forEach(function(item){
          if(!res.time_of_open || item.created.getTime() < res.time_of_open.getTime()) {
            res.time_of_open = item.created;
            res.price_of_open = item.price;
          }
          if(!res.price_max || item.price_max > res.price_max) {
            res.price_max = item.price;
            res.time_of_price_max = item.created;
          }
          if(!res.price_min || item.price_min < res.price_min) {
            res.price_min = item.price;
            res.time_of_price_min = item.created;
          }
          if(!res.time_of_end || item.created.getTime() > res.time_of_end.getTime()) {
            res.time_of_end = item.created;
            res.price_of_end = item.price;
          }
          price_avg += item.price/(count+1);
      });
      
    res.price_avg = res.price_avg / (res.count + count) * res.count + price_avg;
    res.count += count;

    return res;
};

var finalizeFunc = function(key, item){
  return { // clear unused attributes
      symbol: item.symbol,
      time_of_open: item.time_of_open,
      price_of_open: item.price_of_open,
      price_max: item.price_max,
      time_of_price_max: item.time_of_price_max,
      price_min: item.price_min,
      time_of_price_min: item.time_of_price_min,
      time_of_end: item.time_of_end,
      price_of_end: item.price_of_end,
      price_avg: item.price_avg
  };
};

db.ticks.mapReduce(mapFunc, reduceFunc, {
  "out": {"inline": 1 },
  "finalize": finalizeFunc
});