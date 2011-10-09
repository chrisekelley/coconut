var FormElements = Backbone.Collection.extend({
  model: FormElement,
  url: "/formElements",
  validate: function(){
    var validationErrors = [];
    this.each(function(formElement){
    	var datatype = formElement.get("datatype");
    	if (datatype != "display") {
    	    console.log("validate:" + formElement.get("label") + " field value:" + formElement.get("value"));
    	    validationErrors.push(formElement.validate({value:formElement.get("value")}));	
    	}
    });
    console.log("validationErrors: " + validationErrors);
    return _.compact(validationErrors);
  },
  valid: function(){
    return this.validate().length == 0;
  }
});




