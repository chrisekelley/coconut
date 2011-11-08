// kudos: http://mbostock.github.com/d3/tutorial/bar-1.html
	 //$db.view("byResolved?group_level=2", {
function simpleBarCharts() {
	$.couch.db(Backbone.couch_connector.config.db_name).view("coconut/byTotalResolved", {
		'reduce':true,
		'group_level':2,
		success: function(resolvedData) {
					//var element = $("#chartimg");
					var values = [];
					var labels = [];
					var indices = [];
					for (i in resolvedData.rows) {
						//console.log(resolvedData.rows[i].key.join('-') + ": " + "resolvedData.rows[i].value: " + JSON.stringify(resolvedData.rows[i].value));
						values.push(resolvedData.rows[i].value);
						//values.push(data.rows[i].value.resolved);
						labels.push(resolvedData.rows[i].key.join('-'));
						indices.push(i);
					}
//					console.log("labels: " + JSON.stringify(labels));
//					console.log("values: " + JSON.stringify(values));
//					console.log("indices: " + JSON.stringify(indices));

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
						//console.log(countData.rows[i].key.join('-') + ": " + "countData.rows[i].value: " + JSON.stringify(countData.rows[i].value));
						values.push(countData.rows[i].value);
						//values.push(data.rows[i].value.resolved);
						labels.push(countData.rows[i].key.join('-'));
						indices.push(i);
					}
//					console.log("labels: " + JSON.stringify(labels));
//					console.log("values: " + JSON.stringify(counts));
//					console.log("indices: " + JSON.stringify(indices));
					
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

function bulletChart(departmentReport) {

			//console.log("departmentReport: " + JSON.stringify(departmentReport));
			var w = 960,
			h = 50,
			m = [5, 40, 20, 120]; // top right bottom left

			var chart = d3.chart.bullet()
			.width(w - m[1] - m[3])
			.height(h - m[0] - m[2]);

			d3.json("app/bullets.json", function(data) {

				for (i in data) {
					var item = data[i];
					//console.log("item: " + JSON.stringify(item));

					if (item.title === "Health") {
						//console.log("*** item ***: "+ JSON.stringify(item));
						item["measures"] = [departmentReport.health, departmentReport.health];
						item["markers"] = departmentReport.health;
						item["subtitle"] = departmentReport.health + " cases";
					} else if (item.title === "Education") {
						//console.log("*** item ***: "+ JSON.stringify(item));
						item["measures"] = [departmentReport.education, departmentReport.education];
						item["markers"] = departmentReport.education;
						item["subtitle"] = departmentReport.education + " cases";
					}  else if (item.title === "Works") {
						//console.log("*** item ***: "+ JSON.stringify(item));
						item["measures"] = [departmentReport.works, departmentReport.works];
						item["markers"] = departmentReport.works;
						item["subtitle"] = departmentReport.works + " cases";
					}   else if (item.title === "Other") {
						//console.log("*** item ***: "+ JSON.stringify(item));
						item["measures"] = [departmentReport.other, departmentReport.other];
						item["markers"] = departmentReport.other;
						item["subtitle"] = departmentReport.other + " cases";
					}
				}
				//console.log("data: " + JSON.stringify(data));
				$('#bulletChart').empty();
				//d3.select("#bulletChart").empty();
				console.log("d3.select bulletChart: " + d3.select("#bulletChart").html());

				var vis = d3.select("#bulletChart").selectAll("svg")
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