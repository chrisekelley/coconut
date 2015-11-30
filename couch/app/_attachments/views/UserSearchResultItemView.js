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
    client = Coconut.searchUsers.get(id);
    return sendClientToRecords(client);
  }
}, sendClientToRecords = function(users, threshold) {
  var client, tableView;
  if (users.length > 1) {
    Coconut.searchUsers = users;
    tableView = new UserSearchResultCompositeView({
      collection: users
    });
    return Coconut.idResults.show(tableView);
  } else {
    if (Object.prototype.toString.call(users) === '[object Array]') {
      client = users[0];
    } else {
      client = users;
    }
    if (client === null) {
      alert("Client not found.");
      return Coconut.router.navigate("displayUserScanner", true);
    } else {
      client.threshold = threshold;
      Coconut.currentClient = client;
      CoconutUtils.setSession('currentClient', true);
      return Coconut.router.navigate("displayClientRecords", true);
    }
  }
});
