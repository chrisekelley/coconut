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

        ct = 0
        opts = { success : function(){ ct++; if(ct == 5){ start(); } }, error : function(){ alert("could no create a test doc"); }};
        db.saveDoc(ddoc, opts);
        db.saveDoc(test_doc_1, opts);
        db.saveDoc(test_doc_2, opts);
        db.saveDoc(test_doc_3, opts);
        db.saveDoc(test_doc_4, opts);
        db.saveDoc(test_doc_5, opts);
        db.saveDoc(test_doc_6, opts);
        db.saveDoc(test_doc_7, opts);
      },
      error : function(){
        stop();
        alert("could not create db: " + Backbone.couch_connector.config.db_name + "; please delete it manually.");
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

asyncTest("read collection" , function(){
  var Patient = Backbone.Model.extend({
    __testing : function(){}
  });
	var PatientsList = Backbone.Collection.extend({
	  db : {
	    changes : false
	  },
		url : "/patients",
		model : Patient
	});
	var Patients = new PatientsList();
	Patients.fetch({
	  success : function(){
      equals(Patients.length, 4, "Collection contains the right amount of docs after fetching");
      notEqual(Patients.get("test_id_1"), undefined, "Element that had an _id before is also in Collection");
      notEqual(Patients.get("test_id_1").__testing, undefined, "Element has the right type");
	    start();
	  }
	});
	
});

asyncTest("read collection with custom view" , function(){
	var PatientsList = Backbone.Collection.extend({
	  db : {
	    view : "testView",
	    changes : false,
	    keys : null
	  },
		url : "/patients"
	});
	var Patients = new PatientsList();
	Patients.fetch({
	  success : function(){
		  //log.console("Patients: " + JSON.stringify(Patients));
      equals(Patients.length, 2, "Collection contains the right amount of docs after fetching" + JSON.stringify(Patients));
	    start();
	  },
	  error : function(){
	    console.log("error", arguments);
	  }
	});
});

asyncTest("read collection with custom view and custom keys" , function(){
	var PatientsList = Backbone.Collection.extend({
	  db : {
	    view : "testView",
	    changes : false,
	    keys : ["test4"]
	  },
		url : "/patients"
	});
	var Patients = new PatientsList();
	Patients.fetch({
	  success : function(){
      equals(Patients.length, 1, "Collection contains the right amount of docs after fetching:" + JSON.stringify(Patients));
	    start();
	  },
	  error : function(){
	    console.log("error");
	  }
	});
});

asyncTest("read collection with byPatientId view and custom keys" , function(){
	var PatientsList = Backbone.Collection.extend({
		db : {
			view : "byPatientId",
			changes : false,
			keys : ["test_id_1"]
		},
		url : "/patients"
	});
	var Patients = new PatientsList();
	Patients.fetch({
		success : function(){
			equals(Patients.length, 2, "Collection contains the right amount of docs after fetching:" + JSON.stringify(Patients));
			start();
		},
		error : function(){
			console.log("error");
		}
	});
});

asyncTest("read collection using PatientRecordList." , function(){
	var query = "test_id_1";
	patient = new Patient({_id: query});
	patient.fetch( {
		success: function(model){
			patient.Records = new PatientRecordList();
			patient.Records.db["keys"] = [query];
			patient.Records.fetch({
			success : function(){
				//console.log("Records:" + JSON.stringify(patient.Records));
				//(new PatientRecordView({model: patient})).render(); 
				equals(patient.Records.length, 2, "Collection contains the right amount of docs after fetching:" + JSON.stringify(patient.Records));
				start();
			},
			error : function(){
				console.log("error");
			}
			});
		}
	});
});

asyncTest("read collection in View." , function(){
	window.FormView = Backbone.View.extend({
		  el: $("body"),
		  //el: $(".twocols"),
		  template: loadTemplate("form.template.html"),
		  initialize: function (){
			  var col = this.model.collection;
			  var registration = new Form({_id: "PatientRegistration", formCollection: "patients"});
			  registration.fetch({
	        		success: function(registration){	
	        			//(new FormView({model: registration})).render(); 
	        			this.model = registration;
	        			col.put(registration);
	        		}
	        	});
	        	this.docket = new Form({_id: "ArrestDocket", formCollection: "arrestDockets", patientId: query});
	        	docket.fetch({
	        		success: function(docket){	
	        			//(new FormView({model: registration})).render(); 
	        			this.model = docket;
	        			col.put(registration);
	        		}
	        	});

			  //var nextModel = col.at( col.indexOf(this.model) + 1);
			  
		    //this.model.bind("saveRecord", this.model);
		    return this;
		  },
	});
	var view = new FormView();
	var thisCol = view.model.collection;
	riconsole.log("view:: " + view + "; model: " + JSON.stngify(view.model));
	thisCol.each(function(model) {
		console.log(" this model: " + JSON.stngify(model));
	});
});

asyncTest("read model", function(){
  var Patient = Backbone.Model.extend({});
  
  mymodel = new Patient({
    _id : "test_id_1"
  });
  mymodel.fetch({
    success : function(){
      equals(mymodel.id, "test_id_1", "Model has the same id after fetching it");
      equals(mymodel.get('surname'), "user1", "Model has a certain body field");
      start();
    },
    error : function(){
      alert("Model could not be fetched");
    }
  });
  
  broken_model = new Patient();
  raises(function(){
    broken_model.fetch();
  }, "throws error when model has no id property");
});

asyncTest("create model", function(){
  var Patient = Backbone.Model.extend({});
	
  mymodel = new Patient({
    body : "I'm new",
    random : "string"
  });
  
  mymodel.url = "";
  
  mymodel.save({},{
    success : function(model){
      notEqual(model.id, undefined, "The model shoud have an id");
      notEqual(model.toJSON()._id, undefined, "The model shoud have an _id when converted to JSON");
      notEqual(model.toJSON()._rev, undefined, "The model shoud have a _rev field");
      start();
    },
    error : function(){
      console.log("in err cb", arguments);
    }
  });
});

asyncTest("update model", function(){
  var Patient = Backbone.Model.extend({});
  
  mymodel = new Patient({
    _id : "test_id_1"
  });
  
  mymodel.url = "";
  
  var changed_text = "I've changed!!!";
  
  mymodel.fetch({
    success : function(){
      mymodel.set({text : changed_text});
      var the_rev = mymodel.get('_rev');
      mymodel.save({},{
        success : function(){
          var new_model = new Patient({
            _id : "test_id_1"
          });
          new_model.fetch({
            success: function(){
             start();
             equals(new_model.get('text'), changed_text, "The new text should have been saved to the model");
             notEqual(new_model.get('_rev'), the_rev, "The _rev attribute should have changed");
            }
          });
        },
        error : function(){}
      })
    },
    error : function(){
      alert("Model could not be fetched");
    }
  });
});

asyncTest("delete model", function(){
  var Patient = Backbone.Model.extend({});
  
  mymodel = new Patient({
    _id : "test_id_1"
  });
  mymodel.fetch({
    success : function(){
      mymodel.destroy({
        success : function(){
          mymodel.fetch({
            success : function(){
              start();
              ok(false, "Model has not been deleted in the DB");
            },
            error : function(){
              start();
              ok(true, "Model has been deleted and could not get retrieved again.")
            }
          });
        },
        error : function(){
          start();
          ok(false, "Model could not be deleted from the DB")
        }
      });
    },
    error : function(){
      ok(false, "error retrieving the model");
      start();
    }
  });
});

QUnit.done = function(){
  console.log("done")
};