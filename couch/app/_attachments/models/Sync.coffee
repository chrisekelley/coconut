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

  getFromDocs: (options) =>
    fileList = ['admin_registration.js','individual_registration.js','post_operative_followup.js','trichiasis_surgery.js','user.admin.js', 'test_client.js']
    @loadJSON '/docs/'+file for file in fileList

  getFromJSs: (options) =>
    list = [adminRegistrationForm,trichiasisForm,userAdminForm,individualRegistrationForm,postOperativeFollowupForm,testClient]
    @saveJS item for item in list

  saveJS:(json) =>
    savedQuestion = new Result
    savedQuestion.collection = 'question'
    savedQuestion.save json,
      success: ->
        console.log 'json saved for ' + savedQuestion.get("_id")
      error: (model, err, cb) ->
        console.log "Error: " + JSON.stringify err
        console.log new Error().stack

  loadJSON: (file) =>
    $.ajax 'file',
      type: 'GET'
      dataType: 'jsonp'
      error: (jqXHR, textStatus, errorThrown) ->
        $('body').append "AJAX Error: #{textStatus}"
        console.log "Error: " + textStatus
      success: (data, textStatus, jqXHR) ->
        console.log file + 'retrieved'
        savedQuestion = new Result
        savedQuestion.collection = 'question'
        savedQuestion.save data,
          success: ->
            console.log file + 'saved'
          error: (model, err, cb) ->
            console.log "Error: " + JSON.stringify err
            console.log new Error().stack

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
#                    $.couch.logout()
                    console.log("TODO: enable User.currentUser.id")
                    _.delay ->
                      document.location.reload()
                    , 2000
#                    logFile =
#                      collection: "log"
#                      action: "getFromCloud"
#                      user: 'testUser'
##                      user: User.currentUser.id
#                      time: moment().format(Coconut.config.get "date_format")
#                    Backbone.sync.defaults.db.post logFile
#                    ,
#                      (err, response) =>
##                        @log "Sending log messages to cloud."
#                        console.log "TODO: fix sendLogMessagesToCloud"
#                        @sendLogMessagesToCloud
#                          success: =>
#                            @log "Finished, refreshing app in 5 seconds..."
#                            @fetch
#                              error: (error) => @log "Unable to fetch Sync doc: #{JSON.stringify(error)}"
#                              success: =>
#                                @save
#                                  last_get_success: true
#                                  last_get_time: new Date().getTime()
#                                options?.success?()
#                          error: (err) =>
#                            console.log "error: " + JSON.stringify err
#                        _.delay ->
#                          document.location.reload()
#                        , 5000
#                      error: (error) => @log "Could not create log file #{JSON.stringify(error)}"

  replicateFromServer: (options) ->
    options = {} if !options
    filter = (doc) ->
      if doc._id != "_design/by_clientId" && doc._id != "_design/by_serviceUuid" && doc._id != "SyncLog" && doc._id != "coconut.config" && doc._id != "coconut.config.local" && doc._id != "version" && doc.noClientPush != "true"
          return doc
    opts =
      live:true
      filter:filter
      withCredentials:true
      complete: (result) ->
        if typeof result != 'undefined' && result != null && result.ok
          Coconut.debug "replicateFromServer - onComplete: Replication is fine. "
        else
          Coconut.debug "replicateFromServer - onComplete: Replication message: " + JSON.stringify result
      error: (result) ->
          Coconut.debug "error: Replication error: " + JSON.stringify result
      timeout: 60000
    _.extend options, opts
    Backbone.sync.defaults.db.replicate.from(Coconut.config.cloud_url_with_credentials(), options).on('uptodate', (result) ->
      if typeof result != 'undefined' && result.ok
        console.log "uptodate: Replication is fine. "
        options.complete()
        if typeof options.success != 'undefined'
          options.success()
      else
        console.log "uptodate: Replication error: " + JSON.stringify result).on('change', (info)->
          Coconut.debug "Change: " + JSON.stringify info
        ).on('complete', (info)->
          Coconut.debug "Complete: " + JSON.stringify info
        )
