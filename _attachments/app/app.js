Coconut = {}
Coconut.forms = new FormCollection();
Coconut.results = new ResultCollection();

var AppRouter = Backbone.Router.extend({
  routes: {
    "design": "design",
    "select": "select",
    "collect/:form_id": "collect",
    "analyze/:form_id": "analyze"
  },
  design: function() {
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
        form_collect_view = new FormCollectView(form)
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
        result_view = new ResultView(form_id,results)
        result_view.render();
      }
    });
  }
});


// Initiate the router
Coconut.router = new AppRouter();

// Start Backbone history a necessary step for bookmarkable URL's
Backbone.history.start();
