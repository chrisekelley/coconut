this["JST"] = this["JST"] || {};

this["JST"]["_attachments/templates/AdminUserRegistrationView.handlebars"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<script id=\"AdminUserRegistrationView\" type=\"text/x-handlebars-template\">\n    <admin-registration-form pouch = {PouchDB|s}></admin-registration-form>\n</script>\n\n\n";
},"useData":true});

this["JST"]["_attachments/templates/DashboardLayout.handlebars"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div id=\"dashboard-region\"></div>\n<div id=\"content-region\"></div>\n\n\n";
},"useData":true});

this["JST"]["_attachments/templates/Enroll.handlebars"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<p>Click the button to Enroll your fingerprint to the Simprints server.</p>\n<p><a data-role=\"button\" id=\"enroll\" class=\"btn btn-primary btn-lg\">Enroll</a></p>\n<div id=\"enrollResults\"></div>\n";
},"useData":true});

this["JST"]["_attachments/templates/HomeRecordItemView.handlebars"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "<td class=\"recordName\"><a href=\"#show/case/"
    + alias3(((helper = (helper = helpers._id || (depth0 != null ? depth0._id : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"_id","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3((helpers.polyglot || (depth0 && depth0.polyglot) || alias1).call(depth0,(depth0 != null ? depth0.question : depth0),{"name":"polyglot","hash":{},"data":data}))
    + "</a></td>\n<td class=\"recordTs\">"
    + alias3(((helper = (helper = helpers.lastModifiedAt || (depth0 != null ? depth0.lastModifiedAt : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"lastModifiedAt","hash":{},"data":data}) : helper)))
    + "</td>";
},"useData":true});

this["JST"]["_attachments/templates/HomeView.handlebars"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, alias1=helpers.helperMissing;

  return "<p>\n    <a data-role=\"button\" id=\"TrichiasisSurgery\" class=\"btn btn-primary btn-lg\" href=\"#new/result/Trichiasis%20Surgery\">"
    + ((stack1 = (helpers.polyglot || (depth0 && depth0.polyglot) || alias1).call(depth0,"trichiasisSurgery",{"name":"polyglot","hash":{},"data":data})) != null ? stack1 : "")
    + "</a> &nbsp;\n    <a data-role=\"button\" id=\"PostOperativeEpilation\" class=\"btn btn-primary btn-lg\">"
    + ((stack1 = (helpers.polyglot || (depth0 && depth0.polyglot) || alias1).call(depth0,"PostOperativeEpilation",{"name":"polyglot","hash":{},"data":data})) != null ? stack1 : "")
    + "</a> &nbsp;\n    <a data-role=\"button\" id=\"PostOperativeFollowup\" class=\"btn btn-primary btn-lg\" href=\"#new/result/Post-Operative%20Followup\">"
    + ((stack1 = (helpers.polyglot || (depth0 && depth0.polyglot) || alias1).call(depth0,"postOperativeFollowupAbbrev",{"name":"polyglot","hash":{},"data":data})) != null ? stack1 : "")
    + "</a>\n    <a data-role=\"button\" id=\"PostOperativeFollowup_1day\" class=\"btn btn-primary btn-lg\" href=\"#new/result/PostOperativeFollowup_1day\">"
    + ((stack1 = (helpers.polyglot || (depth0 && depth0.polyglot) || alias1).call(depth0,"postOperativeFollowup_1day",{"name":"polyglot","hash":{},"data":data})) != null ? stack1 : "")
    + "</a>\n    <a data-role=\"button\" id=\"PostOperativeFollowup_7_14_days\" class=\"btn btn-primary btn-lg\" href=\"#new/result/PostOperativeFollowup_7_14_days\">"
    + ((stack1 = (helpers.polyglot || (depth0 && depth0.polyglot) || alias1).call(depth0,"postOperativeFollowup_7_14_days",{"name":"polyglot","hash":{},"data":data})) != null ? stack1 : "")
    + "</a>\n    <a data-role=\"button\" id=\"PostOperativeFollowup_3_6_months\" class=\"btn btn-primary btn-lg\" href=\"#new/result/PostOperativeFollowup_3_6_months\">"
    + ((stack1 = (helpers.polyglot || (depth0 && depth0.polyglot) || alias1).call(depth0,"postOperativeFollowup_3_6_months",{"name":"polyglot","hash":{},"data":data})) != null ? stack1 : "")
    + "</a>\n</p>\n<table id=\"records\">\n    <thead><tr>\n        <th>"
    + ((stack1 = (helpers.polyglot || (depth0 && depth0.polyglot) || alias1).call(depth0,"Question",{"name":"polyglot","hash":{},"data":data})) != null ? stack1 : "")
    + "</th>\n        <!--<th>"
    + ((stack1 = (helpers.polyglot || (depth0 && depth0.polyglot) || alias1).call(depth0,"User",{"name":"polyglot","hash":{},"data":data})) != null ? stack1 : "")
    + "</th>-->\n        <th>"
    + ((stack1 = (helpers.polyglot || (depth0 && depth0.polyglot) || alias1).call(depth0,"dateModified",{"name":"polyglot","hash":{},"data":data})) != null ? stack1 : "")
    + "</th>\n    </tr></thead>\n    <tbody></tbody>\n</table>\n";
},"useData":true});

this["JST"]["_attachments/templates/PostAdminRegistrationMenuView.handlebars"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, alias1=helpers.helperMissing;

  return "<h1>"
    + ((stack1 = (helpers.polyglot || (depth0 && depth0.polyglot) || alias1).call(depth0,"idConfirmed",{"name":"polyglot","hash":{},"data":data})) != null ? stack1 : "")
    + "</h1>\n\n<p>"
    + ((stack1 = (helpers.polyglot || (depth0 && depth0.polyglot) || alias1).call(depth0,"registered",{"name":"polyglot","hash":{},"data":data})) != null ? stack1 : "")
    + "</p>\n\n<p>\n    "
    + ((stack1 = (helpers.polyglot || (depth0 && depth0.polyglot) || alias1).call(depth0,"doYouwant",{"name":"polyglot","hash":{},"data":data})) != null ? stack1 : "")
    + "\n</p>\n<p><a data-role=\"button\" id=\"registrationLink\" class=\"btn btn-primary btn-lg\">"
    + ((stack1 = (helpers.polyglot || (depth0 && depth0.polyglot) || alias1).call(depth0,"registerIndividualButton",{"name":"polyglot","hash":{},"data":data})) != null ? stack1 : "")
    + "</a></p>\n<!--<p><a data-role=\"button\" id=\"newReportLink\" class=\"btn btn-primary btn-lg\">"
    + ((stack1 = (helpers.polyglot || (depth0 && depth0.polyglot) || alias1).call(depth0,"enterNewReport",{"name":"polyglot","hash":{},"data":data})) != null ? stack1 : "")
    + "</a></p>-->\n\n";
},"useData":true});

