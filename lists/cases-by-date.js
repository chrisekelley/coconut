function(head, req) {	 
	 start({
		    "headers": {
		      "Content-Type": "text/html"
		     }
		  });
		  // build up the data in memory
		  while(row = getRow()) {
		    data.push(row.value);
		  }
	 
	 
	//var data = [4, 8, 15, 16, 23, 42];
	var values = [];
	var count = 0;
	while(row = getRow()) {		
		var value = row.value;
		values[count] = value;
		count++;
	}
	
	 var chart = d3.select("body")
	    .append("svg:svg")
	      .attr("class", "chart")
	      .attr("width", 420)
	     .attr("height", 20 * data.length);
	 
	 var x = d3.scale.linear()
	      .domain([0, d3.max(data)])
	      .range([0, 420]);
	 var y = d3.scale.ordinal()
	      .domain(data)
	      .rangeBands([0, 120]);
	 
	 chart.selectAll("text")
	      .data(data)
	    .enter().append("svg:text")
	      .attr("x", x)
	      .attr("y", function(d) { return y(d) + y.rangeBand() / 2; })
	      .attr("dx", -3) // padding-right
	     .attr("dy", ".35em") // vertical-align: middle
	      .attr("text-anchor", "end") // text-align: right
	     .text(String);

	 send('</svg>');
}