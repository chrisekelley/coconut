window.Form = Backbone.Model.extend({
  initialize: function(){
	  this.formElements = new FormElements;
	 // _.bindAll(this, "saveForm", "clear");
	 // _.bindAll(this, "clear");
	  //this.bind("reset", this.updateView);
	//this.model.bind('destroy', this.remove, this);
  },
  url: "/form",
});