this["JST"]["_attachments/templates/PostUserRegistrationMenuView.handlebars"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, alias1=helpers.helperMissing;

  return "<h1>"
    + ((stack1 = (helpers.polyglot || (depth0 && depth0.polyglot) || alias1).call(depth0,"RegistrationComplete",{"name":"polyglot","hash":{},"data":data})) != null ? stack1 : "")
    + "</h1>\n<p>\n    "
    + ((stack1 = (helpers.polyglot || (depth0 && depth0.polyglot) || alias1).call(depth0,"doYouwant",{"name":"polyglot","hash":{},"data":data})) != null ? stack1 : "")
    + "\n</p>\n<p><a data-role=\"button\" id=\"newReportLink\" class=\"btn btn-primary btn-lg\">"
    + ((stack1 = (helpers.polyglot || (depth0 && depth0.polyglot) || alias1).call(depth0,"enterNewReport",{"name":"polyglot","hash":{},"data":data})) != null ? stack1 : "")
    + "</a></p>\n<p><a data-role=\"button\" id=\"registrationLink\" class=\"btn btn-primary btn-lg\">"
    + ((stack1 = (helpers.polyglot || (depth0 && depth0.polyglot) || alias1).call(depth0,"registerIndividualButton",{"name":"polyglot","hash":{},"data":data})) != null ? stack1 : "")
    + "</a></p>\n\n\n";
},"useData":true});

this["JST"]["_attachments/templates/ReportLayout.handlebars"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div id=\"report-header-region\"></div>\n<div id=\"report-listing-region\"></div>\n\n\n";
},"useData":true});

