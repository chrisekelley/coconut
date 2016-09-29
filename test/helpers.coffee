class Utils

  @loadDevelopmentPacks: (callback) ->
    $.ajax
      dataType: "json"
      url: "packs.json"
      error: (res) ->
        callback(res)
      success: (res) ->
        Tangerine.db.bulkDocs res, (error, doc) ->
          if error then callback(error) else callback()

