// kudos: http://mbostock.github.com/d3/tutorial/bar-1.html
	 //$db.view("byResolved?group_level=2", {
function rendercharts() {
	$.couch.db(Backbone.couch_connector.config.db_name).view("coconut/byTotalResolved", {
		'reduce':true,
		'group_level':2,
		success: function(resolvedData) {
					//var element = $("#chartimg");
					var values = [];
					var labels = [];
					var indices = [];
					for (i in resolvedData.rows) {
						console.log(resolvedData.rows[i].key.join('-') + ": " + "resolvedData.rows[i].value: " + JSON.stringify(resolvedData.rows[i].value));
						values.push(resolvedData.rows[i].value);
						//values.push(data.rows[i].value.resolved);
						labels.push(resolvedData.rows[i].key.join('-'));
						indices.push(i);
					}
					console.log("labels: " + JSON.stringify(labels));
					console.log("values: " + JSON.stringify(values));
					console.log("indices: " + JSON.stringify(indices));

					var chart = d3.select("#chart1")
					.append("svg:svg")
					.attr("class", "chart")
					.attr("width", 420)
					.attr("height", 25 * values.length)
					.append("svg:g")
					.attr("transform", "translate(10,15)");

					var x = d3.scale.linear()
					.domain([0, d3.max(values)])
					.range([0, 420]);

//					var y = d3.scale.ordinal()
//					.domain(labels)
//					.rangeBands([0, 120]);

					chart.selectAll("rect")
					.data(values)
					.enter().append("svg:rect")
					//.attr("y", y)
					.attr("y", function(d, i) { return i * 20; })
					.attr("width", x)
					//.attr("height", y.rangeBand());
					.attr("height", 20);

					chart.selectAll("line")
					.data(x.ticks(10))
					.enter().append("svg:line")
					.attr("x1", x)
					.attr("x2", x)
					.attr("y1", 0)
					.attr("y2", 200)
					.attr("stroke", "#ccc");

					chart.selectAll("text")
					.data(values)
					.enter().append("svg:text")
					.attr("x", x)
					//.attr("y", function(d) { return y(d) + y.rangeBand() / 2; })
					.attr("y", function(d, i) { return i * 20; })
					.attr("dx", -40) // padding-right
					.attr("dy", ".95em") // vertical-align: middle
					.attr("text-anchor", "end") // text-align: right
					.text(String);

					chart.selectAll("label")
					.data(labels)
					.enter().append("svg:text")
					.attr("x", x)
					//.attr("y", function(d) { return y(d) + y.rangeBand() / 2; })
					.attr("y", function(d, i) { return i * 20; })
					.attr("dx", 5) // padding-right
					.attr("dy", ".99em") // vertical-align: middle
					.attr("text-anchor", "start") // text-align: right
					.text(String);

					chart.selectAll("text.rule")
					.data(x.ticks(10))
					.enter().append("svg:text")
					.attr("class", "rule")
					.attr("x", x)
					.attr("y", 0)
					.attr("dy", -3)
					.attr("text-anchor", "middle")
					.text(String);

					chart.append("svg:line")
					.attr("y1", 0)
					.attr("y2", 200)
					.attr("stroke", "#000");
				}
			}
			);
			$.couch.db(Backbone.couch_connector.config.db_name).view("coconut/byCountResolved", {
				'reduce':true,
				'group_level':2,
				success: function(countData) {
					
					//var element = $("#chartimg");
					var values = [];
					var labels = [];
					var indices = [];
					var counts = [];
					for (i in countData.rows) {
						console.log(countData.rows[i].key.join('-') + ": " + "countData.rows[i].value: " + JSON.stringify(countData.rows[i].value));
						values.push(countData.rows[i].value);
						//values.push(data.rows[i].value.resolved);
						labels.push(countData.rows[i].key.join('-'));
						indices.push(i);
					}
					console.log("labels: " + JSON.stringify(labels));
					console.log("values: " + JSON.stringify(counts));
					console.log("indices: " + JSON.stringify(indices));
					
					var chart = d3.select("#chart2")
					.append("svg:svg")
					.attr("class", "chart")
					.attr("width", 440)
					.attr("height", 25 * values.length)
					.append("svg:g")
					.attr("transform", "translate(10,15)");
					
					var x = d3.scale.linear()
					.domain([0, d3.max(values)])
					.range([0, 420]);
					
//					var y = d3.scale.ordinal()
//					.domain(labels)
//					.rangeBands([0, 120]);
					
					chart.selectAll("rect")
					.data(values)
					.enter().append("svg:rect")
					//.attr("y", y)
					.attr("y", function(d, i) { return i * 20; })
					.attr("width", x)
					//.attr("height", y.rangeBand());
					.attr("height", 20);
					
					chart.selectAll("line")
					.data(x.ticks(10))
					.enter().append("svg:line")
					.attr("x1", x)
					.attr("x2", x)
					.attr("y1", 0)
					.attr("y2", 200)
					.attr("stroke", "#ccc");
					
					chart.selectAll("text")
					.data(values)
					.enter().append("svg:text")
					.attr("x", x)
					//.attr("y", function(d) { return y(d) + y.rangeBand() / 2; })
					.attr("y", function(d, i) { return i * 20; })
					.attr("dx", -40) // padding-right
					.attr("dy", ".95em") // vertical-align: middle
					.attr("text-anchor", "end") // text-align: right
					.text(String);
					
					chart.selectAll("label")
					.data(labels)
					.enter().append("svg:text")
					.attr("x", x)
					//.attr("y", function(d) { return y(d) + y.rangeBand() / 2; })
					.attr("y", function(d, i) { return i * 20; })
					.attr("dx", 5) // padding-right
					.attr("dy", ".99em") // vertical-align: middle
					.attr("text-anchor", "start") // text-align: right
					.text(String);
					
					chart.selectAll("text.rule")
					.data(x.ticks(10))
					.enter().append("svg:text")
					.attr("class", "rule")
					.attr("x", x)
					.attr("y", 0)
					.attr("dy", -3)
					.attr("text-anchor", "middle")
					.text(String);
					
					chart.append("svg:line")
					.attr("y1", 0)
					.attr("y2", 200)
					.attr("stroke", "#000");
				}
			}
			);
}	

