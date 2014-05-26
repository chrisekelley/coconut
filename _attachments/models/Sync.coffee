class Sync extends Backbone.Model
  initialize: ->
    @set
      _id: "SyncLog"

  url: "/sync"

  target: -> Coconut.config.cloud_url()

  last_send: =>
    return @get("last_send_result")

  was_last_send_successful: =>
    return false if @get("last_send_error") is true
    # even if last_send_error was false need to check log
    last_send_data = @last_send()
    return false unless last_send_data?
    return true if last_send_data.no_changes? and last_send_data.no_changes is true
    return (last_send_data.docs_read is last_send_data.docs_written) and last_send_data.doc_write_failures is 0

  last_send_time: =>
    result = @get("last_send_time")
    if result
      return moment(@get("last_send_time")).fromNow()
    else
      return "never"

  was_last_get_successful: =>
    return @get "last_get_success"

  last_get_time: =>
    result = @get("last_get_time")
    if result
      return moment(@get("last_get_time")).fromNow()
    else
      return "never"


  sendToCloud: (options) ->
    @fetch
      error: (error) => @log "Unable to fetch Sync doc: #{JSON.stringify(error)}"
      success: =>
        @log "Checking for internet. (Is #{Coconut.config.cloud_url()} is reachable?) Please wait."
        $.ajax
          dataType: "jsonp"
          url: Coconut.config.cloud_url()
          error: (error) =>
            @log "ERROR! #{Coconut.config.cloud_url()} is not reachable. Do you have enough airtime? Are you on WIFI?  Either the internet is not working or the site is down: #{JSON.stringify(error)}"
            options.error()
            @save
              last_send_error: true
          success: =>
            @log "#{Coconut.config.cloud_url()} is reachable, so internet is available."
            @log "Creating list of all results on the tablet. Please wait."
            $.couch.db(Coconut.config.database_name()).view "#{Coconut.config.design_doc_name()}/results",
              include_docs: false
              error: (result) =>
                @log "Could not retrieve list of results: #{JSON.stringify(error)}"
                options.error()
                @save
                  last_send_error: true
              success: (result) =>
                @log "Synchronizing #{result.rows.length} results. Please wait."
                resultIDs = _.pluck result.rows, "id"

                $.couch.db(Coconut.config.database_name()).saveDoc
                  collection: "log"
                  action: "sendToCloud"
                  user: User.currentUser.id
                  time: moment().format(Coconut.config.get "date_format")
                ,
                  error: (error) => @log "Could not create log file: #{JSON.stringify(error)}"
                  success: =>
                    $.couch.replicate(
                      Coconut.config.database_name(),
                      Coconut.config.cloud_url_with_credentials(),
                        success: (result) =>
                          @log "Send data finished: created, updated or deleted #{result.docs_written} results on the server."
                          @save
                            last_send_result: result
                            last_send_error: false
                            last_send_time: new Date().getTime()
                          @sendLogMessagesToCloud
                            success: ->
                              options.success()
                            error: (error) ->
                              @save
                                last_send_error: true
                              options.error(error)
                      ,
                        doc_ids: resultIDs
                    )
                    Coconut.menuView.checkReplicationStatus()

  log: (message) =>
    Coconut.debug message
#    @save
#      last_get_log: @get("last_get_log") + message


  sendLogMessagesToCloud: (options) ->
    @fetch
      error: (error) => @log "Unable to fetch Sync doc: #{JSON.stringify(error)}"
      success: =>
        $.couch.db(Coconut.config.database_name()).view "#{Coconut.config.design_doc_name()}/byCollection",
          key: "log"
          include_docs: false
          error: (error) =>
            @log "Could not retrieve list of log entries: #{JSON.stringify(error)}"
            options.error(error)
            @save
              last_send_error: true
          success: (result) =>
            @log "Sending #{result.rows.length} log entries. Please wait."
            logIDs = _.pluck result.rows, "id"

            $.couch.replicate(
              Coconut.config.database_name(),
              Coconut.config.cloud_url_with_credentials(),
                success: (result) =>
                  @save
                    last_send_result: result
                    last_send_error: false
                    last_send_time: new Date().getTime()
                  @log "Successfully sent #{result.docs_written} log messages to the server."
                  options.success()
                error: (error) =>
                  @log "Could not send log messages to the server: #{JSON.stringify(error)}"
                  @save
                    last_send_error: true
                  options.error?(error)
              ,
                doc_ids: logIDs
            )
            Coconut.menuView.checkReplicationStatus()


  getFromCloud: (options) =>
    @fetch
      error: (error) => @log "Unable to fetch Sync doc: #{JSON.stringify(error)}"
      success: =>
        @log "Checking that #{Coconut.config.cloud_url()} is reachable. Please wait."
        $.ajax
          dataType: "jsonp"
          url: Coconut.config.cloud_url()
          error: (error) =>
            @log "ERROR! #{Coconut.config.cloud_url()} is not reachable. Do you have enough airtime? Are you on WIFI?  Either the internet is not working or the site is down: #{JSON.stringify(error)}"
            options.error?(error)
          success: =>
            @log "#{Coconut.config.cloud_url()} is reachable, so internet is available."
            @fetch
              success: =>
                @log "Updating users, forms and the design document. Please wait."
                @replicateApplicationDocs
                  error: (error) =>
                    $.couch.logout()
                    @log "ERROR updating application: #{JSON.stringify(error)}"
                    @save
                      last_get_success: false
                    options?.error?(error)
                  success: =>
                    $.couch.logout()

                    $.couch.db(Coconut.config.database_name()).saveDoc
                      collection: "log"
                      action: "getFromCloud"
                      user: User.currentUser.id
                      time: moment().format(Coconut.config.get "date_format")
                    ,
                      error: (error) => @log "Could not create log file #{JSON.stringify(error)}"
                      success: =>

                        @log "Sending log messages to cloud."
                        @sendLogMessagesToCloud
                          success: =>
                            @log "Finished, refreshing app in 5 seconds..."
                            @fetch
                              error: (error) => @log "Unable to fetch Sync doc: #{JSON.stringify(error)}"
                              success: =>
                                @save
                                  last_get_success: true
                                  last_get_time: new Date().getTime()
                                options?.success?()
                                _.delay ->
                                  document.location.reload()
                                , 5000

  replicate: (options) ->
    $.couch.login
      name: Coconut.config.get "local_couchdb_admin_username"
      password: Coconut.config.get "local_couchdb_admin_password"
      success: ->
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
        Coconut.menuView.checkReplicationStatus()
      error: ->
        console.log "Unable to login as local admin for replicating the design document (main application)"

  replicateApplicationDocs: (options) =>
    # Updating design_doc, users & forms
    $.ajax
      dataType: "jsonp"
# version file is missing
      url: "#{Coconut.config.cloud_url_with_credentials()}/_design/#{Coconut.config.design_doc_name()}/_view/docIDsForUpdating"
      include_docs: false
      error: (a,b,error) =>
        options.error?(error)
      success: (result) =>
        doc_ids = _.pluck result.rows, "id"
        # Not needed since design_doc has option to index itself and is marked as applicationDoc
        doc_ids.push "_design/#{Coconut.config.design_doc_name()}"
        @log "Updating #{doc_ids.length} docs (users, forms and the design document). Please wait."
        @replicate _.extend options,
          replicationArguments:
            doc_ids: doc_ids
