Coconut = {}
Coconut.forms = new FormCollection();
Coconut.results = new ResultCollection();

var AppRouter = Backbone.Router.extend({
  routes: {
    "design": "design",
    "select": "select",
    "collect/:form_id": "collect",
    "analyze/:form_id": "analyze",
    "": "blank"
  },
  blank: function() {
    $("#content").html("<img src='images/coconut_logo_hori_1_med.jpg'/>")
  },
  design: function() {
    $("#content").empty();
    design_view = new DesignView()
    design_view.render();
  },
  select: function() {
    $("#content").empty();
    Coconut.forms.fetch({
      success: function(){
        form_select_view = new FormSelectView()
        form_select_view.render();
      }
    });
  },
  collect: function(id) {
    $("#content").empty()
    Coconut.forms.fetch({
      success: function(){
        var form = Coconut.forms.get(id)
        if(typeof form_collect_view == "undefined"){
          form_collect_view = new FormCollectView(form)
        }
        else{
          form_collect_view.model = form;
        }
        form_collect_view.render();
      }
    });
  },
  analyze: function(form_id) {
    $("#content").empty()
    Coconut.results.fetch({
      success: function(){
        // Match only results with form_id
        var results = Coconut.results.chain()
          .map(function(result){
            if(result.get("form_id") == form_id){
              return result
            }
          })
          .compact().value();
        if(typeof result_view == "undefined"){
          result_view = new ResultView(form_id,results)
        }
        else{
          result_view.form_id = form_id
          result_view.results = results
        }
        result_view.render();
      }
    });
  },
  oldDesign: function() {
    $("#content").empty()
    if (!$("#designer").length) {
      var viewDiv = document.createElement("div");
      viewDiv.setAttribute("id", "designer");
      $("#content").append(viewDiv);
      $("#content").width("1000px");
    }
    formdesigner.launch({
      rootElement: "#designer",
      staticPrefix: "app/FormDesignerAlpha/",
      langs: ""
    });
  }
});


// Initiate the router
Coconut.router = new AppRouter();

// Start Backbone history a necessary step for bookmarkable URL's
Backbone.history.start();
