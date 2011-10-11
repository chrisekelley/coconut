FORMY.forms = new FormCollection();
FORMY.loadForm = function(name, parentId, options) {
	options || (options = {});
	var form = new Form({_id: name});
	if (typeof FORMY.forms.get(name) === "undefined") {
		//console.log("fetching from db: " + name);
		form.fetch({
			success: function(form){
				var success = options.success;
			        if (success) {
						form.parentId = parentId;
						//console.log("form.parentId: " + parentId);
						FORMY.forms.add(form);
						//console.log("added " + name);
						success(form);
					}
				options.error = wrapError(options.error, name, options);
			},
    		error : function(){
    			console.log("Error loading Form: " + arguments); 
    		}
		});
	} else {
		form = FORMY.forms.get(name);
		form.parentId = parentId;
		console.log("fetched from FORMY: " + name + "; parentId: " + parentId);
		var success = options.success;
		if (success) {
			success(form);
		}
	}
};

// Wrap an optional error callback with a fallback error event.
// kudos: http://stackoverflow.com/questions/7090202/error-callback-always-fired-even-when-it-is-successful/7101589#7101589
var wrapError = function(onError, model, options) {
    return function(jqXHR, textStatus, errorThrown) {
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
      if (onError) {
        onError(model, jqXHR, options);
      } else {
        //model.trigger('error', model, jqXHR, options);
        var message = "Error with " + name + " resp: " + resp;
    	console.log(message);
    	alert(message);
      }
    };
  };
 
