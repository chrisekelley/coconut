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

this["JST"]["_attachments/templates/Enroll.handlebars"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<p>Click the button to Enroll your fingerprint to the Simprints server.</p>\n<p><a data-role=\"button\" id=\"enroll\" class=\"btn btn-primary btn-lg\">Enroll</a></p>\n<div id=\"enrollResults\"></div>\n";
  });

this["JST"]["_attachments/templates/HomeRecordItemView.handlebars"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<td class=\"recordName\"><a href=\"#show/case/";
  if (helper = helpers._id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0._id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">";
  if (helper = helpers.question) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.question); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</a></td>\n<td class=\"recordTs\">";
  if (helper = helpers.lastModifiedAt) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.lastModifiedAt); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</td>\n\n";
  return buffer;
  });

this["JST"]["_attachments/templates/HomeView.handlebars"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, options, helperMissing=helpers.helperMissing;


  buffer += "<p>\n    <a data-role=\"button\" id=\"TrichiasisSurgery\" class=\"btn btn-primary btn-lg\" href=\"#new/result/Trichiasis%20Surgery\">";
  stack1 = (helper = helpers.polyglot || (depth0 && depth0.polyglot),options={hash:{},data:data},helper ? helper.call(depth0, "trichiasisSurgery", options) : helperMissing.call(depth0, "polyglot", "trichiasisSurgery", options));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</a> &nbsp; <a data-role=\"button\" id=\"PostOperativeFollowup\" class=\"btn btn-primary btn-lg\" href=\"#new/result/Post-Operative%20Followup\">";
  stack1 = (helper = helpers.polyglot || (depth0 && depth0.polyglot),options={hash:{},data:data},helper ? helper.call(depth0, "postOperativeFollowupAbbrev", options) : helperMissing.call(depth0, "polyglot", "postOperativeFollowupAbbrev", options));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</a>\n</p>\n<table id=\"records\">\n    <thead><tr>\n        <th>";
  stack1 = (helper = helpers.polyglot || (depth0 && depth0.polyglot),options={hash:{},data:data},helper ? helper.call(depth0, "Question", options) : helperMissing.call(depth0, "polyglot", "Question", options));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</th>\n        <!--<th>";
  stack1 = (helper = helpers.polyglot || (depth0 && depth0.polyglot),options={hash:{},data:data},helper ? helper.call(depth0, "User", options) : helperMissing.call(depth0, "polyglot", "User", options));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</th>-->\n        <th>";
  stack1 = (helper = helpers.polyglot || (depth0 && depth0.polyglot),options={hash:{},data:data},helper ? helper.call(depth0, "dateModified", options) : helperMissing.call(depth0, "polyglot", "dateModified", options));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</th>\n    </tr></thead>\n    <tbody></tbody>\n</table>\n";
  return buffer;
  });

this["JST"]["_attachments/templates/PostAdminRegistrationMenuView.handlebars"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, options, helperMissing=helpers.helperMissing;


  buffer += "<h1>";
  stack1 = (helper = helpers.polyglot || (depth0 && depth0.polyglot),options={hash:{},data:data},helper ? helper.call(depth0, "idConfirmed", options) : helperMissing.call(depth0, "polyglot", "idConfirmed", options));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</h1>\n\n<p>";
  stack1 = (helper = helpers.polyglot || (depth0 && depth0.polyglot),options={hash:{},data:data},helper ? helper.call(depth0, "registered", options) : helperMissing.call(depth0, "polyglot", "registered", options));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</p>\n\n<p>\n    ";
  stack1 = (helper = helpers.polyglot || (depth0 && depth0.polyglot),options={hash:{},data:data},helper ? helper.call(depth0, "doYouwant", options) : helperMissing.call(depth0, "polyglot", "doYouwant", options));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n</p>\n<p><a data-role=\"button\" id=\"registrationLink\" class=\"btn btn-primary btn-lg\">";
  stack1 = (helper = helpers.polyglot || (depth0 && depth0.polyglot),options={hash:{},data:data},helper ? helper.call(depth0, "registerIndividualButton", options) : helperMissing.call(depth0, "polyglot", "registerIndividualButton", options));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</a></p>\n<!--<p><a data-role=\"button\" id=\"newReportLink\" class=\"btn btn-primary btn-lg\">";
  stack1 = (helper = helpers.polyglot || (depth0 && depth0.polyglot),options={hash:{},data:data},helper ? helper.call(depth0, "enterNewReport", options) : helperMissing.call(depth0, "polyglot", "enterNewReport", options));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</a></p>-->\n\n";
  return buffer;
  });

