var StaticView;

StaticView = Backbone.Marionette.ItemView.extend({
  template: JST["_attachments/templates/StatcView.handlebars"],
  ui: {
    checkboxes: "input[type=checkbox]"
  },
  events: {
    "click #scanRetry": "scanRetry",
    "click #register": "register",
    "click #registrationLink": "displayUserScanner",
    "click #newReportLink": "newReportLink",
    "click #displayEnroll": "displayEnroll",
    "click #enroll": "enroll"
  },
  initialize: function() {},
  hasCordova: true,
  initialize: function() {
    if (typeof cordova === "undefined") {
      return this.hasCordova = false;
    }
  },
  scanRetry: function() {
    console.log("scanRetry");
    if (this.user !== null) {
      Coconut.trigger("displayUserScanner");
    } else {
      Coconut.trigger("displayAdminScanner");
    }
  },
  displayUserScanner: function() {
    console.log("displayUserScanner");
    Coconut.trigger("displayUserScanner");
  },
  displayEnroll: function() {
    console.log("displayEnroll");
    if (this.user !== null) {
      Coconut.trigger("displayEnrollUser");
    } else {
      Coconut.trigger("displayEnrollAdmin");
    }
  },
  enroll: function() {
    var urlServer;
    console.log("enroll");
    if (this.hasCordova) {
      if (typeof Coconut.scannerPayload !== 'undefined') {
        console.log('we got Coconut.scannerPayload: ' + JSON.stringify(Coconut.scannerPayload));
        urlServer = Coconut.config.get("AfisServerUrl") + Coconut.config.get("AfisServerUrlFilepath") + "Enroll";
        $.post(urlServer, Coconut.scannerPayload, (function(_this) {
          return function(result) {
            var serviceUuid, statusCode;
            console.log("response from service: " + JSON.stringify(result));
            statusCode = result.StatusCode;
            serviceUuid = result.UID;
            console.log("statusCode: " + statusCode);
            if (statusCode !== null) {
              if (statusCode === 1) {
                $("#enrollResults").html('Success!');
                Coconut.currentClient = new Result({
                  serviceUuid: serviceUuid,
                  Template: Coconut.scannerPayload.Template
                });
                if (typeof _this.user !== 'undefined' && _this.user !== null && _this.user === 'user') {
                  return Coconut.trigger("displayUserRegistrationForm");
                } else {
                  return Coconut.trigger("displayAdminRegistrationForm");
                }
              } else {
                $("#enrollResults").html('Problem.');
                return Coconut.trigger("displayEnroll");
              }
            }
          };
        })(this), "json");
      }
    } else {
      console.log("Using canned user.");
      Coconut.currentClient = new Result({
        serviceUuid: Coconut.currentClient.serviceUuid,
        Template: Coconut.scannerPayload.Template
      });
      if (typeof this.user !== 'undefined' && this.user !== null && this.user === 'user') {
        return Coconut.trigger("displayUserRegistrationForm");
      } else {
        return Coconut.trigger("displayAdminRegistrationForm");
      }
    }
  },
  register: function() {
    console.log("register");
    if (this.user !== null) {
      Coconut.trigger("displayUserRegistrationForm");
    } else {
      Coconut.trigger("displayAdminRegistrationForm");
    }
  },
  submitRegistration: function() {
    console.log("submitRegistration");
    Coconut.trigger("displayUserRegistrationForm");
  },
  newReportLink: function() {
    console.log("newReportLink");
    Coconut.trigger("displayReportMenu");
  }
});
