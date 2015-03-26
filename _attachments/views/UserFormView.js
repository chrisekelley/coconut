var UserFormView;

UserFormView = Backbone.Marionette.ItemView.extend({
  template: JST["_attachments/templates/PostAdminRegistrationMenu.handlebars"],
  className: "app ui-content",
  triggers: {
    "click #submitContinueReportLink": {
      event: "submitContinueReportLink",
      preventDefault: true,
      stopPropagation: false
    }
  },
  events: {
    "click #registrationLink": "submitRegistration",
    "click #newReportLink": "newReportLink"
  },
  initialize: function() {},
  submitRegistration: function() {
    console.log("submitRegistration");
    App.trigger("userScan");
  },
  newReportLink: function() {
    console.log("newReportLink");
    App.trigger("displayReportMenu");
  },
  submitContinueReportLink: function() {
    console.log("submitContinueReportLink");
    App.trigger("displayImmunization");
  },
  submitImmunizationLink: function() {
    console.log("submitImmunizationLink");
    App.trigger("displayReportMenu");
  }
});
