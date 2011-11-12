var ReportView = Backbone.View.extend({
	//el: $("#homePageView"),
	template: loadTemplate("report.template.html"),

	initialize: function() {
		_.bindAll(this, 'addOne', 'reseted', 'render', 'search', 'orientation');
		FORMY.Incidents.bind('add',   this.addOne, this);
		//FORMY.Incidents.bind('search',   this.search, this);
		FORMY.Incidents.bind('reset', this.reseted, this);
		FORMY.Incidents.bind('all',   this.render, this);
		FORMY.Incidents.bind('change', this.search, this);
		FORMY.Incidents.bind('render', this.render, this);

		//FORMY.Incidents.fetch();
		return this;
	}, 
	addOne : function(patient){
		this.view = new SearchListItemView({model: patient});
		this.rendered = this.view.render().el;
		//console.log("add one in HomeView:" + JSON.stringify(patient));
		$("#incidents").append(this.rendered);
	},
	events: {
		"click #form-search " : "search",
		"click #form-client " : "incidentLink",
		"click #form-config " : "configLink",
		"click #form-design " : "designLink",
		"orientationEvent " : "orientation",
	},
	reseted: function() {
		console.log("reseted; Incidents count: " + FORMY.Incidents.length);
		$(this.el).html("");
		FORMY.Incidents.each(this.addOne);
	},
	remove: function() {
		console.log("remove the view in homeView");
		$(this.el).remove();
	},
	incidentLink: function() {
		FORMY.router.navigate('incident', true);
	},
	configLink: function() {
		window.location.href = '/mobilefuton/_design/mobilefuton/index.html';
	},
	designLink: function() {
		FORMY.router.navigate('design', true);
	},
	search: function(e) {
		e.preventDefault();
		console.log("Searching");
		var searchTerm =  $('#search_string').val();
		FORMY.router.navigate('search/' + searchTerm, true);
	},
	orientation: "horiz",
	//reportEducationInstance:null,
	render: function() {
//		$("#formRenderingView").remove();
//		$("#recordView").remove();
		//console.log("render in HomeView:" + JSON.stringify(this.model));
		//this.content = this.model.toJSON();
		
//		window.addEventListener(orientationEvent, function() {
//			alert('HOLY ROTATING SCREENS BATMAN:' + window.orientation + " " + screen.width);
//			}, false);
		// -90 480
	   
		if (window.orientation == -90) {
			//alert('HOLY ROTATING SCREENS BATMAN - render vertical:' + window.orientation + " screen.width: " + screen.width);
			this.orientation = "vert";
			this.template =  loadTemplate("report.template.html");
		} else {
			//alert('HOLY ROTATING SCREENS BATMAN - otherwise:' + window.orientation + " screen.width: " + screen.width);
			this.orientation = "horiz";
			this.template =  loadTemplate("report.template.html");
			//this.template =  loadTemplate("home.template.html");
		}
		
		// charts
		// Initialize the Collection
		//FORMY.departmentReportRaw = new Object({date:null,education:null,health: null,finance:null});
		console.log("running report queries.");
		var reportEducationInstance = new ReportCollection();
		reportEducationInstance.db["view"] = ["byDepartmentEducation?reduce=true&group_level=2"];
		reportEducationInstance.deferred = reportEducationInstance.fetch({
			success : function(){
			},
			error : function(){
				console.log("Error loading Report: " + arguments); 
			}
		});
		
		var reportHealthInstance = new ReportCollection();
		reportHealthInstance.db["view"] = ["byDepartmentHealth?reduce=true&group_level=2"];
		reportHealthInstance.deferred = reportHealthInstance.fetch({
			success : function(){
			},
			error : function(){
				console.log("Error loading Report: " + arguments); 
			}
		});
		
		var reportWorksInstance = new ReportCollection();
		reportWorksInstance.db["view"] = ["byDepartmentWorks?reduce=true&group_level=2"];
		reportWorksInstance.deferred = reportWorksInstance.fetch({
			success : function(){
			},
			error : function(){
				console.log("Error loading Report: " + arguments); 
			}
		});
		
		var reportOtherInstance = new ReportCollection();
		reportOtherInstance.db["view"] = ["byDepartmentOther?reduce=true&group_level=2"];
		reportOtherInstance.deferred = reportOtherInstance.fetch({
			success : function(){
			},
			error : function(){
				console.log("Error loading Report: " + arguments); 
			}
		});
		
		
		FORMY.reportEducation = reportEducationInstance;
		FORMY.reportHealth = reportHealthInstance;
		FORMY.reportWorks = reportWorksInstance;
		FORMY.reportOther = reportOtherInstance;
		
		$.when(reportEducationInstance.deferred, reportHealthInstance.deferred, 
				reportWorksInstance.deferred, reportOtherInstance.deferred)
		   .then(function(educationData, healthData, worksData, otherData){
			   
			   var departmentReport = new Object({date:null,education:null,health: null,works:null,other:null});
			   var reportDate = new Date();
			   //console.log("Generating report for: " + reportDate);
			   var education = parseData(reportDate, educationData[0]);	
			   departmentReport.education = (education > 0)?education:[0];
			   var health = parseData(reportDate, healthData[0]);
			   departmentReport.health = (health > 0)?health:[0];
			   var works = parseData(reportDate, worksData[0]);	
			   departmentReport.works = (works > 0)?works:[0];
			   var other = parseData(reportDate, otherData[0]);	
			   departmentReport.other = (other > 0)?other:[0];
			   console.log("running bulletChart. here is the stuff: " + JSON.stringify(departmentReport));
			   bulletChart(departmentReport);
			   //simpleBarCharts();
		   })
		   .fail(function(){
		      console.log( 'I fire if one or more requests failed.' );
		   });
		
//		this.options.reportCollection.deferred.done(function(countData){
////			var homeViewHtml = this.template(this.model.toJSON());
////			console.log("rendering HomeView");
////			//$(this.el).html(homeViewHtml);
////			$("#homePageView").html(homeViewHtml);
////			//if(FORMY.Incidents.length > 0){
////			FORMY.Incidents.each(this.addOne);
//			
//
//			//}
//			
//		});
		
		var homeViewHtml = this.template(this.model.toJSON());
		console.log("rendering HomeView");
		//$(this.el).html(homeViewHtml);
		$("#homePageView").html(homeViewHtml);
		//if(FORMY.Incidents.length > 0){
		FORMY.Incidents.each(this.addOne);
		
		$(".stripeMe tr").mouseover(function(){$(this).addClass("over");}).mouseout(function(){$(this).removeClass("over");});
		$(".stripeMe tr:even").addClass("alt");
		return this;
	},
});

