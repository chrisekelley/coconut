class SyncView extends Backbone.View
  initialize: ->
    @sync = new Sync()

  el: '#content'

  render: =>
      @$el.html "
        <h2>Cloud Server: <span class='sync-target'>#{@sync.target()}</span></h2>
        <a href='#sync/send'>Send data (last done: <span class='sync-sent-status'></span>)</a>
        <a href='#sync/get'>Get data (last done: <span class='sync-get-status'></span>)</a>
        "
      $("a").button()
      @update()

  update: =>
    @sync.fetch
      success: =>
        $(".sync-sent-status").html @sync.last_send_time()
        $(".sync-get-status").html @sync.last_get_time()
      # synclog doesn't exist yet, create it and re-render
      error: =>
        @sync.save()
        _.delay(@update,1000)
    
