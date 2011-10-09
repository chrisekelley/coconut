window.FormElementView = Backbone.View.extend({
  tagName: "td",
  template: Handlebars.compile($("#form-element-template").html()),
  initialize: function (){
	  //this.model.bind('destroy', this.remove, this);
	  //this.model.bind('change', this.render, this);
	  this.model.bind('validationError', this.showErrorMessages, this);
	  this.model.view = this;
  },
  events: {
    "change" : "validate",
  },
  validate: function() {
    // clear old error messages before validation occurs
    this.$(".error-message").html("").hide();
    console.log("inputType: " + this.model.get("inputType"));
    this.inputType = this.model.get("inputType");
    this.currentValue = this.$("input").val();
    if (this.inputType == "dropdown") {
    	this.currentValue = this.$("select").val();
    } else if (this.inputType == "dropdown-add-one") {
    	this.currentValue = this.$("select").val();
    } else if (this.inputType == "checkbox") {
    	this.currentValue = this.$("checkbox").val();
    }
    console.log("FormElementView validate currentValue: " + this.currentValue);
    this.validationResult = this.model.validate({value:this.currentValue });
    if (this.validationResult == null) {
    } else {
        console.log("validation error: " + this.validationResult);
    }
    return this.validationResult;
  },
  render: function(){
	  this.colspan = this.model.get("colspan");
	  if (this.colspan == null) {
		  this.colspan = 1;
	  }
	  $(this.el).attr('colspan',this.colspan);
	  var currentId = $(this.el).attr('id');
	  //console.log("currentId: " + currentId);
	  var renderedHtml = this.template(this.model.toJSON());
	  $(this.el).html(renderedHtml); 
	  //console.log("currentId: "  + currentId + " renderedHtml: " + renderedHtml);
	  return this;
  },
  showErrorMessages: function (error){
    this.$(".error-message").html(error.join(". ")).show();
  },
//  remove: function() {
//	  $(this.el).remove();
//  },
//  clear: function() {
//	  this.model.destroy();
//  }
});
