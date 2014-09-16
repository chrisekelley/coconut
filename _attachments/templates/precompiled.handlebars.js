this["JST"] = this["JST"] || {};

this["JST"]["_attachments/templates/AdminUserRegistrationView.handlebars"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<script id=\"AdminUserRegistrationView\" type=\"text/x-handlebars-template\">\n    <admin-registration-form pouch = {PouchDB|s}></admin-registration-form>\n</script>\n\n\n";
  });

this["JST"]["_attachments/templates/DashboardLayout.handlebars"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div id=\"dashboard-region\"></div>\n<div id=\"content-region\"></div>\n\n\n";
  });

this["JST"]["_attachments/templates/HomeRecordItemView.handlebars"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<td><a href=\"#show/case/";
  if (helper = helpers._id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0._id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">";
  if (helper = helpers.question) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.question); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</a></td>\n<td>";
  if (helper = helpers.user) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.user); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</td>\n<td>";
  if (helper = helpers.lastModifiedAt) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.lastModifiedAt); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</td>";
  return buffer;
  });

this["JST"]["_attachments/templates/HomeView.handlebars"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<p>\n    <a data-role=\"button\" id=\"TrichiasisSurgery\" class=\"btn btn-primary btn-sm\" href=\"#new/result/Trichiasis%20Surgery\">Trichiasis Surgery</a> &nbsp; <a data-role=\"button\" id=\"PostOperativeFollowup\" class=\"btn btn-primary btn-sm\" href=\"#new/result/Post-Operative%20Followup\">Post-Operative Followup</a>\n</p>\n<table id=\"records\">\n    <thead><tr>\n        <th>Question</th>\n        <th>User</th>\n        <th>Last Modified</th>\n    </tr></thead>\n    <tbody></tbody>\n</table>";
  });

this["JST"]["_attachments/templates/PostAdminRegistrationMenuView.handlebars"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<h1>ID verification Confirmed</h1>\n\n<p>You have been registered to use this device.</p>\n\n<p>\n    Do you want to:\n</p>\n<p><a data-role=\"button\" id=\"registrationLink\" class=\"btn btn-primary btn-lg\">Register a new individual</a></p>\n<p><a data-role=\"button\" id=\"newReportLink\" class=\"btn btn-primary btn-lg\">Enter a new report</a></p>\n<p><a data-role=\"button\" id=\"logoutLink\" class=\"btn btn-primary btn-lg\">Log out</a></p>\n\n";
  });

this["JST"]["_attachments/templates/PostUserRegistrationMenuView.handlebars"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<h1>Registration complete.</h1>\n<p>\n    Do you want to:\n</p>\n<p><a data-role=\"button\" id=\"newReportLink\" class=\"btn btn-primary btn-lg\">Enter a new service report for this individual</a></p>\n<p><a data-role=\"button\" id=\"registrationLink\" class=\"btn btn-primary btn-lg\">Register a new individual</a></p>\n\n\n";
  });

this["JST"]["_attachments/templates/ScanRetry.handlebars"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<p>The system was unable to identify this person.</p>\n<p><a data-role=\"button\" id=\"scanRetry\" class=\"btn btn-primary btn-lg\">Scan again</a></p>\n<p><a data-role=\"button\" id=\"register\" class=\"btn btn-primary btn-lg\">Register</a></p>";
  });

this["JST"]["_attachments/templates/ScanVerifyView.handlebars"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<p>To identify or register an individual, please place thumb on the scanner and press the \"Scan\" button.</p>\n<p>\n<a data-role=\"button\" id=\"scan\" class=\"btn btn-primary btn-lg ladda-button\" data-style=\"expand-right\"><span class=\"ladda-label\">Scan</span></a>\n</p>\n\n<div id=\"message\"></div>\n<!--<style shim-shadowdom>-->\n\n    <!--paper-progress::shadow #progressContainer {-->\n        <!--height:200%;-->\n        <!--width:200%;-->\n    <!--}-->\n\n<!--</style>-->\n\n<!--<paper-progress id=\"scan-progress\"></paper-progress>-->";
  });

this["JST"]["_attachments/templates/StatcView.handlebars"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "";


  return buffer;
  });

this["JST"]["_attachments/templates/UserRegistrationView.handlebars"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<script id=\"UserRegistrationView\" type=\"text/x-handlebars-template\">\n  <p>User Registration</p>\n  <input type=\"text\" name=\"gender\" id=\"gender\" placeholder=\"Gender\"/>\n  <input type=\"text\" name=\"dob\" id=\"dob\" placeholder=\"DOB: Month / YYYY\"/>\n  <p><a data-role=\"button\" id=\"submitUserRegistration\" class=\"btn btn-primary btn-lg\">Press to Register</a></p>\n</script>";
  });

this["JST"]["_attachments/templates/UserReportMenu.handlebars"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<!--<report-form></report-form>-->\n<h1>New Report</h1>\n\n<div role=\"heading\">\n    <legend>Click the name of the form you wish to use:</legend>\n</div>\n\n<p>\n    <a data-role=\"button\" id=\"TrichiasisSurgery\" class=\"btn btn-primary btn-lg\">Trichiasis Surgery</a><br/>\n</p>\n<p>\n    <a data-role=\"button\" id=\"PostOperativeFollowup\" class=\"btn btn-primary btn-lg\">Post-Operative Followup</a>\n</p>\n\n";
  });

this["JST"]["_attachments/templates/VerifyView.handlebars"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<p>To start please verify Administrator Identification by placing thumb on the scanner and pressing the \"Scan\" button.</p>\n<p>\n    <a data-role=\"button\" id=\"verify\" class=\"btn btn-primary btn-lg ladda-button\" data-style=\"expand-right\"><span class=\"ladda-label\">Scan</span></a>\n</p>\n\n<div id=\"message\"></div>\n\n<!--<style shim-shadowdom>-->\n    <!--paper-progress::shadow #progressContainer {-->\n        <!--height:200%;-->\n        <!--width:200%;-->\n    <!--}-->\n<!--</style>-->\n\n<!--<paper-progress id=\"scan-progress\"></paper-progress>-->\n";
  });