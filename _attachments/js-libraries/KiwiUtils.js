if (typeof window.KiwiUtils === "undefined" || window.KiwiUtils === null) {
  window.KiwiUtils = {};
}

KiwiUtils.fetchDistricts = function() {
  var deferred, districts, options, opts;
  if (!options) {
    options = {};
  }
  deferred = $.Deferred();
  districts = new Backbone.Model({
    _id: 'districts'
  });
  opts = _.extend(options, opts);
  districts.fetch({
    success: function(record) {
      KiwiUtils.districts = record.toJSON();
      return deferred.resolve();
    },
    error: function(error, response) {
      return console.log("Unable to fetch translation for " + " languge:" + languge + " model:" + JSON.stringify(error) + " response: " + response);
    }
  });
  return deferred.promise();
};
