var PatientsList = Backbone.Collection.extend({
	initialize: function() {
		//_.bindAll(this, 'parse', 'url', 'pageInfo', 'nextPage', 'previousPage');
		//_.bindAll(this, 'url');
		this.page = 1;
	},
	db : {
		//view: "byPatientSorted?limit=15",
		view: "byPatientSorted?descending=true&limit=15",
		//changes : true,
	},
	url : "/9",
//	url: function() {
//		//return this.base_url + '?' + $.param({page: this.page});
//		return 'patients/limit/10';
//	},
	model : Patient

});

//console.log("Populating FORMY.Patients ");