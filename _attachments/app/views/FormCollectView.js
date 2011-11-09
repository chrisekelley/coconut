var FormCollectView = Backbone.View.extend({

  el: "#content",

  events: {
    "click #collect button": "save"
  },

  collectTemplate: loadTemplate("form.collect.html"),

  // Initialize all of the element templates
  initializeTemplates: function(){
    var templates = {};
    _.each(["text","date","button"],function(template){
      templates[template] = loadTemplate("form.element."+template+".html");
    });
    this.formElementTemplates = templates
  },

  initialize: function (model){
	  _.bindAll(this, "render");   
    this.model = model;
    this.templates = this.initializeTemplates();
	  return this;
  },

  render: function (){
    $("#content").html(this.collectTemplate(this.model.attributes));
    var formElementTemplates = this.formElementTemplates;
    var form_elements = _.map(this.model.attributes.form_elements, function(form_element){
      // Types to ignore for now
      if(form_element.inputType.match(/(display)/)){
        return
      }
      // Manipulate any properties needed by the template
      form_element.name = form_element.label.toLowerCase().dasherize();
      try{
        return formElementTemplates[form_element.inputType](form_element);
      }catch (error){
        console.log("Error: [" + error + "] while processing " + JSON.stringify(form_element));
        $("#messages").append("<div>Error processing: " + form_element.label + ", type: "+ form_element.inputType +"</div>");
      }
    });
    $("#content form").append(form_elements.join(""));
  },

  save: function(){
    $('#messages').html("Saved...");
    var result = new Result($("form").toObject());
    result.save();
  } 
})