var AppRouter = Backbone.Router.extend({

        routes: {
        	"/":                 			"home",    			// #home
        	"home":                 		"home",    			// #home
        	"search/:query":        		"search",    		// #search
        	"incident":           			"incident",    		// #incident
        	"arrestDocket/:query":  		"arrestDocket",    	// #arrestDocket
        	"problem/:query":       		"problem",    		// #arrestDocket
        	"incidentRecords/:incidentId":	"incidentRecords",  // #incidentRecords
        	"edit/:recordId":          		"edit",    			// #edit
        	"record/:recordId":        		"record",    		// #record
        	"renderForm/:formId/:parentId":	"renderForm",    	// #renderForm
            "destroy/:recordId": 			"destroy",    		// #destroy
            "design": 						"design",    		// #design
            "populate": 					"populate",    		// #populate
            "*actions": 					"home", 			// matches http://example.com/#anything-here - used to point to defaultRoute
        },
        // The following route is unused.
        defaultRoute: function( actions ){
        	console.log("defaultRoute route.");
            // The variable passed in matches the variable in the route definition "actions"
        	FORMY.Incidents.fetch();
        	page = new Page({content: "Default List of Incidents:"});
        	//page = new Page({});
        	(new HomeView({model: page})).render(); 
        },
        home: function () {
        	//console.log("home route.");
        	$("#homePageView").remove();
			$("#recordView").remove();
			$("#formRenderingView").remove();
			$("#designer").remove();
			if (! $("#homePageView").length){
				var viewDiv = document.createElement("div");
				viewDiv.setAttribute("id", "homePageView");
				$("#views").append(viewDiv);
			}
    		var searchResults = new IncidentsList();
    		searchResults.db["keys"] = null;
    		searchResults.db["view"] = ["byIncidentSorted?descending=true&limit=15"];
    		searchResults.fetch({
    		success : function(){
    			FORMY.Incidents = searchResults;
    			//console.log("render; Incidents count: " + FORMY.Incidents.length);
    			var page = new Page({content: "Default List of Incidents:"});
            	(new HomeView({model: page, el: $("#homePageView")})).render();
             	//console.log("starting stripeme.");
                $(".stripeMe tr").mouseover(function(){$(this).addClass("over");}).mouseout(function(){$(this).removeClass("over");});
                $(".stripeMe tr:even").addClass("alt");
    		},
    		error : function(){
    			console.log("Error loading PatientRecordList: " + arguments); 
    		}
    		});
        },
        search: function (searchTerm) {
        	console.log("search route.");
        	$("#homePageView").remove();
			$("#recordView").remove();
			$("#formRenderingView").remove();
			if (! $("#homePageView").length){
				var viewDiv = document.createElement("div");
				viewDiv.setAttribute("id", "homePageView");
				$("#views").append(viewDiv);
			}
    		console.log("Searching for " + searchTerm);
    		var searchResults = new IncidentsList();
    		if (searchTerm !== "") {
    			//var searchInt = parseInt(searchTerm);
    			searchResults.db["keys"] = [searchTerm];
    			//searchResults.db["keys"] = {"keys": [8]};
    			//searchResults.db["view"] = ["bySurnameOrId?startkey=\"" + searchTerm + "\"&endkey=\"" + searchTerm + "\u9999\""];
    			//searchResults.db["view"] = ["byId?startkey=\"" + searchTerm + "\"&endkey=\"" + searchTerm + "Z\""];   			
    			searchResults.db["view"] = ["byId"];   			
    			//searchResults.db["view"] = ["byId?descending=true&limit=15"];   			
    		} else {
    			//console.log("This should reset the collection.");
    			searchResults.db["keys"] = null;
    			searchResults.db["view"] = ["byIncidentSorted?descending=true&limit=15"];
    		}
    		searchResults.fetch({
    		success : function(){
    			//console.log("Records:" + JSON.stringify(patient.Records));
    			//console.log("Fetching Records for:" + searchTerm);
    			//console.log("searchResults: " + JSON.stringify(searchResults));
    			FORMY.Incidents = searchResults;
    			//console.log("render; Incidents count: " + FORMY.Incidents.length);
    			var page = new Page({content: "Default List of Incidents:"});
            	(new HomeView({model: page, el: $("#homePageView")})).render();	
    		},
    		error : function(){
    			console.log("Error loading PatientRecordList: " + JSON.stringify(arguments)); 
    		}
    		});
        },
        incident: function () {
			$("#homePageView").remove();
			$("#recordView").remove();
			$("#formRenderingView").remove();
			if (! $("#formRenderingView").length){
				var viewDiv = document.createElement("div");
				viewDiv.setAttribute("id", "formRenderingView");
				$("#views").append(viewDiv);
			}
        	FORMY.loadForm("incident", null, {
        		success: function(form, resp){
        			var newModel = new Form();
        			var newPatientFormView = new FormView({model: newModel, currentForm:form, el: $("#formRenderingView")});
        			newPatientFormView.render();
        			$(document).ready(function() {
        				//$("#" + identifier).datepicker({
        				//$("#dateReported").datepicker({
        					$('.datep').each(function () {
        						//console.log("init dateppicker");
//        				        var currentYear = (new Date).getFullYear();
//        				        var minDate = getDateYymmdd($(this).data("val-rangedate-min"));
//        				        var maxDate = getDateYymmdd($(this).data("val-rangedate-max"));
        				        $(this).datepicker({
        				            dateFormat: "mm/dd/yy",  // hard-coding uk date format, but could embed this as an attribute server-side (based on the current culture)
        				            //minDate: minDate,
        				            //maxDate: maxDate,
        				            changeYear: true,
        				            //yearRange: '1900:' + currentYear,
        				            autoSize: true,
        				            // appendText: ' (mm/dd/yyyy)',
        				            buttonImage: 'images/calendar.gif',
        				            buttonImageOnly: true,
        				            constrainInput: true,
        				            showOn: 'both',
        				            //showButtonPanel: true,
        				            buttonText: 'Choose',
        				            //navigationAsDateFormat: true,
        				            //currentText: '\'Today\'',
        				            gotoCurrent: true,
        				            //onClose: function (dateText, inst) { alert(dateText); }
        						});
        				    });
        				});
        		},
        		error: function() { 
        			console.log("Error loading incident: " + arguments); 
        		}
        	});
        },
        renderForm: function (formId, parentId) {
        	$("#homePageView").remove();
        	$("#recordView").remove();
        	$("#formRenderingView").remove();
        	if (! $("#formRenderingView").length){
        		var viewDiv = document.createElement("div");
        		viewDiv.setAttribute("id", "formRenderingView");
        		$("#views").append(viewDiv);
        	}
        	FORMY.sessionRecord.fetch( {
        		success: function(model){
        			console.log("Just successfully fetched the incident.");     					
        			FORMY.loadForm(formId, parentId, {
        				success: function(form){
        					console.log("form: " + JSON.stringify(form));
//      					form.set({"patientMiddle_name": patient.get('Middle_name')});
        					form.set({"recordId": FORMY.sessionRecord.get('_id')});
        					form.set({"parentId": parentId});
        					//(new FormView({model: FORMY.sessionRecord, currentForm:form, el: $("#recordView")})).render();
        					(new FormView({model: new Form(), currentForm:form, el: $("#formRenderingView")})).render();
        				},
        				error : function(){
        					console.log("Error loading form: " + arguments); 
        				}
        			});
        		}
        	});
        },
        incidentRecords: function (incidentId) {
        	console.log("incidentRecords route.");
        	$("#homePageView").remove();
        	$("#formRenderingView").remove();
        	if (! $("#recordView").length){
        		var viewDiv = document.createElement("div");
        		viewDiv.setAttribute("id", "recordView");
        		$("#views").append(viewDiv);
        	}
        	//Set the _id and then call fetch to use the backbone connector to retrieve it from couch
        	FORMY.sessionRecord = new Incident({_id: incidentId});
        	FORMY.sessionRecord.fetch( {
        		success: function(model){
        			console.log("Just successfully fetched the incident.");
        			FORMY.sessionRecord.records = new IncidentRecordList();
        			FORMY.sessionRecord.records.db["keys"] = [incidentId];
        			FORMY.sessionRecord.records.fetch({
        			success : function(){
        				//console.log("Records:" + JSON.stringify(patient.Records));
        				console.log("Fetching Records for :" + incidentId);
        				//(new IncidentView({model: FORMY.sessionRecord})).render();
						//(new RecordView({model: record, currentForm:form, el: $("#recordView")})).render();
        				console.log("record: " + JSON.stringify(FORMY.sessionRecord));        					
    					FORMY.loadForm(FORMY.sessionRecord.get("formId"), incidentId, {
                    		success: function(form){
                				//console.log("form: " + JSON.stringify(form));        					
//                    			form.set({"patientSurname": patient.get('surname')});
//                    			form.set({"patientForenames": patient.get('forenames')});
//                    			form.set({"patientMiddle_name": patient.get('Middle_name')});
                    			form.set({"assignedId": FORMY.sessionRecord.get('assignedId')});
                    			form.set({"created": FORMY.sessionRecord.get('created')});
                    			form.set({"lastModified": FORMY.sessionRecord.get('lastModified')});
                    			form.set({"recordId": FORMY.sessionRecord.get('_id')});
            					form.set({"parentId": FORMY.sessionRecord.get('_id')});
    							(new RecordView({model: FORMY.sessionRecord, currentForm:form, el: $("#recordView")})).render();
                    		},
                    		error : function(){
                    			console.log("Error loading form: " + arguments); 
                    		}
                    	});
        			},
        			error : function(){
        				console.log("Error loading PatientRecordList: " + arguments); 
        			}
        			});
        		}
        	});
        },
        edit: function (recordId) {
        	$("#homePageView").remove();
        	$("#formRenderingView").remove();
        	$("#recordView").remove();
        	if (! $("#formRenderingView").length){
        		//$("#views").append("<div id=\"formRenderingView\"></div>");
        		var viewDiv = document.createElement("div");
        		viewDiv.setAttribute("id", "formRenderingView");
        		$("#views").append(viewDiv);
        	}
        	var record = new Record({_id: recordId});
        	record.fetch( {
        		success: function(model){
        			var parentId = record.get("parentId");
        			if (parentId != null) {
        				var parent = new Incident({_id: record.get("parentId")});
            			console.log("just made a new instance of a patient.");
            			parent.fetch( {
            				success: function(model){
            					console.log("Just successfully fetched the parent.");
            					FORMY.sessionRecord = parent;
            					console.log("record: " + JSON.stringify(record));        					
            					FORMY.loadForm(record.get("formId"), null,{
                            		success: function(form){
                            			form.set({"patientSurname": patient.get('surname')});
                            			form.set({"patientForenames": patient.get('forenames')});
                            			form.set({"patientMiddle_name": patient.get('Middle_name')});
                            			form.set({"parentId": parent.get('_id')});
                            			(new FormView({model: record, currentForm:form, el: $("#formRenderingView")})).render();
                            		},
                            		error : function(){
                            			console.log("Error loading form: " + arguments); 
                            		}
                            	});
            				}
            			});
        			} else {					
            			FORMY.loadForm(record.get("formId"), null,{
            				success: function(form){
            					(new FormView({model: record, currentForm:form, el: $("#formRenderingView")})).render();
            				},
            				error : function(){
            					console.log("Error loading form: " + arguments); 
            				}
            			});
        			}
        		},
        		error : function(){
        			console.log("Error loading FormView: " + arguments); 
        		}
        	});
        },
        record: function (recordId) {
        	$("#homePageView").remove();
        	$("#formRenderingView").remove();
        	$("#formRenderingView").remove();
        	if (! $("#recordView").length){
        		//$("#views").append("<div id=\"formRenderingView\"></div>");
        		var viewDiv = document.createElement("div");
        		viewDiv.setAttribute("id", "recordView");
        		$("#views").append(viewDiv);
        	}
        	
        	var record = new Record({_id: recordId});
        	record.fetch( {
        		success: function(model){
        			var patient = new Patient({_id: record.get("patientId")});
        			console.log("just made a new instance of a patient.");
        			patient.fetch( {
        				success: function(model){
        					console.log("Just successfully fetched the patient.");
        					FORMY.sessionRecord = patient;
        					console.log("record: " + JSON.stringify(record));        					
        					FORMY.loadForm(record.get("formId"), null,{
        						success: function(form){
        							form.set({"patientSurname": patient.get('surname')});
        							form.set({"patientForenames": patient.get('forenames')});
        							form.set({"patientMiddle_name": patient.get('Middle_name')});
        							form.set({"recordId": record.get('_id')});
                					form.set({"patientId": patient.get('_id')});
        							(new RecordView({model: record, currentForm:form, el: $("#recordView")})).render();
        						},
        						error : function(){
        							console.log("Error loading form: " + arguments); 
        						}
        					});
        				}
        			});
        		},
        		error : function(){
        			console.log("Error loading FormView: " + arguments); 
        		}
        	});
        },
        destroy: function (recordId) {
        	var record = new Record({_id: recordId});
        	record.fetch( {
        		success: function(model){
        			record.destroy( {
        				success: function(model, response){
        					var parentId = record.get("parentId");
        					if (parentId != null) {
            					console.log("Just successfully deleted the record for parentId: " + parentId);
            					FORMY.router.navigate('incidentRecords/' + patientId, true);
        					} else {
            					FORMY.router.navigate('home', true);
        					}
        				},
						error : function(){
							console.log("Error loading form: " + arguments); 
						}
        			});
        		},
        		error : function(){
        			console.log("Error loading record: " + arguments); 
        		}
        	});
        },
        design: function () {
        	console.log("design route ");
			$("#homePageView").remove();
			$("#recordView").remove();
			$("#formRenderingView").remove();
			$("#designer").remove();
			$("#maincol").html("");
			if (! $("#designer").length){
				var viewDiv = document.createElement("div");
				viewDiv.setAttribute("id", "designer");
				$("#views").append(viewDiv);
				$("#views").width("800px");
			}
			formdesigner.launch({
	            rootElement: "#designer",
	            staticPrefix: "app/FormDesignerAlpha/",
//	            form: "<?xml version=\"1.0\" encoding=\"UTF-8\" ?>\n<h:html xmlns:h=\"http://www.w3.org/1999/xhtml\" xmlns:orx=\"http://openrosa.org/jr/xforms\" xmlns=\"http://www.w3.org/2002/xforms\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:jr=\"http://openrosa.org/javarosa\">\n\t<h:head>\n\t\t<h:title>Awesome Form</h:title>\n\t\t<model>\n\t\t\t<instance>\n\t\t\t\t<data xmlns:jrm=\"http://dev.commcarehq.org/jr/xforms\" xmlns=\"http://openrosa.org/formdesigner/D1465656-8E57-4307-AD3D-CD8F8492782B\" uiVersion=\"1\" version=\"1\" name=\"Awesome Form\">\n\t\t\t\t\t<question1 />\n\t\t\t\t\t<question2 />\n\t\t\t\t\t<question3 />\n\t\t\t\t\t<question4 />\n\t\t\t\t</data>\n\t\t\t</instance>\n\t\t\t<bind nodeset=\"/data/question1\" type=\"xsd:string\" />\n\t\t\t<bind nodeset=\"/data/question2\" type=\"xsd:string\" />\n\t\t\t<bind nodeset=\"/data/question3\" type=\"xsd:string\" />\n\t\t\t<bind nodeset=\"/data/question4\" type=\"xsd:string\" />\n\t\t\t<itext>\n\t\t\t\t<translation lang=\"en\" default=\"\">\n\t\t\t\t\t<text id=\"question1\">\n\t\t\t\t\t\t<value>So what's your name?</value>\n\t\t\t\t\t</text>\n\t\t\t\t\t<text id=\"question2\">\n\t\t\t\t\t\t<value>Are you male or female?</value>\n\t\t\t\t\t</text>\n\t\t\t\t\t<text id=\"question3\">\n\t\t\t\t\t\t<value>question3</value>\n\t\t\t\t\t</text>\n\t\t\t\t\t<text id=\"question4\">\n\t\t\t\t\t\t<value>question4</value>\n\t\t\t\t\t</text>\n\t\t\t\t</translation>\n\t\t\t</itext>\n\t\t</model>\n\t</h:head>\n\t<h:body>\n\t\t<input ref=\"/data/question1\">\n\t\t\t<label ref=\"jr:itext('question1')\" />\n\t\t</input>\n\t\t<input ref=\"/data/question2\">\n\t\t\t<label ref=\"jr:itext('question2')\" />\n\t\t</input>\n\t\t<input ref=\"/data/question3\">\n\t\t\t<label ref=\"jr:itext('question3')\" />\n\t\t</input>\n\t\t<input ref=\"/data/question4\">\n\t\t\t<label ref=\"jr:itext('question4')\" />\n\t\t</input>\n\t</h:body>\n</h:html>",
	            langs: ""
	        });
        },
        populate: function () {
        	console.log("populate route ");        	
        	$("#homePageView").remove();
			$("#recordView").remove();
			$("#formRenderingView").remove();
			$("#designer").remove();
			if (! $("#homePageView").length){
				var viewDiv = document.createElement("div");
				viewDiv.setAttribute("id", "homePageView");
				$("#views").append(viewDiv);
			}
        	
        	db = $.couch.db(Backbone.couch_connector.config.db_name);
            var testdoc = null;
            ct = 0;
            opts = { success : function(){ }, error : function(){ alert("could no create a test doc"); }};    
            function randomFromTo(from, to){
        		return Math.floor(Math.random() * (to - from + 1) + from);
        	};

        while (ct < 99) {
        	ct++;
            var subcounty=randomFromTo(1,8).toString();
            var village=randomFromTo(1,8).toString();
            var priority=randomFromTo(1,3).toString();
            var department=randomFromTo(1,6).toString();
            var resolved=randomFromTo(0,1).toString();
            var month=randomFromTo(1,9);
            var day=randomFromTo(1,31);
            switch (month) {
            case 10:
            	day=randomFromTo(1,11);
            	break;
            case 9:
            	day=randomFromTo(1,30);
            	break;
            case 4:
            	day=randomFromTo(1,30);
            	break;
            case 2:
            	day=randomFromTo(1,27);
            	break;
            case 6:
            	day=randomFromTo(1,30);
            	break;
            case 11:
            	day=randomFromTo(1,30);
            	break;	
            default:
            	day=randomFromTo(1,31);	
            	break;
            }
            
            //var monthStr=randomFromTo(1,10).toString();
//            function numlength(number) {
//            	// http://stackoverflow.com/questions/554521/how-can-i-count-the-digits-in-an-integer-without-a-string-cast/554533#554533
//            	int length = number.length;
//            	return length;
//            }
            var monthStr = month.toString();
            if (month.length < 2) {
            	monthStr = "0" + month;
            }
            var dayStr = day.toString();
            if (day.length < 2) {
            	dayStr = "0" + day;
            }

            //var created =  new Date();
            var created =  "2011-" + monthStr + "-" + dayStr;
            var lastModified =  created;  
            var id =  "test" + ct;  
            testdoc = { _id : id, "flowId": "300","formId": "incident","phone": "0772555"+ ct,"description": "This is a test",
            		"subcounty": subcounty,"village": village,"priority": priority,"department": department,"assignedId": ct.toString(),
            		"resolved":resolved, "created": created,"lastModified": lastModified,"collection": "incident"};
            console.log("testdoc: " + JSON.stringify(testdoc));
            db.saveDoc(testdoc, opts);
          }
        	FORMY.router.navigate('home', true);
        },
    });

//Booststrap app after delay to avoid continuous activity spinner 
//_.delay(function(){
	// Initiate the router
	FORMY.router = new AppRouter();

	// Start Backbone history a necessary step for bookmarkable URL's
	Backbone.history.start();
	FORMY.Incidents = new IncidentsList();
//}, 100);
