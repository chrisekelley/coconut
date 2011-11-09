var FormSelectView = Backbone.View.extend({

  template: loadTemplate("form.select.html"),

  initialize: function (){
	  _.bindAll(this, "render");   
	  return this;
  },

  render: function (){
    $("#content").html(this.template({forms: Coconut.forms.models}))
  },

})
