
//This allows us to have a single file for template widgets.
var loadWidgetTemplates = function(){
	//var templateFunction;
	$.ajax("app/templates/templates.html",{
		dataType: "html",
		async:false, // make sure we pause execution until this template is loaded
		success: function(result){
			//console.log("loaded templates.html: " + result);
			$("head").append(result);
		},
		error: function(error){
			console.log("Error loaded templates.html: " + JSON.stringify(error));
		}
	});
};

loadWidgetTemplates();

recordValueCompiledHtml = Handlebars.compile($("#recordValue").html());
recordDropdownValueCompiledHtml = Handlebars.compile($("#recordDropdownValue").html());
doNotRenderCompiledHtml = Handlebars.compile($("#doNotRender").html());
recordCheckboxValueCompiledHtml = Handlebars.compile($("#recordCheckboxValue").html());
recordDropdownCSVValueCompiledHtml = Handlebars.compile($("#recordDropdownCSVValue").html());
recordYesnoValueCompiledHtml = Handlebars.compile($("#recordYesnoValue").html());
recordGenderValueCompiledHtml = Handlebars.compile($("#recordGenderValue").html());
displayTableWidgetCompiledHtml = Handlebars.compile($("#displayTableWidget").html());
displayHeaderWidgetCompiledHtml = Handlebars.compile($("#displayHeaderWidget").html());
displaySubHeaderWidgetCompiledHtml = Handlebars.compile($("#displaySubHeaderWidget").html());
displayInfotextWidgetCompiledHtml = Handlebars.compile($("#displayInfotextWidget").html());

Handlebars.registerHelper("renderValue", function(context) {
	//console.log("renderValue:" + JSON.stringify(context));
	var template;
	var html = "";
	var useTemplate = true;
	var datatype = this.datatype;
	var inputType = this.inputType;
	var visible = this.visible;
	var tblCols = this.tblCols;
	var closeRow = this.closeRow;
	var identifier = this.identifier;
	var size = this.size;
	var maxlength = this.maxlength;
	var beginElement = "";
	var endElement = "";
	if (closeRow == "true") {
		//endElement = "</td></tr>\n<tr>\n";
	}
	if (inputType == 'text') {
		if (size == null || size == 0) {
			this.size = 20;
		}
		if (maxlength == null || maxlength == 0) {
			this.maxlength = 255;
		}
		template = recordValueCompiledHtml;
	} else if (inputType == 'patientid') {
			template = recordValueCompiledHtml;
	} else if (inputType == 'birthdate') {
		template = recordValueCompiledHtml;
	} else if (inputType == 'emptyDate') {
		template = recordValueCompiledHtml;
	} else if (inputType == 'checkbox') {
		template = recordCheckboxValueCompiledHtml;
	} else if (inputType == 'dropdown-add-one') {
		template = recordDropdownCSVValueCompiledHtml;
	} else if (inputType == 'dropdown') {
		template = recordDropdownCSVValueCompiledHtml;
	} else if (inputType == 'select') {
		template = recordDropdownCSVValueCompiledHtml;
	} else if (inputType == 'selectFDA') {
		template = recordDropdownValueCompiledHtml;
	} else if (inputType == 'textarea') {
		template = recordValueCompiledHtml;
	} else if (inputType == 'yesno_br') {
		template = recordYesnoValueCompiledHtml;
	} else if (inputType == 'Yes/No') {
		template = recordYesnoValueCompiledHtml;
	} else if (inputType == 'gender') {
		template = recordGenderValueCompiledHtml;
//	} else if (inputType == 'display-tbl-begin') {
//		template = displayTableWidgetCompiledHtml;
	} else if (inputType == 'display-header') {
		template = displayHeaderWidgetCompiledHtml;
	} else if (inputType == 'display-sub-header') {
		template = displaySubHeaderWidgetCompiledHtml;
	} else if (inputType == 'infotext') {
		template = displayInfotextWidgetCompiledHtml;
	} else if (inputType == 'hidden') {
		template = doNotRenderCompiledHtml;
	} else if (inputType == 'button') {
		template = doNotRenderCompiledHtml;
	} else {
		useTemplate = false; 
	};
	  if (useTemplate) {
		  if (datatype == "display") {
			  html = beginElement + template(this) + endElement;  
		  } else if (inputType == 'hidden') {
			  html = beginElement + template(this) + endElement;  
		  } else {
			  var labelHtml = "<label for='" + identifier + "'>" + this.label + "</label>";
			  var errorHtml = " <span class='error-message' style='display:none'></span>";
			  html = beginElement + labelHtml + template(this) + errorHtml + endElement; 
			  //console.log("useTemplate: " + useTemplate + " inputType: " + inputType + " closeRow: " + closeRow + " html: "+ html);
		  }
	  } else {
		  if (html == "") {
			  html = beginElement + "No template for inputType: " + inputType + endElement; 
		  }
		  console.log("html: " + html);
	  }
	  return html;
	});

Handlebars.registerHelper("checkboxValue", function(value) {
	var out = "";
	if (value != null) {
		  if (value === "1") {
			  out = "Yes";
		  } else if (value === "0") {
			  out = "No";
		  }
	 }
	return out;
	});
Handlebars.registerHelper("yesNoValue", function(value) {
	var out = "";
	if (value != null) {
		if (value === 1) {
			out = "Yes";
		} else if (value === 0) {
			out = "No";
		}
	}
	return out;
});
Handlebars.registerHelper("genderValue", function(value) {
	var out = "";
	if (value != null) {
		if (value === 1) {
			out = "Female";
		} else if (value === 2) {
			out = "Male";
		}
	}
	return out;
});

Handlebars.registerHelper('dropdownCSVValue', function(items, value) {
	  var out = "";
	  var arry = items.split(',');
	  for(var i=0, l=arry.length; i<l; i++) {
	    out = out + "<option value=\"" + arry[i] + "\">" + arry[i] + "</option>";
	    if (arry[i] === value) {
			out = value;
		}
	  }
	  return out;
	});

Handlebars.registerHelper('dropdownValue', function(enumerations, value) {
	var out = "";
	//console.log("enums: " + JSON.stringify(enumerations));
	for (fenum in enumerations) {
		var record = enumerations[fenum];
		//console.log("record: " + JSON.stringify(record));
		//console.log("defaultValue: " + record.defaultValue + " value: " + value);
		if (record.defaultValue === value) {
			out = record.label;
		}
	}
	return out;
});
