class SyncView extends Backbone.View
  initialize: ->
    @sync = new Sync()
    langChoice = $.cookie('langChoice');

  el: '#content'

  events:
    "click #refreshLog":  "refreshLog"
    "click #updateForms":  "updateForms"
    "click #sendLogs":  "sendLogs"
    "change #langChoice": "changeLanguage"

  render: =>
      @$el.html "
        <h2>" + polyglot.t("server") + "</h2>
        <p><span class='sync-target'>#{@sync.target()}</span></p>
        <p>#{polyglot.t("version")}: #{Coconut.version_code}</p>
        <a data-role='button' class='btn btn-primary btn-lg' href='#sync/send'>" + polyglot.t("sendData") + "</a>
        <a data-role='button' class='btn btn-primary btn-lg' id='updateForms'>" + polyglot.t("updateForms") + "</a>
        <a data-role='button' class='btn btn-primary btn-lg' id='sendLogs'>" + polyglot.t("sendLogs") + "</a>
        <h2>" + polyglot.t("SetLanguage") + "</h2>
        <p>
            " + polyglot.t("LangChoice") +  "&nbsp;<span id='langCurrently'>" + $.cookie('langChoice') + "</span><br/>" +
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
      @update()

  update: =>
    @sync.fetch
      success: =>
#        $(".sync-sent-status").html if @sync.was_last_send_successful() then @sync.last_send_time() else "#{@sync.last_send_time()} - last attempt FAILED"
#        $(".sync-get-status").html if @sync.was_last_get_successful() then @sync.last_get_time() else "#{@sync.last_get_time()} - last attempt FAILED"
#        console.log "Coconut.replicationLog: " + Coconut.replicationLog
        $("replicationLog").append(Coconut.replicationLog)
      error: =>
        console.log "synclog doesn't exist yet, create it and re-render"
        @sync.save()
        _.delay(@update,1000)

  refreshLog: =>
    now = moment(new Date()).format(Coconut.config.get "date_format") + "<br/>"
    $("#replicationLog").html(now + Coconut.replicationLog)

  updateForms: =>
    @sync.replicateForms()

  sendLogs: =>
    logger.getLogs null, 100, (log) =>
        console.log("Generated logs")
        coconutUtils.saveLog(null,"Logcat log", log)

  changeLanguage: =>
      langChoice = $('#langChoice').val();
      console.log("langChoice: " + langChoice)
      if (langChoice != '')
#        $.cookie('langChoice', langChoice);
        user = new User
            _id: "user.admin"
        user.fetch
            success: ->
                langChoice = user.get('langChoice')
                console.log("langChoice from doc: " + user.get('langChoice'))
                user.set('langChoice',langChoice)
                user.save
                    success: ->
                        console.log("langChoice saved: " + user.get('langChoice'))
                    error: (json, msg) ->
                        console.log("Error saving langChoice  " + msg)


        fetchTranslation langChoice
        Coconut.trigger "displaySync"


