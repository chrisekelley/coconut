(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['UserRegistrationView'] = template({"compiler":[5,">= 2.0.0"],"main":function(depth0,helpers,partials,data) {
  return "<script id=\"UserRegistrationView\" type=\"text/x-handlebars-template\">\n  <p>User Registration</p>\n  <input type=\"text\" name=\"gender\" id=\"gender\" placeholder=\"Gender\"/>\n  <input type=\"text\" name=\"dob\" id=\"dob\" placeholder=\"DOB: Month / YYYY\"/>\n  <p><a data-role=\"button\" id=\"submitUserRegistration\" class=\"btn btn-primary btn-lg\">Press to Register</a></p>\n</script>";
  },"useData":true});
})();