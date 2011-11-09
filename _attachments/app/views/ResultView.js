var ResultView = Backbone.View.extend({

  el: "#content",

  events: {
    "click #analyze button": "csv"
  },

  template: loadTemplate("results.html"),

  initialize: function (form_id,results){
	  _.bindAll(this, "render");   
    this.form_id = form_id;
    this.results = results;
    this.template = loadTemplate("results.html");
	  return this;
  },

  render: function (){
    var templateData = {};
    templateData["form_id"] = this.form_id;
    // Figure out all possible columns, then get the data in column order
    var columns = _(this.results).chain()
      .map(function(result){ return _.keys(result.attributes); })
      .flatten()
      // columns we don't want to display
      .reject(function(column){ return column.match(/form_id|type|collection/)})
      .intersection()
      .value()
    templateData["columns"] = columns;
    templateData["results"] = _.map(this.results, function(result){
      return _.map(columns,function(column){
        return result.attributes[column]
      });
    });
    $("#content").html(this.template(templateData));
    $("table").tablesorter();

  },
  csv: function(){
    $('table').table2CSV();
  }

})
