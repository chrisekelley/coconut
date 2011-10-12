// reduce.js
// this reduce function returns an array of objects
// {tot:total_value_for_group, count:elements_in_the_group}
// clients can than do tot/count to get the average for the group
// Keys are arrays [year][month][day], so count will always be 1 when group_level=3
function(keys, values, rereduce) {
//	if (rereduce) {
////		var result = {tot:0, count:0};
////		var cnt = 0;
////		for (var idx in values) {
////			var resolved =  values[idx];
////			//if (resolved === "1") {
////				cnt++;
////			//}
//////			result.tot += values[idx].tot;
//////			result.count += values[idx].count;
////		}
////		//return result;
////		//return cnt;
////		return values;
//		return sum(values);
//	}
//	else {
//		var result = {tot:sum(values), count:values.length};
//		return result;
//	}
	//var result = {resolved:sum(values), all:values.length};
	//var result = {resolved:sum(values), all:sum(values)};
	//var result = sum(values);
	var result = sum(values);
	return result;
	
	
	//return sum(values);
}