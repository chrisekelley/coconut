window.polyglot = new Polyglot();

window.polyglot.extend({
  "Home": "Início",
  "verifyAdmin": "verifyAdmin",
  "Finger": "Finger",
  "Continue": "Continue",
  "scanSendLogs": "scanSendLogs",
  "Login": "Conecte-Se",
  "Settings": "Configurações",
  "PatientEncounters": "Visitas",
  "sendLogs": "sendLogs"
});

Handlebars.registerHelper('polyglot', function(phrase) {
  return window.polyglot.t(phrase);
});

if (typeof window.CoconutUtils === "undefined" || window.CoconutUtils === null) {
  window.CoconutUtils = {};
}

CoconutUtils.fetchTranslation = function(language) {
  var deferred, options, opts, translation;
  if (!options) {
    options = {};
  }
  deferred = $.Deferred();
  translation = new Translation({
    _id: language
  });
  opts = _.extend(options, opts);
  translation.fetch({
    success: function(record) {
      var json;
      json = record.toJSON();
      window.polyglot = new Polyglot();
      window.polyglot.extend(json);
      Handlebars.registerHelper('polyglot', function(phrase) {
        return window.polyglot.t(phrase);
      });
      return deferred.resolve();
    },
    error: function(error, response) {
      return console.log("Unable to fetch translation for " + " languge:" + languge + " model:" + JSON.stringify(error) + " response: " + response);
    }
  });
  return deferred.promise();
};
