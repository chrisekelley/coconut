class SyncView extends Backbone.View
  initialize: ->
    @sync = new Sync()

  el: '#content'

  events:
    "click #refreshLog":  "refreshLog"

  render: =>
      @$el.html "
        <h2>Cloud Server: <span class='sync-target'>#{@sync.target()}</span></h2>
        <a data-role='button' class='btn btn-primary btn-lg' href='#sync/send'>Send data</a>
        <h2>Replication Log</h2>
        <p>The replication log displays the result of replication to the master server.
        <br/><a data-role='button' class='btn btn-primary btn-lg' id='refreshLog'>Refresh log</a>
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

