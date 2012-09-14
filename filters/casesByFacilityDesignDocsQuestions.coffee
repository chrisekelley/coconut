(doc, req) ->
  if doc.hf and doc.caseid
    for healthFacility in req.query.healthFacilities.split(",")
      if doc.hf is healthFacility
        return true
  else if doc._id is "_design/#{Backbone.couch_connector.config.ddoc_name}"
    return true
  else if doc.collection is "question"
    return true
  else
    return false
