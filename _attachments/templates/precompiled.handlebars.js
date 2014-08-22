this["JST"] = this["JST"] || {};

this["JST"]["_attachments/templates/AdminUserRegistrationView.handlebars"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<script id=\"AdminUserRegistrationView\" type=\"text/x-handlebars-template\">\n    <admin-registration-form pouch = {PouchDB|s}></admin-registration-form>\n</script>\n\n\n";
  });

this["JST"]["_attachments/templates/PostUserRegistrationMenuView.handlebars"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<h1>Registration complete.</h1>\n<p>\n    Do you want to:\n</p>\n<p><a data-role=\"button\" id=\"newReportLink\" class=\"btn btn-primary btn-lg\">Enter a new service report for this individual</a></p>\n<p><a data-role=\"button\" id=\"registrationLink\" class=\"btn btn-primary btn-lg\">Register a new individual</a></p>\n\n\n";
  });

this["JST"]["_attachments/templates/ScanVerifyView.handlebars"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "    <p>To register an individual, please place thumb on the scanner and press the \"Scan\" button.</p>\n    <p>\n    <a data-role=\"button\" id=\"scan\" class=\"btn btn-primary btn-lg\">Scan</a>\n    </p>\n\n    <style shim-shadowdom>\n\n        paper-progress::shadow #progressContainer {\n            height:200%;\n            width:200%;\n        }\n\n    </style>\n\n    <paper-progress id=\"scan-progress\"></paper-progress>\n\n    <p>\n        Do you want to verify if this individual was registered before?\n    </p>\n    <p style=\"font-style: italic\">If Yes, you must be connected to server</p>\n    <p>\n        <a data-role=\"button\" id=\"verifyYes\" class=\"btn btn-primary btn-lg\">Yes</a> &nbsp&nbsp&nbsp&nbsp&nbsp\n        <a data-role=\"button\" id=\"verifyNo\" class=\"btn btn-primary btn-lg\">No</a>\n    </p>\n";
  });

this["JST"]["_attachments/templates/UserMainView.handlebars"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<h1>ID verification Confirmed</h1>\n\n<p>You have been registered to use this device.</p>\n\n<p>\n    Do you want to:\n</p>\n<p><a data-role=\"button\" id=\"registrationLink\" class=\"btn btn-primary btn-lg\">Register a new individual</a></p>\n<p><a data-role=\"button\" id=\"newReportLink\" class=\"btn btn-primary btn-lg\">Enter a new report</a></p>\n<p><a data-role=\"button\" id=\"logoutLink\" class=\"btn btn-primary btn-lg\">Log out</a></p>\n\n";
  });

this["JST"]["_attachments/templates/UserRegistrationView.handlebars"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<script id=\"UserRegistrationView\" type=\"text/x-handlebars-template\">\n  <p>User Registration</p>\n  <input type=\"text\" name=\"gender\" id=\"gender\" placeholder=\"Gender\"/>\n  <input type=\"text\" name=\"dob\" id=\"dob\" placeholder=\"DOB: Month / YYYY\"/>\n  <p><a data-role=\"button\" id=\"submitUserRegistration\" class=\"btn btn-primary btn-lg\">Press to Register</a></p>\n</script>";
  });

this["JST"]["_attachments/templates/UserReportMenu.handlebars"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<!--<report-form></report-form>-->\n<h1>New Report</h1>\n\n<div role=\"heading\">\n    <legend>Click the name of the form you wish to use:</legend>\n</div>\n\n<ul>\n    <li id=\"TrichiasisSurgery\">Trichiasis Surgery</li>\n    <li id=\"PostOperativeFollowup\">Post-Operative Followup</li>\n</ul>\n";
  });

this["JST"]["_attachments/templates/VerifyView.handlebars"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "    <p>To start please verify User Identification by placing thumb on the scanner and pressing the \"Scan\" button.</p>\n<p>\n    <a data-role=\"button\" id=\"verify\" class=\"btn btn-primary btn-lg\">Scan</a>\n</p>\n\n<style shim-shadowdom>\n\n    paper-progress::shadow #progressContainer {\n        height:200%;\n        width:200%;\n    }\n\n</style>\n\n<paper-progress id=\"scan-progress\"></paper-progress>\n";
  });