#    Coconut.menuView.checkReplicationStatus();

  replicateForms: (options) ->
    console.log("coconut_forms_url: " + Coconut.config.coconut_forms_url_with_credentials())
    options = {} if !options
    opts =
        live:true
        withCredentials:true
        complete: (result) ->
            if typeof result != 'undefined' && result != null && result.ok
              Coconut.debug "replicateFromServer - onComplete: Replication is fine. "
            else
              Coconut.debug "replicateFromServer - onComplete: Replication message: " + JSON.stringify result
        error: (result) ->
          Coconut.debug "error: Replication error: " + JSON.stringify result
        timeout: 60000
    _.extend options, opts
    Backbone.sync.defaults.db.replicate.from(Coconut.config.coconut_forms_url_with_credentials(), options).on('uptodate', (result) ->
      if typeof result != 'undefined' && result.ok
        console.log "uptodate: Form Replication is fine. "
        Coconut.syncView.sync.populateForms()
        options.complete()
        if typeof options.success != 'undefined'
          options.success()
      else
        console.log "uptodate: Form Replication error: " + JSON.stringify result).on('change', (info)->
          Coconut.debug "Form Replication Change: " + JSON.stringify info
        ).on('complete', (info)->
          Coconut.debug "Form Replication Complete: " + JSON.stringify info
        )

  populateForms: () ->
    model = new Backbone.Model
      _id: Coconut.config.coconut_forms_design_doc()
    model.fetch
      options:
        get:
          attachments: true
    .then (result) ->
#      console.log("result: " + JSON.stringify((result)))
      for key of result._attachments
        obj = result._attachments[key];
        console.log("key: " + key)
        decodedData = decodeURIComponent(escape(window.atob( obj.data )));
        console.log("key: " + key + " decodedData: " + JSON.stringify((decodedData)))
        obj = JSON.parse  decodedData
        nuKey = key.replace(".json","")
        model = new Backbone.Model
          _id: nuKey
        model.save obj,
          success: (model) =>
            console.log 'Saving... ' + model.get("_id")
          error: (model, resp) =>
            console.log 'Error: ' + JSON.stringify(model) + " resp: " + resp;


  replicate: (messageId)=>
    @replicateToServer
      success: ->
          $(messageId).append "<br/>Data sent to the server.<br/>"
          @sync.replicateFromServer
              success: ->
                  $(messageId).append "Data received from the server.<br/>"
              error: (json, error)->
                  $(messageId).append "Error receiving data to the server. Error: " + error + "<br/>"
      error: (json, error)->
          $(messageId).append "Error sending data to the server. Error: " + error + "<br/>"

  sendLogs: (messageId) =>
    logger.getLogs null, 100, (log) =>
      console.log("Generated logs")
      versionText = "Kiwi App version: " + Coconut.version_code + ".\n"
      completeLog = versionText.concat(log)
      CoconutUtils.saveLog(null,"Logcat log", completeLog)
      $('#progress').append "<br/>Logs saved. Data will now be replicated with the server.<br/>"
      @replicate(messageId)

  replicateToServer: (options) ->
    options = {} if !options
    filter = (doc) ->
      if doc._id != "_design/by_clientId" && doc._id != "_design/by_serviceUuid" && doc._id != "SyncLog" && doc._id != "coconut.config" && doc._id != "coconut.config.local" && doc._id != "version" && doc.noClientPush != "true"
          return doc

    opts =
      live:true
      continuous: true
#      batch_size:5
      filter: filter
#      batches_limit:1
      withCredentials:true
#      auth:
#        username:account.username
#        password:account.password
      complete: (result) ->
        if typeof result != 'undefined' && result != null && result.ok
          Coconut.debug "replicateToServer - onComplete: Replication is fine. "
        else
          Coconut.debug "replicateToServer - onComplete: Replication message: " + JSON.stringify result
      error: (result) ->
        Coconut.debug "error: Replication error: " + JSON.stringify result
      timeout: 60000
    _.extend options, opts
    Backbone.sync.defaults.db.replicate.to(Coconut.config.cloud_url_with_credentials(), options).on('uptodate', (result) ->
      if typeof result != 'undefined' && result.ok
        console.log "uptodate: Replication is fine. "
        options.complete()
        if typeof options.success != 'undefined'
          options.success()
      else
        console.log "uptodate: Replication error: " + JSON.stringify result).on('change', (info)->
      Coconut.debug "Change: " + JSON.stringify info
    ).on('complete', (info)->
      Coconut.debug "Complete: " + JSON.stringify info
    )
#    Coconut.menuView.checkReplicationStatus();

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
#        doc_ids.push "_design/#{Coconut.config.design_doc_name()}"
        console.log JSON.stringify doc_ids
#        position = doc_ids.indexOf("_design/#{Coconut.config.design_doc_name()}");
#        doc_ids.splice(position, 1)
#        console.log JSON.stringify doc_ids
        @log "Updating #{doc_ids.length} docs (users, forms and the design document). Please wait."
        @replicateFromServer _.extend options,
          replicationArguments:
            doc_ids: doc_ids


