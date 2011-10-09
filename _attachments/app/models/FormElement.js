var FormElement = Backbone.Model.extend({
  initialize: function(){
	//console.log("this formElement: " + JSON.stringify(this));
    // If name is not defined then use the label as the name (after downcasing and replacing spaces with dashes)
    this.set({"name" : (typeof this.get("name") == "undefined") ? this.get("label").toLowerCase().dasherize() : this.name});
  },
  value: null,
  validate: function(attributes){
    var validationErrors = [];
    _.each(this.get("options"), function(option){
      switch (option.name){
        case "optional":
          if (option.value == "false" && attributes.value == ""){
          	if (this.hasOwnProperty("init")) {
          		console.log("Error: value is empty ");
                validationErrors.push(this.get("label") + " is required");
          	} else {
          		this.init= "yes";
          		//console.log("init " + this.get("label"));
          	}
          }
          break;
        // TODO need to implement these
        case "absolute-min":
          break;
        case "absolute-max":
        	if (parseInt(attributes.value) > parseInt(option.value)){
                validationErrors.push(this.get("label") + " is too high. Value: " + attributes.value + " Absolute Max value: " + option.value);
              }
        	break;
        case "max":
        	if (parseInt(attributes.value) > parseInt(option.value)){
                validationErrors.push(this.get("label") + " is too high. Value: " + attributes.value + " Max value: " + option.value);
              }
          break;
        case "min":
          break;
        default:
          validationErrors.push("'"+ this.option.name + "' not supported as a validation option");
      }
    }, this); // Need the "this" here to be able to call this.get("label") above
    if(_.any(validationErrors)){
      this.trigger("validationError", validationErrors)
      return validationErrors
    }
    else{
      return null;
    }
  },
  url: "/form_element"
});
