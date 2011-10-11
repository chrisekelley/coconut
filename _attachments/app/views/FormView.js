//var currentParent;

var FormView = Backbone.View.extend({

  template: loadTemplate("form.template.html"),

  initialize: function (){
	  _.bindAll(this, "render", "addOne", "saveRecord", "remove");   
	  //this.bind("saveRecord", this.saveRecord, this);
	  this.bind("reset", this.updateView);
	  //this.model.bind('destroy', this.remove, this);
	  return this;
  },
  remove: function() {
	  console.log("remove the view in FormView");
	  $(this.el).remove();
  },
  clear: function() {
	  console.log("clear(destroy) the view");
	  this.model.destroy();
  },
  updateView: function() {
	  console.log("updateView");
	  this.remove();
	  this.render();
	},
	render: function(){
		if (window.orientation == -90) {
			this.orientation = "vert";
		} else {
			//this.orientation = "horiz";
			this.orientation = "vert";
		}
		if (this.orientation === "vert") {
			this.template =  loadTemplate("form.vert.template.html");
		} else {
			this.template =  loadTemplate("form.vert.template.html");
		}
		
		this.form = this.options.currentForm;
		this.parentId = this.options.currentForm.parentId;
		$(this.el).html(this.template(this.form.toJSON()));
		var flow = this.options.currentForm.get("flow");
		var flowId = flow.id;
		var formId = this.options.currentForm.get("_id");
		var assignedId = this.options.currentForm.get("assignedId");
		var created = this.options.currentForm.get("createdWidget");
		this.formElements = new FormElements(this.options.currentForm.get("form_elements"), { view: this });
		var parentIdWidget = {"label": "parentIdWidget","value":this.parentId,"identifier": "parentId","inputType": "hidden"};
		var flowIdWidget = {"label": "flowIdWidget","value": flowId,"identifier": "flowId","inputType": "hidden"};
		var formIdWidget = {"label": "formIdWidget","value": formId,"identifier": "formId","inputType": "hidden"};
		var assignedIdWidget = {"label": "assignedIdWidget","value": assignedId,"identifier": "assignedId","inputType": "hidden"};
		var createdWidget = {"label": "createdWidget","value": created,"identifier": "created","inputType": "hidden"};
		this.formElements.add(parentIdWidget,{at: 0});
		this.formElements.add(flowIdWidget,{at: 1});
		this.formElements.add(formIdWidget,{at: 2});
		this.formElements.add(assignedIdWidget,{at: 3});
		this.formElements.add(createdWidget,{at: 4});
		var _id = this.model.get("_id");
		if (_id != null) {
			var idWidget = {"label": "idWidget","value":_id,"identifier": "_id","inputType": "hidden"};
			this.formElements.add(idWidget,{at: 4});
		}
		var _rev = this.model.get("_rev");
		if (_rev != null) {
			var revWidget = {"label": "revWidget","value":_rev,"identifier": "_rev","inputType": "hidden"};
			this.formElements.add(revWidget,{at: 5});
		}
		this.formElements.each(this.addOne);
		return this;
	},
  //recordSaved: false,
  currentParentName: "formElements",
  currentParent: $(this.currentParentName),
  currentTableName: "",
  currentRow:0,	// reset whenever closeRow = true;
  formElements: null,
  addOne: function(formElement){
//	console.log("add one:" + JSON.stringify(formElement));
	  var inputType = formElement.get("inputType");
	  var datatype = formElement.get("datatype");
	  var closeRow = formElement.get("closeRow");
	  var identifier = formElement.get("identifier");
	  var tblCols = formElement.get("cols");
	  var size = formElement.get("size");
	  this.value = this.model.get(identifier);
	  // don't count the hidden widgets at the beginning of the form.
	  if ((inputType !== "hidden") && (datatype !== "display")) {
		  this.currentRow ++;  
	  }
	  //console.log("currentRow: " + this.currentRow + " identifier: " + identifier);
	if (this.value != null) {
		//console.log("value for " + identifier + ": " + this.value);
		formElement.set({"value": this.value});
		formElement.set({"recordValue": this.value});
	}
	if (this.orientation === "vert") {
		tblCols = 2;
		//console.log("closeRow: " + closeRow + " ; currentRow: " + this.currentRow);
		if (closeRow === "false") {
			if (this.currentRow % 2) {
				closeRow = "false";
			} else {
				closeRow = "true";
				//console.log("Setting closeRow to true for " + identifier + " ; currentRow: " + this.currentRow);
			}
		}
		if (inputType == 'button') {
			closeRow = "true";
//			formElement.set({"width":"450"});
//			formElement.set({"colspan":"2"});
		} else if (inputType == 'text') {
			if (size > 25) {
				//console.log("Size: " + size);
				closeRow = "true";
				formElement.set({"colspan":"2"});
				if (size >= 50) {
					formElement.set({"size":"50"});
				}
			}
		} else if (inputType == 'textarea') {
				closeRow = "true";
//				formElement.set({"colspan":"2"});
//				formElement.set({"rows":"4"});
//				formElement.set({"cols":"60"});
		} else {
			formElement.set({"colspan":"1"});
		}
	}
	if (tblCols == null) {
		if (this.orientation === "vert") {
			tblCols = 2;
		} else {
			tblCols = 3;
		}
	}
	//console.log("add one:" + JSON.stringify(formElement));
	if (inputType == 'display-tbl-begin') {
		template = displayTableWidgetCompiledHtml;
		html = template(formElement.toJSON());	
		 //$(this.$("#formElements")).append(html);
		 $("#formElements").append(html);
		 currentParentName = "#beginTableRow" + identifier;
		 currentParent = $(currentParentName);
		 currentTableName = "#beginTableRow" + identifier;;
	} else if (inputType == 'display-tbl-end') {
	} else if (inputType == 'hidden-empty') {
	    html = "<input id='" + identifier + "'name='" + identifier + "' type='hidden'></input>";
	    $(this.$("#formElements")).append(html);
	} else if (inputType == 'hidden-preset') {
		html = "<input id='" + identifier + "'name='" + identifier + "' type='hidden'></input>";
		$(this.$("#formElements")).append(html);
	} else if (inputType == 'display-header') {
		formElement.set({"tblCols" : tblCols});
		currentParent.append((new FormElementView({model: formElement})).render().el);
	} else if (inputType == 'hidden') {
		currentParentName = "#theForm";
		currentParent = $(currentParentName);
		closeRow = "false";
		$(this.$("#formElements")).append((new FormElementView({model: formElement})).render().el);
		//console.log("Hidden Element: " + identifier + " currentParentName: " + currentParentName);
	} else {
	    currentParent.append((new FormElementView({model: formElement})).render().el);
	}
	if (closeRow == "true") {
		//$("table").append("<tr id=\"row" + identifier + "\"></tr>");
		$(currentTableName).append("<tr id=\"row" + identifier + "\"></tr>");
		currentParentName = "#row" + identifier;
		currentParent = $(currentParentName);
		this.currentRow = 0;	//reset currentRow.
		//console.log("CloseRow currentParentName: " + currentParentName);
	}
	 //console.log("Element: " + identifier + " currentParentName: " + currentParentName);
  },
  events: {
    "click #form-save" : "saveRecord",
  },
  saveRecord: function(e){ 
	  e.preventDefault();
	  console.log("validating the form submission.");
	  var validationErrors = [];
	  this.formElements.each(function(formElement){
		  var datatype = formElement.get("datatype");
		  if (datatype != "display") {
			  var inputValue = $("#" + formElement.get("identifier")).val();
			  //console.log("validate:" + formElement.get("label") + " field value:" + formElement.get("value") + " inputValue:" + inputValue);
			  validationErrors.push(formElement.validate({value:inputValue}));	
		  }
	  });
	  var errors = _.compact(validationErrors);
	  if (errors.length == 0) {
		  console.log("Ready to save");
		  var formData = $("#theForm").toObject();
		  var formId = $("#formId").val();
		  console.log("formData: " + JSON.stringify(formData));
		  var _id = formData._id;
		  if (_id == null) {
			  formData.created =  new Date();
			  formData.lastModified =  formData.created;  
			  if (formId === "incident") {
				  var info = $.couch.db(Backbone.couch_connector.config.db_name).info(
						  {
							  success : function(resp){
								  console.log("info: " + JSON.stringify(resp));
								  var doc_count = resp["doc_count"];
								  var doc_del_count = resp["doc_del_count"];
								  var assignedId = doc_count + doc_del_count;
								  console.log("assignedId: " + assignedId);
								  formData.assignedId = assignedId.toString();
								  console.log("FORMY.Incidents.create(formData);" + JSON.stringify(formData));
								  FORMY.Incidents.create(formData,{
									  success: function(model, resp){
										  nextModel = model;
										  //console.log("saveDoc nextModel.");
										  FORMY.sessionRecord = model;
										  inspectModelAndGo(model);
									  },
									  error: function() { 
										  console.log("Error saving: " + arguments); 
									  }
								  });
							  }
						  }
				  );
			  } else {
				  console.log("Saving the record using FORMY.sessionRecord.records.create");
				  FORMY.sessionRecord.records.create(formData,{
					  success: function(model, resp){
						  console.log("added new record to FORMY.sessionRecord.records.");
						  inspectModelAndGo(model);
					  },
					  error: function() { 
						  console.log("Error saving: " + arguments); 
					  }
				  });
				  //model.clear;
			  }
		  } else {
			  formData.lastModified =  new Date();
			  console.log("Updating the record using record.save");
			  var record = new Record(formData);
			  record.collection = "patient-records";
			  record.urlRoot = "patient-records";
//			  if (formData.assignedId != null) {
//				  var assignedId = parseInt(formData.assignedId);
//				  console.log("formData.assignedId: " + formData.assignedId + " assignedId: " + assignedId);
//				  record.assignedId = assignedId;
//			  }
			  record.save({},{
				  success: function(model, resp){
					  console.log("Updated the record.");
					  inspectModelAndGo(model);
				  },
				  error: function() { 
					  console.log("Error saving: " + JSON.stringify(arguments)); 
				  }
			  });
			  //model.clear;
		  }
		  
		  
		  this.options.currentForm = null;
		  this.form = null;

		  //$("#formRenderingView").remove();

	  } else {
		  console.log("Errors:" + JSON.stringify(errors));
		  alert(errors);
	  }	  //}
  },
});

function inspectModelAndGo(newRecord) {
	var queryId = null;
		var formId = null;
		var identifier = null;
		var parentId = null;
		if ((typeof newRecord.get !== "undefined") && (typeof newRecord.get("formId") !== "undefined")) {
			formId =  newRecord.get("formId");
		} else {
			formId =  newRecord.formId;		
		}
		if ((typeof newRecord.get !== "undefined") && (typeof newRecord.get("_id") !== "undefined")) {
			identifier =  newRecord.get("_id");
		} else {
			identifier =  newRecord._id;	
		}
		if ((typeof newRecord.get !== "undefined") && (typeof newRecord.get("parentId") !== "undefined")) {
			parentId =  newRecord.get("parentId");  					
		} else {
			parentId =  newRecord.parentId;		
		}
		
		if (formId === "incident") {
			queryId =  identifier;
			//console.log("identifier is queryId: " + queryId + " for formId: " + formId);					
		 } else {
			queryId = parentId;
			//console.log("parentId is queryId: " + queryId + " for formId: " + formId);
		 }
		FORMY.router.navigate('patientRecords/' + queryId, true);
		//FORMY.router.navigate('patientRecords/' + queryId);
}
