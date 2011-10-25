var ReportCollection = Backbone.Collection.extend({
	model: Report,
	//url: '/reportElements',
//	initialize: function(){
//		// Assign the Deferred issued by fetch() to the Collection
//		this.deferred = this.fetch();
//	},
	db : {
		//view: "byDepartmentEducation?reduce=true&group_level=2",
		keys: null,
	},
	parse: function(response) {
		console.log("parse:" + JSON.stringify(response));
		return response;
	},
	initialize: function(){
		// Assign the Deferred issued by fetch() to the Collection
//		console.log("ReportCollection init.");
//		this.deferred = this.fetch({
//			success : function(countData){
//				FORMY.Report = countData;
//				console.log("Report count: " + FORMY.Report.length);
//				console.log("this from ReportCollection init: " + JSON.stringify(this.deferred));
//			},
//			error : function(){
//				console.log("Error loading Report: " + arguments); 
//			}
//		});
		//console.log("ReportCollection deferred.");
		//this.deferred = this.fetch();
	}
});
