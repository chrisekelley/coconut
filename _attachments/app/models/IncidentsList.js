var IncidentsList = Backbone.Collection.extend({
	initialize: function() {
		//_.bindAll(this, 'parse', 'url', 'pageInfo', 'nextPage', 'previousPage');
		//_.bindAll(this, 'url');
		this.page = 1;
	},
	db : {
		//view: "byPatientSorted?limit=15",
		view: "byId",
		//changes : true,
	},
	url : "/incident",
	model : Incident
});