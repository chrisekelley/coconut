var UserSearchResultItemView, sendClientToRecords;

UserSearchResultItemView = Backbone.Marionette.ItemView.extend({
  tagName: 'tr',
  template: JST["_attachments/templates/UserSearchResultItemView.handlebars"],
  attributes: function() {
    return {
      "data-id": this.model.get("_id")
    };
  },
  events: {
    "click td": "searchByIDclicked"
  },
  searchByIDclicked: function(e) {
    var client, id;
    id = $(e.currentTarget).parent().data("id");
    console.log("id:" + id);
    client = Coconut.searchUsers.get(id);
    return sendClientToRecords(client);
  }
}, sendClientToRecords = function(client) {
  console.log('Coconut.currentClient: ' + JSON.stringify(client));
  Coconut.currentClient = client;
  CoconutUtils.setSession('currentClient', true);
  return Coconut.router.navigate("displayClientRecords", true);
});
