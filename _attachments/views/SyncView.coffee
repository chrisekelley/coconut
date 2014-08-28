class SyncView extends Backbone.View
  initialize: ->
    @sync = new Sync()

  el: '#content'

  render: =>
      @$el.html "
        <h2>Cloud Server: <span class='sync-target'>#{@sync.target()}</span></h2>
        <a data-role='button' class='btn btn-primary btn-lg' href='#sync/send'>Send data</a>
        "
      $("a").button()
      @update()

  update: =>
    @sync.fetch
      success: =>
        $(".sync-sent-status").html if @sync.was_last_send_successful() then @sync.last_send_time() else "#{@sync.last_send_time()} - last attempt FAILED"
        $(".sync-get-status").html if @sync.was_last_get_successful() then @sync.last_get_time() else "#{@sync.last_get_time()} - last attempt FAILED"
      error: =>
        console.log "synclog doesn't exist yet, create it and re-render"
        @sync.save()
        _.delay(@update,1000)