this["JST"]["_attachments/templates/ReportRecordItemView.handlebars"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "<td class=\"recordName\"><a href=\"#show/case/"
    + alias3(((helper = (helper = helpers._id || (depth0 != null ? depth0._id : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"_id","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3((helpers.polyglot || (depth0 && depth0.polyglot) || alias1).call(depth0,(depth0 != null ? depth0.question : depth0),{"name":"polyglot","hash":{},"data":data}))
    + "</a></td>\n<td class=\"recordTs\">\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.Gender : depth0),{"name":"if","hash":{},"fn":this.program(2, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.DOB : depth0),{"name":"if","hash":{},"fn":this.program(4, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.Name : depth0),{"name":"if","hash":{},"fn":this.program(6, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\n</td>\n<td class=\"recordTs\">"
    + alias3(((helper = (helper = helpers.lastModifiedAt || (depth0 != null ? depth0.lastModifiedAt : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"lastModifiedAt","hash":{},"data":data}) : helper)))
    + "</td>\n";
},"2":function(depth0,helpers,partials,data) {
    return this.escapeExpression((helpers.polyglot || (depth0 && depth0.polyglot) || helpers.helperMissing).call(depth0,(depth0 != null ? depth0.Gender : depth0),{"name":"polyglot","hash":{},"data":data}))
    + "<br/>";
},"4":function(depth0,helpers,partials,data) {
    var helper;

  return this.escapeExpression(((helper = (helper = helpers.DOB || (depth0 != null ? depth0.DOB : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"DOB","hash":{},"data":data}) : helper)))
    + "<br/>";
},"6":function(depth0,helpers,partials,data) {
    var helper;

  return this.escapeExpression(((helper = (helper = helpers.Name || (depth0 != null ? depth0.Name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"Name","hash":{},"data":data}) : helper)))
    + "<br/>";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.question : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\n";
},"useData":true});

this["JST"]["_attachments/templates/ReportView.handlebars"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, alias1=helpers.helperMissing;

  return "<table id=\"records\">\n    <thead><tr>\n        <th>"
    + ((stack1 = (helpers.polyglot || (depth0 && depth0.polyglot) || alias1).call(depth0,"Question",{"name":"polyglot","hash":{},"data":data})) != null ? stack1 : "")
    + "</th>\n        <th>"
    + ((stack1 = (helpers.polyglot || (depth0 && depth0.polyglot) || alias1).call(depth0,"Details",{"name":"polyglot","hash":{},"data":data})) != null ? stack1 : "")
    + "</th>\n        <th>"
    + ((stack1 = (helpers.polyglot || (depth0 && depth0.polyglot) || alias1).call(depth0,"dateModified",{"name":"polyglot","hash":{},"data":data})) != null ? stack1 : "")
    + "</th>\n    </tr></thead>\n    <tbody></tbody>\n</table>\n";
},"useData":true});

this["JST"]["_attachments/templates/ScanRetry.handlebars"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, alias1=helpers.helperMissing;

  return "<p>"
    + ((stack1 = (helpers.polyglot || (depth0 && depth0.polyglot) || alias1).call(depth0,"cannotId",{"name":"polyglot","hash":{},"data":data})) != null ? stack1 : "")
    + "</p>\n<p><a data-role=\"button\" id=\"scanRetry\" class=\"btn btn-primary btn-lg\">"
    + ((stack1 = (helpers.polyglot || (depth0 && depth0.polyglot) || alias1).call(depth0,"scanAgain",{"name":"polyglot","hash":{},"data":data})) != null ? stack1 : "")
    + "</a></p>\n<!--<p><a data-role=\"button\" id=\"displayEnroll\" class=\"btn btn-primary btn-lg\">Enroll</a></p>-->\n<p>"
    + ((stack1 = (helpers.polyglot || (depth0 && depth0.polyglot) || alias1).call(depth0,"clickEnroll",{"name":"polyglot","hash":{},"data":data})) != null ? stack1 : "")
    + "</p>\n<p><a data-role=\"button\" id=\"enroll\" class=\"btn btn-primary btn-lg\">"
    + ((stack1 = (helpers.polyglot || (depth0 && depth0.polyglot) || alias1).call(depth0,"enroll",{"name":"polyglot","hash":{},"data":data})) != null ? stack1 : "")
    + "</a></p>\n<div id=\"enrollResults\"></div>\n";
},"useData":true});

