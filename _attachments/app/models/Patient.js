 var Patient = Backbone.Model.extend({
    initialize : function(){
    	console.log("init Patient: ");
    	this.records =  new PatientRecordList;
    	//this.Records = new PatientRecordList;
//      if(!this.get("date")){
//        this.set({"date": new Date().getTime()});
//      }
    },
    
  });
 //patient = new Patient();