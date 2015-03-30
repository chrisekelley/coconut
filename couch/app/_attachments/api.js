var API;

API = {
  home: function() {
    Coconut.Controller.displayScanner();
  },
  registration: function(user) {
    Coconut.Controller.displayRegistration(user);
  },
  userScan: function(user) {
    Coconut.Controller.displayScanner("user");
  },
  userMain: function() {
    Coconut.Controller.displayUserMain();
  },
  userRegistration: function() {
    Coconut.API.registration("user");
  },
  postUserRegistrationMenu: function() {
    Coconut.Controller.postUserRegistrationMenu();
  },
  displayReportMenu: function() {
    Coconut.Controller.displayReportMenu();
  },
  displayImmunization: function() {
    Coconut.Controller.displayImmunization();
  },
  saveRecord: function(record) {
    Coconut.Controller.saveRecord(record);
  }
};
