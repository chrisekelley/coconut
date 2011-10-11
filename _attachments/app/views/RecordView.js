window.RecordView = Backbone.View.extend({
	//el: $("#recordView"),
	template: loadTemplate("record.template.html"),
	initialize: function() {
		_.bindAll(this, "render", "addOne");
		return this;
	},      
	render: function() {
		if (window.orientation == -90) {
			this.orientation = "vert";
			this.template =  loadTemplate("record.vert.template.html");
		} else {
			this.orientation = "vert";
			this.template =  loadTemplate("record.vert.template.html");
			//this.template =  loadTemplate("home.template.html");
		}
		//console.log("this.model in RecordView: "+ JSON.stringify(this.model.toJSON()));
		this.form = this.options.currentForm;
		//console.log("form: " + JSON.stringify(this.form));
		this.patientId = this.options.currentForm.patientId;
		var flow = this.options.currentForm.get("flow");
		var flowId = flow.id;
		var formId = this.options.currentForm.get("_id");
		var created = this.options.model.created;
		this.formElements = new FormElements(this.options.currentForm.get("form_elements"), { view: this });
		var patientIdWidget = {"label": "patientIdWidget","value":this.patientId,"identifier": "patientId","inputType": "hidden"};
		var flowIdWidget = {"label": "flowIdWidget","value": flowId,"identifier": "flowId","inputType": "hidden"};
		var formIdWidget = {"label": "formIdWidget","value": formId,"identifier": "formId","inputType": "hidden"};
		//var createdWidget = {"label": "createdWidget","value": created,"identifier": "created","inputType": "text"};
		this.formElements.add(patientIdWidget,{at: 0});
		this.formElements.add(flowIdWidget,{at: 1});
		this.formElements.add(formIdWidget,{at: 2}); 
		//this.formElements.add(createdWidget,{at: 2}); 
		//thisHtml = this.template(this.model.toJSON());
		thisHtml = this.template(this.form.toJSON());
		$(this.el).html(thisHtml);
		//$("#recordView").html(thisHtml);
		//$(this.el).html(this.template(this.form.toJSON()));
		//this.formElements = new FormElements(this.form.get("form_elements"), { view: this });
		this.formElements.each(this.addOne);
		return this;
	},
  //recordSaved: false,
  currentParentName: "formElements",
  currentParent: $(this.currentParentName),
  currentTableName: "",
  currentRow:0,
  formElements: null,
  addOne: function(formElement){
//		console.log("add one:" + JSON.stringify(formElement));
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
		}
		if (this.orientation === "vert") {
			tblCols = 2;
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
//				formElement.set({"width":"450"});
//				formElement.set({"colspan":"2"});
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
					formElement.set({"colspan":"2"});
					formElement.set({"rows":"4"});
					formElement.set({"cols":"60"});
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
		    html = "<!-- " + identifier + " -->";
		    $(this.$("#formElements")).append(html);
		} else if (inputType == 'hidden-preset') {
			html = "<!-- " + identifier + " -->";
			$(this.$("#formElements")).append(html);
		} else if (inputType == 'display-header') {
			formElement.set({"tblCols" : tblCols});
			currentParent.append((new RecordElementView({model: formElement})).render().el);
		} else if (inputType == 'hidden') {
			currentParentName = "#theForm";
			currentParent = $(currentParentName);
			closeRow = "false";
			$(this.$("#formElements")).append((new RecordElementView({model: formElement})).render().el);
			//console.log("Hidden Element: " + identifier + " currentParentName: " + currentParentName);
		} else {
		    currentParent.append((new RecordElementView({model: formElement})).render().el);
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
});

