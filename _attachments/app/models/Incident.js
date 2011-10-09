 var Incident = Backbone.Model.extend({
    initialize : function(){
    	//console.log("init Incident: ");
    	this.records =  new IncidentRecordList;
    },
    
  });