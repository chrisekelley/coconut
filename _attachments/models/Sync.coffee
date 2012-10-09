class Sync extends Backbone.Model
  initialize: ->
    @set
      _id: "SyncLog"

  url: "/sync"

  last_send: =>
    return @get("last_send_result")?.history[0]

  last_send_time: =>
    result = @get("last_send_time") || @last_send?.start_time
    
    if result
      return moment(result).fromNow()
    else
      return "never"

  last_get: =>
    return @get("last_get_log")

  last_get_time: =>
    result = @get("last_get_time")
    if result
      return moment(@get("last_get_time")).fromNow()
    else
      return "never"

  sendToCloud: (options) ->
    @fetch
      success: =>
        $(".sync-sent-status").html "pending"
        switch Coconut.config.get "sync_mode"
          when "couchdb-sync"
            $.couch.replicate(
              Coconut.config.database_name(),
              Coconut.config.cloud_url_with_credentials(),
                success: (response) =>
                  @save
                    last_send_result: response
                  options.success()
                error: ->
                  options.error()
            )
          when "http-post"
            resultCollection = new ResultCollection()
            resultCollection.fetch
              success: =>
                notSentResults = resultCollection.notSent()
                saveSyncLog = _.after notSentResults.length, =>
                  @save
                    last_send_time: new Date()
                    Coconut.menuView.update()
                    $(".sync-sent-status").html "a few seconds ago"
                _.each resultCollection.notSent(), (result) =>
                  $.ajax
                    type: "POST"
                    #contentType: "application/json"
                    url: Coconut.config.get("http-post-target")
                    #data: JSON.stringify(result.toJSON())
                    data: result.toJSON()
                    success: =>
                      result.set "sentTo", Coconut.config.get("http-post-target")
                      result.set("complete", "true") if Coconut.config.get("completion_mode") is "on-send"
                      result.save()
                      saveSyncLog()
                    error: (error) =>
                      $(".sync-sent-status").html "Error saving to #{Coconut.config.get("http-post-target")}: #{JSON.stringify(error)}"

  log: (message) =>
    Coconut.debug message
    $(".sync-get-status").html message
    $("#message").append message + "<br/>"
#    @save
#      last_get_log: @get("last_get_log") + message

  getFromCloud: (options) =>
    @fetch
      success: =>
        $.couch.login
          name: Coconut.config.get "local_couchdb_admin_username"
          password: Coconut.config.get "local_couchdb_admin_password"
          complete: =>
            @log "Updating application design document..."
            @replicateDesignDoc
              success: =>
                @log "Updating user accounts and question sets..."
                @replicateApplicationDocs
                  success: =>
                    $.couch.logout()
                    @log "Finished"
                    @save
                      last_get_time: new Date().getTime()
                    options?.success?()
                    document.location.reload()
                  error: (error) =>
                    $.couch.logout()
                    @log "Error updating application: #{error}"
              error: (error) =>
                $.couch.logout()
                @log "Error updating design document"
          error: (error) =>
            @log "Error logging in as local admin: #{error}, trying to proceed anyway in case we are in admin party"

  getNewNotifications: (options) ->
    $.couch.db(Coconut.config.database_name()).view "#{Coconut.config.design_doc_name()}/rawNotificationsConvertedToCaseNotifications"
      descending: true
      include_docs: true
      limit: 1
      success: (result) ->
        mostRecentNotification = result.rows?[0]?.doc.date

        url = "#{Coconut.config.cloud_url_with_credentials()}/_design/#{Coconut.config.database_name()}/_view/notifications?&ascending=true&include_docs=true&skip=1"
        url += "&startkey=\"#{mostRecentNotification}\"" if mostRecentNotification

        healthFacilities = WardHierarchy.allWards district: User.currentUser.get("district")
        healthFacilities = [] unless User.currentUser.get("district")?
        $.ajax
          url: url
          dataType: "jsonp"
          success: (result) ->
            _.each result.rows, (row) ->
              notification = row.doc

              if _.include(healthFacilities, notification.hf)

                result = new Result
                  question: "Case Notification"
                  MalariaCaseID: notification.caseid
                  FacilityName: notification.hf
                  Shehia: notification.shehia
                  Name: notification.name
                result.save()

                notification.hasCaseNotification = true
                $.couch.db(Coconut.config.database_name()).saveDoc notification
            options.success?()

  replicate: (options) ->
    $.couch.login
      name: Coconut.config.get "local_couchdb_admin_username"
      password: Coconut.config.get "local_couchdb_admin_password"
      complete: ->
        $.couch.replicate(
          Coconut.config.cloud_url_with_credentials(),
          Coconut.config.database_name(),
            success: ->
              options.success()
            error: ->
              options.error()
          ,
            options.replicationArguments
        )
      error: ->
        console.log "Unable to login as local admin for replicating the design document (main application),  trying to proceed anyway in case we are in admin party."

  replicateDesignDoc: (options) =>
    @replicate _.extend options,
      replicationArguments:
        doc_ids: ["_design/#{Backbone.couch_connector.config.ddoc_name}"]

  replicateApplicationDocs: (options) =>
    @replicate _.extend options,
      replicationArguments:
        filter: "#{Backbone.couch_connector.config.ddoc_name}/docsForApplication"