this["JST"]["_attachments/templates/ScanVerifyView.handlebars"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, alias1=helpers.helperMissing;

  return "<h2>"
    + ((stack1 = (helpers.polyglot || (depth0 && depth0.polyglot) || alias1).call(depth0,"Instructions",{"name":"polyglot","hash":{},"data":data})) != null ? stack1 : "")
    + "</h2>\n<p><i>"
    + ((stack1 = (helpers.polyglot || (depth0 && depth0.polyglot) || alias1).call(depth0,"clientInstructions",{"name":"polyglot","hash":{},"data":data})) != null ? stack1 : "")
    + "</i>\n    "
    + ((stack1 = (helpers.polyglot || (depth0 && depth0.polyglot) || alias1).call(depth0,"clientText",{"name":"polyglot","hash":{},"data":data})) != null ? stack1 : "")
    + "<p>\n    <p>\n    <strong>"
    + ((stack1 = (helpers.polyglot || (depth0 && depth0.polyglot) || alias1).call(depth0,"consentQuestion",{"name":"polyglot","hash":{},"data":data})) != null ? stack1 : "")
    + "</strong>\n    </p>\n<h3>"
    + ((stack1 = (helpers.polyglot || (depth0 && depth0.polyglot) || alias1).call(depth0,"consentProceed",{"name":"polyglot","hash":{},"data":data})) != null ? stack1 : "")
    + "</h3>\n<p>"
    + ((stack1 = (helpers.polyglot || (depth0 && depth0.polyglot) || alias1).call(depth0,"scanInstructions",{"name":"polyglot","hash":{},"data":data})) != null ? stack1 : "")
    + "</p>\n<p>\n    <label for=\"Finger\">"
    + ((stack1 = (helpers.polyglot || (depth0 && depth0.polyglot) || alias1).call(depth0,"Finger",{"name":"polyglot","hash":{},"data":data})) != null ? stack1 : "")
    + "</label>\n    <select id=\"Finger\" name=\"Finger\">\n        <option value=\"0\">Null</option>\n        <option value=\"6\">L1</option>\n        <option value=\"7\">L2</option>\n        <option value=\"8\">L3</option>\n        <option value=\"9\">L4</option>\n        <option value=\"10\">L5</option>\n        <option selected=\"selected\" value=\"1\">R1</option>\n        <option value=\"2\">R2</option>\n        <option value=\"3\">R3</option>\n        <option value=\"4\">R4</option>\n        <option value=\"5\">R5</option>\n    </select>\n    <a data-role=\"button\" id=\"identifyIndividual\" class=\"btn btn-primary btn-lg ladda-button\" data-style=\"expand-right\"><span class=\"ladda-label\">Scan</span></a>\n    <div id=\"uploadFailed\">\n        <p id=\"uploadFailedMessage\"></p>\n        <a data-role=\"button\" id=\"continueAfterFail\" class=\"btn btn-primary btn-lg ladda-button\" data-style=\"expand-right\"><span class=\"ladda-label\">"
    + ((stack1 = (helpers.polyglot || (depth0 && depth0.polyglot) || alias1).call(depth0,"Continue",{"name":"polyglot","hash":{},"data":data})) != null ? stack1 : "")
    + "</span></a>\n    </div>\n</p>\n\n<div id=\"message\"></div>\n\n<p>"
    + ((stack1 = (helpers.polyglot || (depth0 && depth0.polyglot) || alias1).call(depth0,"scanSendLogs",{"name":"polyglot","hash":{},"data":data})) != null ? stack1 : "")
    + "</p>\n<p>\n    <a data-role='button' class='btn btn-primary btn-lg' id='verifySendLogs'>"
    + ((stack1 = (helpers.polyglot || (depth0 && depth0.polyglot) || alias1).call(depth0,"sendLogs",{"name":"polyglot","hash":{},"data":data})) != null ? stack1 : "")
    + "</a>\n</p>\n\n<div id=\"progress\"></div>\n";
},"useData":true});

