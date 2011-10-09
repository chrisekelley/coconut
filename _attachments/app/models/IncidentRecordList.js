var IncidentRecordList = Backbone.Collection.extend({
    model : Record,
	initialize: function() {
		return this;
	}, 
    db : {
		view : "byParentId",
		//changes : true,
		//keys : ["6857e31aa71f998c907d57b25e199cf2"]
	},
	url : "/incident-records",
    });