var SearchListItemView = Backbone.View.extend({
	tagName : "tr",
	template: Handlebars.compile($("#search-template").html()),
	initialize : function(){
		//this.model.bind('change', this.render, this);
		// from backbone-couch.js chat example:
		 _.bindAll(this, 'render');
		this.model.bind('change', this.render);
	},

	render : function(){ 
		this.content = this.model.toJSON();
		this.html = this.template(this.content);
		$(this.el).html(this.html);
		//console.log("render SearchListItemView: "+ JSON.stringify(html));
		return this;
	}
});

function parseData(reportDate, data) {
	var reportYear = reportDate.getFullYear();
	var reportMonth = reportDate.getMonth() + 1;	
	var values = [];
	var labels = [];
	var indices = [];
	var months = [];

	//var counts = [];
	for (i in data.rows) {
		//console.log(data.rows[i].key.join('-') + ": " + "data.rows[i].value: " + JSON.stringify(data.rows[i].value));
		//values.push(data.rows[i].value.resolved);
		labels.push(data.rows[i].key.join('-'));
		var year = parseInt(data.rows[i].key[0], 10);
		var month = parseInt(data.rows[i].key[1], 10);
		if ((year === reportYear) && (month === reportMonth)) {
			values.push(data.rows[i].value);
		} 
		months.push(month);
		indices.push(i);
	}
//	console.log("labels: " + JSON.stringify(labels));
//	console.log("values: " + JSON.stringify(values));
//	console.log("months: " + JSON.stringify(months));
//	console.log("indices: " + JSON.stringify(indices));
	return values;
}