this["JST"]["_attachments/templates/SiteNavView.handlebars"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, alias1=helpers.helperMissing;

  return "<div id=\"statusIcons\"></div>\n<div class=\"container\" id=\"navbarContainer\">\n    <div class=\"navbar-header\">\n        <button type=\"button\" class=\"navbar-toggle\" data-toggle=\"collapse\" data-target=\".navbar-collapse\">\n            <span class=\"sr-only\">Toggle navigation</span>\n            <span class=\"icon-bar\"></span>\n            <span class=\"icon-bar\"></span>\n            <span class=\"icon-bar\"></span>\n        </button>\n        <a href=\"#\"><img src=\"images/KiwiPrints_black.png\"/></a>\n    </div>\n    <div class=\"collapse navbar-collapse\">\n        <ul class=\"nav navbar-nav\">\n            <!--<li class=\"siteNav\"><a href=\"#\">"
    + ((stack1 = (helpers.polyglot || (depth0 && depth0.polyglot) || alias1).call(depth0,"Home",{"name":"polyglot","hash":{},"data":data})) != null ? stack1 : "")
    + "</a></li>-->\n            <li class=\"siteNav\"><a href=\"#\">"
    + ((stack1 = (helpers.polyglot || (depth0 && depth0.polyglot) || alias1).call(depth0,"Login",{"name":"polyglot","hash":{},"data":data})) != null ? stack1 : "")
    + "</a></li>\n            <li class=\"siteNav\" id=\"settingsLink\"><a href=\"#sync\">"
    + ((stack1 = (helpers.polyglot || (depth0 && depth0.polyglot) || alias1).call(depth0,"Settings",{"name":"polyglot","hash":{},"data":data})) != null ? stack1 : "")
    + "</a></li>\n            <li class=\"siteNav\" id=\"patientEncountersLink\"><a href=\"#displayUserScanner\">"
    + ((stack1 = (helpers.polyglot || (depth0 && depth0.polyglot) || alias1).call(depth0,"PatientEncounters",{"name":"polyglot","hash":{},"data":data})) != null ? stack1 : "")
    + "</a></li>\n        </ul>\n    </div><!--/.nav-collapse -->\n</div>\n";
},"useData":true});

this["JST"]["_attachments/templates/StatcView.handlebars"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "";
},"useData":true});

this["JST"]["_attachments/templates/UserRegistrationView.handlebars"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<script id=\"UserRegistrationView\" type=\"text/x-handlebars-template\">\n  <p>User Registration</p>\n  <input type=\"text\" name=\"gender\" id=\"gender\" placeholder=\"Gender\"/>\n  <input type=\"text\" name=\"dob\" id=\"dob\" placeholder=\"DOB: Month / YYYY\"/>\n  <p><a data-role=\"button\" id=\"submitUserRegistration\" class=\"btn btn-primary btn-lg\">Press to Register</a></p>\n</script>";
},"useData":true});

this["JST"]["_attachments/templates/UserReportMenu.handlebars"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, alias1=helpers.helperMissing;

  return "<!--<report-form></report-form>-->\n<h1>"
    + ((stack1 = (helpers.polyglot || (depth0 && depth0.polyglot) || alias1).call(depth0,"newReport",{"name":"polyglot","hash":{},"data":data})) != null ? stack1 : "")
    + "</h1>\n\n<div role=\"heading\">\n    <legend>"
    + ((stack1 = (helpers.polyglot || (depth0 && depth0.polyglot) || alias1).call(depth0,"ClickFormName",{"name":"polyglot","hash":{},"data":data})) != null ? stack1 : "")
    + "</legend>\n</div>\n\n<p>\n    <a data-role=\"button\" id=\"TrichiasisSurgery\" class=\"btn btn-primary btn-lg\">"
    + ((stack1 = (helpers.polyglot || (depth0 && depth0.polyglot) || alias1).call(depth0,"trichiasisSurgery",{"name":"polyglot","hash":{},"data":data})) != null ? stack1 : "")
    + "</a><br/>\n</p>\n<p>\n    <a data-role=\"button\" id=\"PostOperativeEpilation\" class=\"btn btn-primary btn-lg\">"
    + ((stack1 = (helpers.polyglot || (depth0 && depth0.polyglot) || alias1).call(depth0,"PostOperativeEpilation",{"name":"polyglot","hash":{},"data":data})) != null ? stack1 : "")
    + "</a><br/>\n</p>\n<p>\n    <a data-role=\"button\" id=\"PostOperativeFollowup\" class=\"btn btn-primary btn-lg\">"
    + ((stack1 = (helpers.polyglot || (depth0 && depth0.polyglot) || alias1).call(depth0,"postOperativeFollowup",{"name":"polyglot","hash":{},"data":data})) != null ? stack1 : "")
    + "</a>\n</p>\n<p>\n    <a data-role=\"button\" id=\"PostOperativeFollowup_1day\" class=\"btn btn-primary btn-lg\">"
    + ((stack1 = (helpers.polyglot || (depth0 && depth0.polyglot) || alias1).call(depth0,"postOperativeFollowup_1day",{"name":"polyglot","hash":{},"data":data})) != null ? stack1 : "")
    + "</a>\n</p>\n<p>\n    <a data-role=\"button\" id=\"PostOperativeFollowup_7_14_days\" class=\"btn btn-primary btn-lg\">"
    + ((stack1 = (helpers.polyglot || (depth0 && depth0.polyglot) || alias1).call(depth0,"postOperativeFollowup_7_14_days",{"name":"polyglot","hash":{},"data":data})) != null ? stack1 : "")
    + "</a>\n</p>\n<p>\n    <a data-role=\"button\" id=\"PostOperativeFollowup_3_6_months\" class=\"btn btn-primary btn-lg\">"
    + ((stack1 = (helpers.polyglot || (depth0 && depth0.polyglot) || alias1).call(depth0,"postOperativeFollowup_3_6_months",{"name":"polyglot","hash":{},"data":data})) != null ? stack1 : "")
    + "</a>\n</p>\n\n";
},"useData":true});

