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
    "click #PostOperativeEpilation": "postOperativeEpilation",
    "click #PostOperativeFollowup_1day": "postOperativeFollowup_1day",
    "click #PostOperativeFollowup_7_14_days": "postOperativeFollowup_7_14_days",
    "click #PostOperativeFollowup_3_6_months": "postOperativeFollowup_3_6_months"
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
  },
  postOperativeFollowup_1day: function() {
    console.log("postOperativeFollowup_1day");
    Coconut.router.navigate("#new/result/PostOperativeFollowup_1day", true);
  },
  postOperativeFollowup_7_14_days: function() {
    console.log("postOperativeFollowup_7_14_days");
    Coconut.router.navigate("#new/result/PostOperativeFollowup_7_14_days", true);
  },
  postOperativeFollowup_3_6_months: function() {
    console.log("postOperativeFollowup_3_6_months");
    Coconut.router.navigate("#new/result/PostOperativeFollowup_3_6_months", true);
  }
});
