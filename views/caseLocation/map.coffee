(document) ->
  if document["HouseholdLocation-latitude"]
    emit document.MalariaCaseID,
      latitude: document["HouseholdLocation-latitude"]
      longitude: document["HouseholdLocation-longitude"]
      timestamp: document["HouseholdLocation-timestamp"]
