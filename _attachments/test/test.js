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
        opts = { success : function(){ }, error : function(){ alert("could no create a test doc"); }};  
        db.saveDoc(ddoc, opts);
        //var test_doc_1 = { _id : "test_id_1", collection: "incident",  forenames: "test1", middle_name : "t", surname : "user1"  };
        var testdoc = null;
        ct = 0;
        
        function randomFromTo(from, to){
        		return Math.floor(Math.random() * (to - from + 1) + from);
        	};

        while (ct < 10) {
        	ct++;
            var subcounty=randomFromTo(1,8).toString();
            var village=randomFromTo(1,8).toString();
            var priority=randomFromTo(1,3).toString();
            var department=randomFromTo(1,6).toString();
            var created =  new Date();
            var lastModified =  created;  
            var id =  "test" + ct;  
            testdoc = { _id : id, "flowId": "300","formId": "incident","phone": "077255512"+ ct,"description": "This is a test",
            		"subcounty": subcounty,"village": village,"priority": priority,"department": department,"assignedId": ct,
            		"created": created,"lastModified": lastModified,"collection": "incident"};
            console.log("testdoc: " + JSON.stringify(testdoc));
            db.saveDoc(testdoc, opts);
          }
    	console.log("success,  created testdocs...");
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

asyncTest("read collection with custom view and custom keys" , function(){
//	var IncidentsList = Backbone.Collection.extend({
//	  db : {
//	    view : "testView",
//	    changes : false,
//	  },
//		url : "/incidents"
//	});
	
	var searchResults = new IncidentsList();
	searchResults.db["keys"] = null;
	searchResults.db["view"] = ["byIncidentSorted?descending=true&limit=15"];
	
	searchResults.fetch({
	  success : function(){
      equals(Patients.length, 10, "Collection contains the right amount of docs after fetching:" + JSON.stringify(searchResults));
	    start();
	  },
	  error : function(){
	    console.log("error");
	  }
	});
});


QUnit.done = function(){
  console.log("done")
};