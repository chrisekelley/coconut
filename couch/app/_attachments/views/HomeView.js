var HomeView;

HomeView = Backbone.Marionette.ItemView.extend({
  template: JST["_attachments/templates/HomeView.handlebars"],
  addOne: function(result) {
    var recordView, rendered;
    recordView = new HomeRecordView({
      model: result
    });
    if (typeof result.get('question') === 'undefined') {
      console.log("skipping this result.");
      return;
    }
    if (result.get('question') === 'Admin Registration') {
      console.log("skipping this result.");
      return;
    }
    rendered = recordView.render();
    return $("#records tbody").append(rendered);
  }
});
