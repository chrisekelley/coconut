var UserRegistrationView;

UserRegistrationView = Backbone.Marionette.ItemView.extend({
  template: JST["_attachments/templates/UserRegistrationView.handlebars"],
  events: {
    "click #submitUserRegistration": "submitUserRegistration",
    "click #submitAdminRegistration": "submitAdminRegistration"
  },
  userType: null,
  PouchDB: null,
  initialize: function() {
    console.log("init");
  },
  submitUserRegistration: function() {
    Coconut.trigger("postUserRegistrationMenu");
  },
  submitAdminRegistration: function() {
    Coconut.trigger("userMain");
  }
});