this["JST"]["_attachments/templates/VerifyView.handlebars"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, alias1=helpers.helperMissing;

  return "<p>"
    + ((stack1 = (helpers.polyglot || (depth0 && depth0.polyglot) || alias1).call(depth0,"verifyAdmin",{"name":"polyglot","hash":{},"data":data})) != null ? stack1 : "")
    + "</p>\n<p>\n    <label for=\"Finger\">"
    + ((stack1 = (helpers.polyglot || (depth0 && depth0.polyglot) || alias1).call(depth0,"Finger",{"name":"polyglot","hash":{},"data":data})) != null ? stack1 : "")
    + "</label>\n    <select id=\"Finger\" name=\"Finger\">\n        <option value=\"0\">Null</option>\n        <option value=\"6\">L1</option>\n        <option value=\"7\">L2</option>\n        <option value=\"8\">L3</option>\n        <option value=\"9\">L4</option>\n        <option value=\"10\">L5</option>\n        <option selected=\"selected\" value=\"1\">R1</option>\n        <option value=\"2\">R2</option>\n        <option value=\"3\">R3</option>\n        <option value=\"4\">R4</option>\n        <option value=\"5\">R5</option>\n    </select>\n    <a data-role=\"button\" id=\"identifyAdmin\" class=\"btn btn-primary btn-lg ladda-button\" data-style=\"expand-right\"><span class=\"ladda-label\">Scan</span></a>\n    <div id=\"uploadFailed\">\n        <p id=\"uploadFailedMessage\"></p>\n        <a data-role=\"button\" id=\"continueAfterFail\" class=\"btn btn-primary btn-lg ladda-button\" data-style=\"expand-right\"><span class=\"ladda-label\">"
    + ((stack1 = (helpers.polyglot || (depth0 && depth0.polyglot) || alias1).call(depth0,"Continue",{"name":"polyglot","hash":{},"data":data})) != null ? stack1 : "")
    + "</span></a>\n    </div>\n\n</p>\n\n<div id=\"message\"></div>\n\n<p>"
    + ((stack1 = (helpers.polyglot || (depth0 && depth0.polyglot) || alias1).call(depth0,"scanSendLogs",{"name":"polyglot","hash":{},"data":data})) != null ? stack1 : "")
    + "</p>\n<p>\n    <a data-role='button' class='btn btn-primary btn-lg' id='verifySendLogs'>"
    + ((stack1 = (helpers.polyglot || (depth0 && depth0.polyglot) || alias1).call(depth0,"sendLogs",{"name":"polyglot","hash":{},"data":data})) != null ? stack1 : "")
    + "</a>\n</p>\n\n<div id=\"progress\"></div>\n\n\n<!--<style shim-shadowdom>-->\n    <!--paper-progress::shadow #progressContainer {-->\n        <!--height:200%;-->\n        <!--width:200%;-->\n    <!--}-->\n<!--</style>-->\n\n<!--<paper-progress id=\"scan-progress\"></paper-progress>-->\n";
},"useData":true});