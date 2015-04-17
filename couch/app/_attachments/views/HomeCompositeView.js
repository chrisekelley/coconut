var HomeCompositeView;

HomeCompositeView = Backbone.Marionette.CompositeView.extend({
  childView: HomeRecordItemView,
  childViewContainer: '#records',
  template: JST["_attachments/templates/HomeView.handlebars"],
  events: {
    "change #formDropdown": "chooseForm"
  },
  chooseForm: function() {
    var form;
    form = $('#formDropdown').val();
    if (form === 'TrichiasisSurgery') {
      this.trichiasisSurgery();
    } else if (form === 'PostOperativeFollowup') {
      this.postOperativeFollowup();
    } else if (form === 'PostOperativeEpilation') {
      this.postOperativeEpilation();
    } else if (form === 'PostOperativeFollowup_1day') {
      this.postOperativeFollowup_1day();
    } else if (form === 'PostOperativeFollowup_7_14_days') {
      this.postOperativeFollowup_7_14_days();
    } else if (form === 'PostOperativeFollowup_3_6_months') {
      this.postOperativeFollowup_3_6_months();
    }
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
