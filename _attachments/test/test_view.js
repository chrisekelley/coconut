QUnit.begin = function(){
  Backbone.couch_connector.config.db_name = "coconut_test_db";
  Backbone.couch_connector.config.ddoc_name = "backbone_connector_test";
  Backbone.couch_connector.config.global_changes = false;
};

module("helpers");
  test("creates a proper db object", function(){
  ok(true);
});

module("db relevant", {
  setup : function(){
    stop();
    db = $.couch.db(Backbone.couch_connector.config.db_name);
	console.log("Creating db:" + Backbone.couch_connector.config.db_name);
    db.create({
      success : function(){
	console.log("success, moving on...");
        var ddoc = {
           "_id": "_design/backbone_connector_test",
           "language": "javascript",
           "views": {
               "byCollection": {
                   "map": "function(doc) {\n  if (doc.collection) {\n    emit(doc.collection, doc);\n  }\n};"
               },
               "testView": {
                    "map": "function(doc) {\n  if (doc.patientId && doc.patientId == 'test_id_1') {\n    emit(doc.mambo, doc);\n  }\n};"
                },
               "byPatientId": {
            	   "map": "function(doc) {\n  if(doc.patientId) {\n    emit(doc.patientId, doc);\n  }\n};"
               }
           }
        };
        var test_doc_1 = { _id : "test_id_1", collection: "patients",  forenames: "test1", middle_name : "t", surname : "user1"  };
        var test_doc_2 = { _id : "test_id_2", collection: "patients",  forenames: "test2", middle_name : "t", surname : "user"  };
        var test_doc_3 = { _id : "test_id_3", collection: "patients",  forenames: "test3", middle_name : "t", surname : "user"  };
        var test_doc_4 = { _id : "test_id_4", collection: "patients",  forenames: "test4", middle_name : "t", surname : "user"  };
        var test_doc_5 = { _id : "test_id_5", collection: "arrestDockets", mambo: "test4",  patientId: "test_id_1", date_of_arrest : "6/5/2011", not_leave_country : "1"  };
        var test_doc_6 = { _id : "test_id_6", collection: "arrestDockets", mambo: "test5",  patientId: "test_id_2", date_of_arrest : "9/4/2011", not_leave_country : "1"  };
        var test_doc_7 = { _id : "test_id_7", collection: "medical", mambo: "test6",  patientId: "test_id_1", colour : "blue"  };
        var arrestDoc = { 	 "_id": "ArrestDocket", 	  "label": "Arrest Docket", 	 "formCollection": "arrestDockets", 	"form_elements": [ 		{ 			"label": "BEGIN TABLE ", 			"value": "", 			"options": [ 				{ 					"name": "optional", 					"value": "true" 				} 			], 			"datatype": "display", 			"visible": "true", 			"closeRow": "false", 			"colspan": "0", 			"size": "0", 			"rows": "0", 			"cols": "4", 			"identifier": "field1427", 			"inputType": "display-tbl-begin" 		}, 		{ 			"label": "Arrest Details", 			"value": "", 			"options": [ 				{ 					"name": "optional", 					"value": "true" 				} 			], 			"datatype": "display", 			"visible": "true", 			"closeRow": "false", 			"colspan": "0", 			"size": "0", 			"rows": "0", 			"cols": "0", 			"identifier": "arrest_details_section", 			"inputType": "display-header" 		}, 		{ 			"label": "Date of Arrest", 			"value": "", 			"options": [ 				{ 					"name": "optional", 					"value": "true" 				} 			], 			"datatype": "DateTime", 			"visible": "true", 			"closeRow": "false", 			"colspan": "0", 			"size": "0", 			"rows": "0", 			"cols": "0", 			"identifier": "date_of_arrest", 			"inputType": "emptyDate" 		}, 		{ 			"label": "C.A.S.", 			"value": "", 			"options": [ 				 {               "name": "absolute-max",               "value": "130"             }, {               "name": "absolute-min",               "value": "0"             }, {               "name": "max",               "value": "95"             } 			], 			"datatype": "number", 			"visible": "true", 			"closeRow": "false", 			"colspan": "1", 			"size": "0", 			"rows": "0", 			"cols": "0", 			"identifier": "cas", 			"inputType": "text" 		}, 		{ 			"label": "END TABLE", 			"value": "", 			"options": [ 				{ 					"name": "optional", 					"value": "true" 				} 			], 			"datatype": "display", 			"visible": "true", 			"closeRow": "false", 			"colspan": "null", 			"size": "null", 			"rows": "null", 			"cols": "null", 			"identifier": "field1428", 			"inputType": "display-tbl-end" 		} 	] } ;
        var patReg = {     "_id": "PatientRegistration",     "label": "Patient Registration",     "formCollection": "patients",     "form_elements": [         {             "label": "BEGIN GENERAL TABLE",             "value": "",             "options": [                 {                     "name": "optional",                     "value": "true"                 }             ],             "datatype": "display",             "visible": "true",             "closeRow": "false",             "colspan": "0",             "size": "0",             "rows": "0",             "cols": "3",             "identifier": "field1403",             "inputType": "display-tbl-begin"         },         {             "label": "Personal Data",             "value": "",             "options": [                 {                     "name": "optional",                     "value": "true"                 }             ],             "datatype": "display",             "visible": "true",             "closeRow": "true",             "colspan": "4",             "size": "0",             "rows": "0",             "cols": "0",             "identifier": "general_info",             "inputType": "display-header"         },         {             "label": "First Name",             "value": "",             "options": [                 {                     "name": "optional",                     "value": "false"                 }             ],             "datatype": "string",             "visible": "true",             "closeRow": "false",             "colspan": "1",             "size": "30",             "rows": "0",             "cols": "0",             "identifier": "forenames",             "inputType": "text"         },         {             "label": "Middle Name",             "value": "",             "options": [                 {                     "name": "optional",                     "value": "true"                 }             ],             "datatype": "string",             "visible": "true",             "closeRow": "false",             "colspan": "1",             "size": "30",             "rows": "0",             "cols": "0",             "identifier": "middle_name",             "inputType": "text"         },         {             "label": "Surname",             "value": "",             "options": [                 {                     "name": "optional",                     "value": "false"                 }             ],             "datatype": "string",             "visible": "true",             "closeRow": "true",             "colspan": "1",             "size": "30",             "rows": "0",             "cols": "0",             "identifier": "surname",             "inputType": "text"         }, 		{ 			"label": "END CONTACTS TABLE", 			"value": "", 			"options": [ 				{ 					"name": "optional", 					"value": "true" 				} 			], 			"datatype": "display", 			"visible": "true", 			"closeRow": "false", 			"colspan": "0", 			"size": "0", 			"rows": "0", 			"cols": "0", 			"identifier": "field1456", 			"inputType": "display-tbl-end" 		}     ] };
        ct = 0
        opts = { success : function(){ ct++; if(ct == 5){ start(); } }, error : function(){ alert("could not create a test doc"); }};
        db.saveDoc(ddoc, opts);
        db.saveDoc(test_doc_1, opts);
        db.saveDoc(test_doc_2, opts);
        db.saveDoc(test_doc_3, opts);
        db.saveDoc(test_doc_4, opts);
        db.saveDoc(test_doc_5, opts);
        db.saveDoc(test_doc_6, opts);
        db.saveDoc(test_doc_7, opts);
        db.saveDoc(arrestDoc, opts);
        db.saveDoc(patReg, opts);
//        console.log("saving PatientRegistration: ");
//        opts = { success : function(){ ct++; if(ct == 5){ start(); } }, error : function(){ alert("could not create a PatientRegistration test doc"); }};
//        jQuery.getJSON("PatientRegistration.json", function(json) {
//        	   //console.log("patientRegistration: " + JSON.stringify(json));
//        	   db.saveDoc(json, opts);
//        	   console.log("PatientRegistration saved");
//        });
//        opts = { success : function(){ ct++; if(ct == 5){ start(); } }, error : function(){ alert("could not create a ArrestDocket test doc"); }};
//        console.log("saving ArrestDocket: ");
//        jQuery.getJSON("ArrestDocket.json", function(json) {
//     	   //console.log("ArrestDocket: " + JSON.stringify(json));
//    	   db.saveDoc(json, opts);
//    	   console.log("ArrestDocket saved");
//        });
      },
      error : function(){
        stop();
        alert("could not create db: " + Backbone.couch_connector.config.db_name + "; please delete it manually. Also: You may need to login as admin in Futon.");
      }
    });
  },
  teardown : function(){
    stop();
    $.couch.db(Backbone.couch_connector.config.db_name).drop({
      success : function(){
        start();
      },
      error : function(){
        alert("could not delete testdb, please delete it manually");
      }
    });
  }
});
console.log("about to run the test.: ");
asyncTest("read collection in View." , function(){
	var FormView = Backbone.View.extend({
		  el: $("body"),
		  //el: $(".twocols"),
		  //template: loadTemplate("form.template.html"),
		  initialize: function (){
			  
			  var registration = new Form({_id: "PatientRegistration", formCollection: "patients"});
			  registration.fetch({
	        		success: function(registration){
	        			this.model = registration;
	        			var col = this.model.collection;
	        			console.log("registration: " + JSON.stringify(registration));
	        			col.put(registration);
	        		}
	        	});
	        	var docket = new Form({_id: "ArrestDocket", formCollection: "arrestDockets"});
	        	docket.fetch({
	        		success: function(docket){	
	        			this.model = docket;
	        			var col = this.model.collection;
	        			console.log("docket: " + JSON.stringify(docket));
	        			col.put(docket);
	        		}
	        	});

			  //var nextModel = col.at( col.indexOf(this.model) + 1);
			  
		    //this.model.bind("saveRecord", this.model);
		    return this;
		  },
	});
	var registration = new Form({_id: "PatientRegistration", formCollection: "patients"});
	  registration.fetch({
  		success: function(registration){
  			var view = new FormView({model: registration});
  			view.model = registration;
  			var col = view.model.collection;
  			console.log("registration again: " + JSON.stringify(registration));
  			col.put(registration);
  			equals(col.length, 3, "Collection contains the right amount of docs after fetching");
  			col.each(function(model) {
 				console.log(" this model: " + JSON.stngify(model));
  			});
  		}
  	});
//	var view = new FormView({model: registration});
//	var thisCol = view.model.collection;
//	console.log("view:: " + view + "; model: " + JSON.stringify(view.model));
//	thisCol.each(function(model) {
//		console.log(" this model: " + JSON.stngify(model));
//	});
});


QUnit.done = function(){
  console.log("tests complete.")
};