this["JST"]["_attachments/templates/PostUserRegistrationMenuView.handlebars"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, options, helperMissing=helpers.helperMissing;


  buffer += "<h1>";
  stack1 = (helper = helpers.polyglot || (depth0 && depth0.polyglot),options={hash:{},data:data},helper ? helper.call(depth0, "RegistrationComplete", options) : helperMissing.call(depth0, "polyglot", "RegistrationComplete", options));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</h1>\n<p>\n    ";
  stack1 = (helper = helpers.polyglot || (depth0 && depth0.polyglot),options={hash:{},data:data},helper ? helper.call(depth0, "doYouwant", options) : helperMissing.call(depth0, "polyglot", "doYouwant", options));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n</p>\n<p><a data-role=\"button\" id=\"newReportLink\" class=\"btn btn-primary btn-lg\">";
  stack1 = (helper = helpers.polyglot || (depth0 && depth0.polyglot),options={hash:{},data:data},helper ? helper.call(depth0, "enterNewReport", options) : helperMissing.call(depth0, "polyglot", "enterNewReport", options));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</a></p>\n<p><a data-role=\"button\" id=\"registrationLink\" class=\"btn btn-primary btn-lg\">";
  stack1 = (helper = helpers.polyglot || (depth0 && depth0.polyglot),options={hash:{},data:data},helper ? helper.call(depth0, "registerIndividualButton", options) : helperMissing.call(depth0, "polyglot", "registerIndividualButton", options));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</a></p>\n\n\n";
  return buffer;
  });

this["JST"]["_attachments/templates/ScanRetry.handlebars"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, options, helperMissing=helpers.helperMissing;


  buffer += "<p>";
  stack1 = (helper = helpers.polyglot || (depth0 && depth0.polyglot),options={hash:{},data:data},helper ? helper.call(depth0, "cannotId", options) : helperMissing.call(depth0, "polyglot", "cannotId", options));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</p>\n<p><a data-role=\"button\" id=\"scanRetry\" class=\"btn btn-primary btn-lg\">";
  stack1 = (helper = helpers.polyglot || (depth0 && depth0.polyglot),options={hash:{},data:data},helper ? helper.call(depth0, "scanAgain", options) : helperMissing.call(depth0, "polyglot", "scanAgain", options));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</a></p>\n<!--<p><a data-role=\"button\" id=\"displayEnroll\" class=\"btn btn-primary btn-lg\">Enroll</a></p>-->\n<p>";
  stack1 = (helper = helpers.polyglot || (depth0 && depth0.polyglot),options={hash:{},data:data},helper ? helper.call(depth0, "clickEnroll", options) : helperMissing.call(depth0, "polyglot", "clickEnroll", options));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</p>\n<p><a data-role=\"button\" id=\"enroll\" class=\"btn btn-primary btn-lg\">";
  stack1 = (helper = helpers.polyglot || (depth0 && depth0.polyglot),options={hash:{},data:data},helper ? helper.call(depth0, "enroll", options) : helperMissing.call(depth0, "polyglot", "enroll", options));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</a></p>\n<div id=\"enrollResults\"></div>\n";
  return buffer;
  });

this["JST"]["_attachments/templates/ScanVerifyView.handlebars"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, options, helperMissing=helpers.helperMissing;


  buffer += "<h2>";
  stack1 = (helper = helpers.polyglot || (depth0 && depth0.polyglot),options={hash:{},data:data},helper ? helper.call(depth0, "Instructions", options) : helperMissing.call(depth0, "polyglot", "Instructions", options));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</h2>\n<p><i>";
  stack1 = (helper = helpers.polyglot || (depth0 && depth0.polyglot),options={hash:{},data:data},helper ? helper.call(depth0, "clientInstructions", options) : helperMissing.call(depth0, "polyglot", "clientInstructions", options));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</i>\n    ";
  stack1 = (helper = helpers.polyglot || (depth0 && depth0.polyglot),options={hash:{},data:data},helper ? helper.call(depth0, "clientText", options) : helperMissing.call(depth0, "polyglot", "clientText", options));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "<p>\n    <p>\n    <strong>";
  stack1 = (helper = helpers.polyglot || (depth0 && depth0.polyglot),options={hash:{},data:data},helper ? helper.call(depth0, "consentQuestion", options) : helperMissing.call(depth0, "polyglot", "consentQuestion", options));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</strong>\n    </p>\n<h3>";
  stack1 = (helper = helpers.polyglot || (depth0 && depth0.polyglot),options={hash:{},data:data},helper ? helper.call(depth0, "consentProceed", options) : helperMissing.call(depth0, "polyglot", "consentProceed", options));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</h3>\n<p>";
  stack1 = (helper = helpers.polyglot || (depth0 && depth0.polyglot),options={hash:{},data:data},helper ? helper.call(depth0, "scanInstructions", options) : helperMissing.call(depth0, "polyglot", "scanInstructions", options));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</p>\n<p>\n<a data-role=\"button\" id=\"identifyIndividual\" class=\"btn btn-primary btn-lg ladda-button\" data-style=\"expand-right\"><span class=\"ladda-label\">Scan</span></a>\n</p>\n\n<div id=\"results\">\n    <p id=\"message\"></p>\n</div>\n<!--<style shim-shadowdom>-->\n\n    <!--paper-progress::shadow #progressContainer {-->\n        <!--height:200%;-->\n        <!--width:200%;-->\n    <!--}-->\n\n<!--</style>-->\n\n<!--<paper-progress id=\"scan-progress\"></paper-progress>-->\n";
  return buffer;
  });

