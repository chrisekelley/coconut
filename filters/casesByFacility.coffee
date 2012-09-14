(doc, req) ->
  if doc.hf and doc.caseid
    for healthFacility in req.query.healthFacilities.split(",")
      if doc.hf is healthFacility
        return true
  return false
