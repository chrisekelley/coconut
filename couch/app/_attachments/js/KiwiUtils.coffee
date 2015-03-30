if typeof window.KiwiUtils == "undefined" || window.KiwiUtils == null
    window.KiwiUtils = {};

KiwiUtils.fetchDistricts = () ->
  if !options
    options = {}
  deferred = $.Deferred();
  #    Coconut.translation = {} if !Coconut.translation
  districts = new Backbone.Model {_id: 'districts'}
  opts =
    _.extend options, opts
  districts.fetch
    success: (record)->
      KiwiUtils.districts = record.toJSON()
      deferred.resolve()

    error: (error, response) ->
      console.log("Unable to fetch translation for " + " languge:" + languge + " model:" + JSON.stringify(error) + " response: " + response)
  return deferred.promise()