this["JST"]["_attachments/templates/SiteNavView.handlebars"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, options, helperMissing=helpers.helperMissing;


  buffer += "<div class=\"container\">\n    <div class=\"navbar-header\">\n        <button type=\"button\" class=\"navbar-toggle\" data-toggle=\"collapse\" data-target=\".navbar-collapse\">\n            <span class=\"sr-only\">Toggle navigation</span>\n            <span class=\"icon-bar\"></span>\n            <span class=\"icon-bar\"></span>\n            <span class=\"icon-bar\"></span>\n        </button>\n        <a href=\"#\"><img src=\"images/Kiwi-Logo-150.png\" height=\"80\"/></a>\n    </div>\n    <div class=\"collapse navbar-collapse\">\n        <ul class=\"nav navbar-nav\">\n            <!--<li class=\"siteNav\"><a href=\"#\">";
  stack1 = (helper = helpers.polyglot || (depth0 && depth0.polyglot),options={hash:{},data:data},helper ? helper.call(depth0, "Home", options) : helperMissing.call(depth0, "polyglot", "Home", options));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</a></li>-->\n            <li class=\"siteNav\"><a href=\"#sync\">";
  stack1 = (helper = helpers.polyglot || (depth0 && depth0.polyglot),options={hash:{},data:data},helper ? helper.call(depth0, "Sync", options) : helperMissing.call(depth0, "polyglot", "Sync", options));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</a></li>\n            <li class=\"siteNav\"><a href=\"#displayUserScanner\">";
  stack1 = (helper = helpers.polyglot || (depth0 && depth0.polyglot),options={hash:{},data:data},helper ? helper.call(depth0, "Scanner", options) : helperMissing.call(depth0, "polyglot", "Scanner", options));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</a></li>\n        </ul>\n    </div><!--/.nav-collapse -->\n</div>\n";
  return buffer;
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
  var buffer = "", stack1, helper, options, helperMissing=helpers.helperMissing;


  buffer += "<!--<report-form></report-form>-->\n<h1>";
  stack1 = (helper = helpers.polyglot || (depth0 && depth0.polyglot),options={hash:{},data:data},helper ? helper.call(depth0, "newReport", options) : helperMissing.call(depth0, "polyglot", "newReport", options));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</h1>\n\n<div role=\"heading\">\n    <legend>";
  stack1 = (helper = helpers.polyglot || (depth0 && depth0.polyglot),options={hash:{},data:data},helper ? helper.call(depth0, "ClickFormName", options) : helperMissing.call(depth0, "polyglot", "ClickFormName", options));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</legend>\n</div>\n\n<p>\n    <a data-role=\"button\" id=\"TrichiasisSurgery\" class=\"btn btn-primary btn-lg\">";
  stack1 = (helper = helpers.polyglot || (depth0 && depth0.polyglot),options={hash:{},data:data},helper ? helper.call(depth0, "trichiasisSurgery", options) : helperMissing.call(depth0, "polyglot", "trichiasisSurgery", options));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</a><br/>\n</p>\n<p>\n    <a data-role=\"button\" id=\"PostOperativeFollowup\" class=\"btn btn-primary btn-lg\">";
  stack1 = (helper = helpers.polyglot || (depth0 && depth0.polyglot),options={hash:{},data:data},helper ? helper.call(depth0, "postOperativeFollowup", options) : helperMissing.call(depth0, "polyglot", "postOperativeFollowup", options));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</a>\n</p>\n\n";
  return buffer;
  });

this["JST"]["_attachments/templates/VerifyView.handlebars"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, options, helperMissing=helpers.helperMissing;


  buffer += "<p>";
  stack1 = (helper = helpers.polyglot || (depth0 && depth0.polyglot),options={hash:{},data:data},helper ? helper.call(depth0, "verifyAdmin", options) : helperMissing.call(depth0, "polyglot", "verifyAdmin", options));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</p>\n<p>\n    <a data-role=\"button\" id=\"identifyAdmin\" class=\"btn btn-primary btn-lg ladda-button\" data-style=\"expand-right\"><span class=\"ladda-label\">Scan</span></a>\n</p>\n\n<div id=\"message\"></div>\n\n\n<!--<style shim-shadowdom>-->\n    <!--paper-progress::shadow #progressContainer {-->\n        <!--height:200%;-->\n        <!--width:200%;-->\n    <!--}-->\n<!--</style>-->\n\n<!--<paper-progress id=\"scan-progress\"></paper-progress>-->\n";
  return buffer;
  });