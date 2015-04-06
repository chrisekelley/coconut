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
    "click #newReportLink": "newReportLink",
    "click #PostOperativeFollowup": "postOperativeFollowup",
    "click #TrichiasisSurgery": "trichiasisSurgery",
    "click #PostOperativeEpilation": "postOperativeEpilation"
  },
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
  },
  trichiasisSurgery: function() {
    console.log("trichiasisSurgery");
    Coconut.router.navigate("#new/result/Trichiasis%20Surgery", true);
  },
  postOperativeFollowup: function() {
    console.log("postOperativeFollowup");
    Coconut.router.navigate("#new/result/Post-Operative%20Followup", true);
  },
  postOperativeEpilation: function() {
    console.log("postOperativeEpilation");
    Coconut.router.navigate("#new/result/PostOperativeEpilation", true);
  }
});
