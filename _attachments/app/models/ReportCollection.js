var ReportCollection = Backbone.Collection.extend({
	model: Report,
	//url: '/reportElements',
	db : {
		//view: "byDepartmentEducation?reduce=true&group_level=2",
		keys: null,
	},
	parse: function(response) {
		//console.log("parse:" + JSON.stringify(response));
		return response;
	},
	initialize: function(){
	}
});
