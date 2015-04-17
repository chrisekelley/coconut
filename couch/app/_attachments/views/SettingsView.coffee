class SettingsView extends Backbone.View
  initialize: ->
    @sync = new Sync()
    user = new User
      _id: "user.admin"
    user.fetch
      success: ->
          langChoice = user.get('langChoice')
          this.langChoice = langChoice
          console.log("langChoice from doc: " + langChoice)
  el: '#content'
  langChoice:''

  events:
    "click #replicate":  "replicate"
    "click #refreshLog":  "refreshLog"
    "click #updateForms":  "updateForms"
    "click #sendReplicateLogs":  "sendReplicateLogs"
    "click #viewReports":  "viewReports"
    "click #goOffline":  "goOffline"
    "change #langChoice": "changeLanguage"

  render: =>
      @$el.html "
        <h2>" + polyglot.t("server") + "</h2>
        <p><span class='sync-target'>#{@sync.target()}</span></p>
        <p>#{polyglot.t("version")}: #{Coconut.version_code}</p>
        <a data-role='button' class='btn btn-primary btn-lg' id='replicate'>" + polyglot.t("sendData") + "</a>
        <a data-role='button' class='btn btn-primary btn-lg' id='updateForms'>" + polyglot.t("updateForms") + "</a>
        <a data-role='button' class='btn btn-primary btn-lg' id='sendReplicateLogs'>" + polyglot.t("sendLogs") + "</a>
        <span id='progress'></span>
        <h2>" + polyglot.t("Reports") + "</h2>
        <p>
          <a data-role='button' class='btn btn-primary btn-lg' id='viewReports'>" + polyglot.t("viewReports") + "</a>
        </p>
        <h2>" + polyglot.t("SimulateOffline") + "</h2>
        <p>" + polyglot.t("SimulateOfflineText") + "</p>
        <p>
          <a data-role='button' class='btn btn-primary btn-lg' id='goOffline'>" + polyglot.t("SimulateOffline") + "</a>
        </p>
        <h2>" + polyglot.t("SetLanguage") + "</h2>
        <p>
            " + polyglot.t("LangChoice") +  "&nbsp;<span id='langCurrently'>" + langChoice + "</span><br/>" +
        "<select id='langChoice'>
                <option value=''>--Select --</option>
                <option value='en'>en</option>
                <option value='pt'>pt</option>
            </select>
        </p>
        <h2>" + polyglot.t("replicationLog") + "</h2>
        <p>" + polyglot.t("replicationLogDescription") + "
        <br/><br/><a data-role='button' class='btn btn-primary btn-lg' id='refreshLog'>" + polyglot.t("refreshLog") + "</a>
        </p>
        <div id=\"replicationLog\"></div>"
      $("a").button()
#      @update()

#  update: =>
#    @sync.fetch
#      success: =>
##        $(".sync-sent-status").html if @sync.was_last_send_successful() then @sync.last_send_time() else "#{@sync.last_send_time()} - last attempt FAILED"
##        $(".sync-get-status").html if @sync.was_last_get_successful() then @sync.last_get_time() else "#{@sync.last_get_time()} - last attempt FAILED"
##        console.log "Coconut.replicationLog: " + Coconut.replicationLog
#        $("replicationLog").append(Coconut.replicationLog)
#      error: (json,msg)=>
#        console.log "synclog doesn't exist yet, create it and re-render" + msg
#        @sync.save()
#        _.delay(@update,1000)


  replicate: =>
    Coconut.syncView.sync.replicateToServer
        success: ->
            $('#progress').append "<br/>Data sent to the server.<br/>"
            Coconut.syncView.refreshLog()
            Coconut.syncView.sync.replicateFromServer
                success: ->
                    $('#progress').append "Data received from the server.<br/>"
                    Coconut.syncView.refreshLog()
                error: (json, error)->
                    $('#progress').append "Error receiving data to the server. Error: " + error + "<br/>"
                    Coconut.syncView.refreshLog()
        error: (json, error)->
            $('#progress').append "Error sending data to the server. Error: " + error + "<br/>"
            Coconut.syncView.refreshLog()

  refreshLog: =>
    now = moment(new Date()).format(Coconut.config.get "datetime_format") + "<br/>"
    $("#replicationLog").html(now + Coconut.replicationLog)

  updateForms: =>
    opts =
      success: ->
          $('#progress').append "<br/>Downloaded form definitions with the server.<br/>"
          langId = polyglot.t("id")
          $('#progress').append "Refreshing the current language: " + langId + "<br/>"
          deferred = CoconutUtils.fetchTranslation langId
          deferred.done ->
              console.log("Refreshed translation.")
      error: ->
          $('#progress').append "Error while trying to download form definitions with the server.<br/>"
    @sync.replicateForms(opts)

  sendReplicateLogs: =>
    logger.getLogs null, 100, (log) =>
        console.log("Generated logs")
        versionText = "Kiwi App version: " + Coconut.version_code + ".\n"
        completeLog = versionText.concat(log)
        CoconutUtils.saveLog(null,"Logcat log", completeLog)
        $('#progress').append "<br/>Logs saved. Data will now be replicated with the server.<br/>"
        @replicate()

  changeLanguage: =>
      langChoice = $('#langChoice').val();
      console.log("langChoice: " + langChoice)
      if (langChoice != '')
#        $.cookie('langChoice', langChoice);
        user = new User
            _id: "user.admin"
        user.fetch
            success: ->
                docLangChoice = user.get('langChoice')
                console.log("langChoice from doc: " + docLangChoice)
                user.set('langChoice',langChoice)
                user.save null,
                    success: ->
                        console.log("langChoice saved: " + user.get('langChoice'))
                        deferred = CoconutUtils.fetchTranslation langChoice
                        deferred.done ->
                          console.log("Got translation for" + langChoice)
                          Coconut.router.navigate("",false)
                          location.reload()
                    error: (json, msg) ->
                        console.log("Error saving langChoice  " + msg)

  viewReports: =>
    console.log("viewReports: ")
    Coconut.trigger "displayAllRecords"

  goOffline: ->
    networkTimeout = 1
    Coconut.networkTimeout = networkTimeout
    console.log("Simulating offline. NetworkTimeout: " + networkTimeout)
    alert("We're offline. Close and restart the app when you're done testing.")