//FORMY.reports.departments = departmentReport;

function bulletChart(values) {


			console.log("values: " + values);
			var w = 960,
			h = 50,
			m = [5, 40, 20, 120]; // top right bottom left

			var chart = d3.chart.bullet()
			.width(w - m[1] - m[3])
			.height(h - m[0] - m[2]);

			d3.json("app/bullets.json", function(data) {

				for (i in data) {
					var item = data[i];
					console.log("item: " + JSON.stringify(item));

					if (item.title === "Education") {
						console.log("*** item ***: "+ JSON.stringify(item));
						item["measures"] = values;
					}
					
				}
				console.log("data: " + JSON.stringify(data));

				var vis = d3.select("#chart3").selectAll("svg")
				.data(data)
				.enter().append("svg:svg")
				.attr("class", "bullet")
				.attr("width", w)
				.attr("height", h)
				.append("svg:g")
				.attr("transform", "translate(" + m[3] + "," + m[0] + ")")
				.call(chart);

				var title = vis.append("svg:g")
				.attr("text-anchor", "end")
				.attr("transform", "translate(-6," + (h - m[0] - m[2]) / 2 + ")");

				title.append("svg:text")
				.attr("class", "title")
				.text(function(d) { return d.title; });

				title.append("svg:text")
				.attr("class", "subtitle")
				.attr("dy", "1em")
				.text(function(d) { return d.subtitle; });

				chart.duration(1000);
				window.transition = function() {
					vis.map(randomize).call(chart);
				};
			});

			function randomize(d) {
				if (!d.randomizer) d.randomizer = randomizer(d);
				d.ranges = d.ranges.map(d.randomizer);
				d.markers = d.markers.map(d.randomizer);
				d.measures = d.measures.map(d.randomizer);
				return d;
			}

			function randomizer(d) {
				var k = d3.max(d.ranges) * .2;
				return function(d) {
					return Math.max(0, d + k * (Math.random() - .5));
				};
			}
}
			
			// http://mbostock.github.com/d3/ex/population.html
			function unusedBullet() {
				
				$.couch.db(Backbone.couch_connector.config.db_name).view("coconut/byDepartmentEducation", {
					'reduce':true,
					'group_level':2,
					success: function(countData) {
						
						//var element = $("#chartimg");
						var values = [];
						var labels = [];
						var indices = [];
						var months = [];
						//var counts = [];
						for (i in countData.rows) {
							console.log(countData.rows[i].key.join('-') + ": " + "countData.rows[i].value: " + JSON.stringify(countData.rows[i].value));
							values.push(countData.rows[i].value);
							//values.push(data.rows[i].value.resolved);
							labels.push(countData.rows[i].key.join('-'));
							var month = parseInt(countData.rows[i].key[1], 10);
							months.push(month);
							indices.push(i);
						}
						console.log("labels: " + JSON.stringify(labels));
						console.log("values: " + JSON.stringify(values));
						console.log("months: " + JSON.stringify(months));
						console.log("indices: " + JSON.stringify(indices));
						
						//var chart = d3.select("#chart3")
					
				 var w = 660,
			     h = 400,
			     x = d3.scale.linear().range([0, w]),
			     y = d3.scale.linear().range([0, h - 40]);
			 
			 // An SVG element with a bottom-right origin.
			 var svg = d3.select("#chart3").append("svg:svg")
			 .attr("width", w)
			 .attr("height", h)
			 .style("padding-right", "30px")
			 .append("svg:g")
			 .attr("transform", "translate(" + x(1) + "," + (h - 20) + ")scale(-1,-1)");

			 // A sliding container to hold the bars.
			 var body = svg.append("svg:g")
			     .attr("transform", "translate(0,0)");
			 
			 // A container to hold the y-axis rules.
			 var rules = svg.append("svg:g");
			 
			 // A label for the current year.
			 var title = svg.append("svg:text")
			     .attr("class", "title")
			     .attr("dy", ".71em")
			     .attr("transform", "translate(" + x(1) + "," + y(1) + ")scale(-1,-1)")
			     .text(2000);
			 
			 //d3.csv("population.csv", function(data) {
			 
//			   // Convert strings to numbers.
//			   data.forEach(function(d) {
//			     d.people = +d.people;
//			     d.year = +d.year;
//			     d.age = +d.age;
//			   });
//			 
//			   // Compute the extent of the data set in age and years.
			   var age0 = 0,
			      // age1 = d3.max(values, function(d) { return d.age; }),
			       age1 = d3.max(months),
			       //year0 = d3.min(data, function(d) { return d.year; }),
			       year0 = d3.min(months),
			       //year1 = d3.max(data, function(d) { return d.year; }),
			       year1 = d3.max(months),
			       year = year1;
			   console.log("age1: " + age1 + " year0: " + year0 + " year 1: " + year1);
			 
//			   // Update the scale domains.
			   //x.domain([0, age1 + 5]);
			   x.domain([0, age1]);
			   //y.domain([0, d3.max(data, function(d) { return d.people; })]);
			   y.domain([0, d3.max(values)]);
			 
//			   // Add rules to show the population values.
			   rules = rules.selectAll(".rule")
			       .data(y.ticks(10))
			     .enter().append("svg:g")
			       .attr("class", "rule")
			       .attr("transform", function(d) { return "translate(0," + y(d) + ")"; });
			 
			   rules.append("svg:line")
			       .attr("x2", w);
			 
			   rules.append("svg:text")
			       .attr("x", 6)
			       .attr("dy", ".35em")
			       .attr("transform", "rotate(180)")
			       .text(function(d) { return Math.round(d / 1e6) + "M"; });
			 
//			   // Add labeled rects for each birthyear.
			   var years = body.selectAll("g")
			       //.data(d3.range(year0 - age1, year1 + 5, 5))
			       .data(d3.range(year0, year1, 1))
			       .enter().append("svg:g")
			       .attr("transform", function(d) { return "translate(" + x(year1 - d) + ",0)"; });
			 
			   years.selectAll("rect")
			       .data(d3.range(2))
			     .enter().append("svg:rect")
			       .attr("x", 1)
			       .attr("width", x(5) - 2)
			       .attr("height", 1e-6);
			 
			   years.append("svg:text")
			       .attr("y", -6)
			       .attr("x", -x(5) / 2)
			       .attr("transform", "rotate(180)")
			       .attr("text-anchor", "middle")
			       .style("fill", "#fff")
			       .text(String);
			 
			   // Add labels to show the age.
			   svg.append("svg:g").selectAll("text")
			       //.data(d3.range(0, age1 + 5, 5))
			       .data(d3.range(0, age1, 1))
			     .enter().append("svg:text")
			       .attr("text-anchor", "middle")
			       .attr("transform", function(d) { return "translate(" + (x(d) + x(5) / 2) + ",-4)scale(-1,-1)"; })
			       .attr("dy", ".71em")
			       .text(String);
			 
			   // Nest by year then birthyear.
			   var data = d3.nest()
			       .key(function(d) { return d.year; })
			       .key(function(d) { return d.year - d.age; })
			       //.rollup(function(v) { return v.map(function(d) { return d.people; }); })
			       .rollup(function(v) { return v.map(values); });
			       //.map(data);
			   //.map(values);
			 
			   // Allow the arrow keys to change the displayed year.
//			   d3.select(window).on("keydown", function() {
//			     switch (d3.event.keyCode) {
//			       case 37: year = Math.max(year0, year - 10); break;
//			       case 39: year = Math.min(year1, year + 10); break;
//			     }
//			     redraw();
//			   });
			 
			   //redraw();
			 
			   function redraw() {
			     //if (!(year in data)) return;
			     //title.text(year);
			     title.text("2011");
			 
			     body.transition()
			         .duration(750)
			         .attr("transform", function(d) { return "translate(" + x(year - year1) + ",0)"; });
			 
			     years.selectAll("rect")
			         .data(function(d) { return data[year][d] || [0, 0]; })
			       .transition()
			         .duration(750)
			         .attr("height", y);
			   }
			}
			}
			);
}	
	