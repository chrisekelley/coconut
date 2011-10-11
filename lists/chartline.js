function(head, req) {
	start({"headers":{"Content-Type" : "image/svg+xml"}});
	
	// some utility functions that print svg elements
	function svg(width, height) {
		return '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"'+
		' style="fill:black"'+
		' width="'+width+'" height="'+height+'">\n';
	}
	function line(x1, y1, x2, y2, color) {
		return '<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" style="stroke-width: 0.2; stroke:'+color+'"/>\n';
	}
	function rect(x, y, width, height, color, fill) {
		return '<rect x="'+x+'" y="'+y+'" width="'+width+'" height="'+height+'" style="fill:'+fill+'; stroke:'+color+'"/>\n';
	}
	function text(x,y, text) {
		return '<text x="'+x+'" y="'+y+'" font-size="11" font-family="sans-serif">'+text+'</text>\n';
	}
	
	// import query parameters
	var x_size = req.query.width || 750;
	var y_size = req.query.height || 500;
	var level = parseInt(req.query.group_level);
	
	// find max and min values
	// collect values and labels
	var y_max = null;
	var y_min = 0;
	var values = [];
	var labels = [];
	// To start with 0, set count = 0 and comment out if (y_min=null
	var count = 0;
	// To start with 0, also uncomment this line
	//values[0] = 0;
	while(row = getRow()) {		
//		var value = Math.ceil(row.value.tot/row.value.count);
//		if (y_max==null || value>y_max) { y_max=value; }
//		if (y_min==null || value<y_min) { y_min=value; }
//		values[count] = value;
//		labels[count] = row.key.join('-');
		var value = row.value;
		if (y_max==null || value>y_max) { y_max=value; }
		//if (y_min==null || value<y_min) { y_min=value; }
		values[count] = value;
		labels[count] = row.key.join('-');
		count++;
	}
	// free space surrounding the actual chart
	var pad = Math.round(y_size/12);
	
	// calculate scaling factors
	var in_width = x_size-(2*pad);
	var in_height = y_size-(2*pad);
	var in_x_scale = in_width/count;
	var in_y_scale = in_height/(y_max-y_min);
	
	
	
	send('<?xml version="1.0"?>');
	send(svg(x_size, y_size));
	
	// background box	
	send(rect(1,1, x_size, y_size, '#C6F1C7', '#C6F1C7'));
	
	// chart container box
	send(rect(pad,pad, x_size-(2*pad), y_size-(2*pad), 'black','white'));

	// draw labels and grid
	var y_base = y_size - pad;
	var lastx = 0;
	var lasty = 0;
	for(var i=0; i<count; i++) {
		var x = pad+Math.round(i*in_x_scale);
		if (i==0 || x-lastx > (30+12*level)) {
			send(line(x, y_base+(pad/2), x, pad,'gray'));
			send(text(x+3, y_base + (pad/2), labels[i]));
			lastx = x;
		}	
		var y = Math.round(y_base - ( (values[i]-y_min) * in_y_scale));
		if (i==0 || lasty-y > 15) {
			send(line(5, y, pad+in_width, y,'gray'));
			send(text(5, y-2, values[i]));
			lasty = y;
		}
	}
	// draw the actual graph
	send('<polyline style="stroke:black; stroke-width: '+ (4-level) +'; fill: none;" points="');
	for(var i=0; i<count; i++) {
		if (i>0) send(',\n');
		var x = pad+Math.round(i*in_x_scale);
		var y = Math.round(y_base - ( (values[i]-y_min) * in_y_scale));
		send( x + ' ' + y);
	}
	send('"/>');
	
	send('</svg>');
}