class LocalConfigView extends Backbone.View
  el: '#content'

  render: ->
    @$el.html "
      <form id='local-config'>
        <h1>Configure your Coconut system</h1>
        <label>Coconut Cloud URL</label>
        <input type='text' name='coconut-cloud' size='60' value='https://kiwicentral.org:6984/coconut-central/'></input>
        <fieldset id='mode-fieldset'>
          <legend>Mode</legend>
            <label for='cloud'>Cloud (reporting system)</label>
            <input id='cloud' name='mode' type='radio' value='cloud'></input>
            <label for='mobile'>Mobile (data collection, probably on a tablet)</label>
            <input id='mobile' name='mode' type='radio' value='mobile'></input>
        </fieldset>
        <button>Save</button>
        <div id='message'></div>
      </form>
    "
    unless Coconut.config.get("mode")?
      $("#mode-fieldset").hide()
      $("#mobile").prop("checked",true)

#    @$el.find('input[type=radio],input[type=checkbox]').checkboxradio()
#    @$el.find('button').button()
#    @$el.find('input[type=text]').textinput()
    Coconut.config.local?.fetch
      success: ->
        js2form($('#local-config').get(0), Coconut.config.local.toJSON())
      error: ->
        $('#message').html "Complete the fields before continuing"

  events:
    "click #local-config button": "saveLocal"

  save: ->
    localConfig = $('#local-config').toObject()
    coconutCloud = $("input[name=coconut-cloud]").val()
    coconutCloudConfigURL = "#{coconutCloud}/coconut.config"
    if localConfig.mode and coconutCloud?
      $('#message').html "Downloading configuration file from #{coconutCloudConfigURL}<br/>"
      $.ajax
        url: coconutCloudConfigURL
        dataType: "jsonp"
        success: (cloudConfig) ->
          $('#message').append "Saving configuration file<br/>"
          delete cloudConfig["_rev"]
          Coconut.config.save cloudConfig,
            success: ->
              $('#message').append "Creating local configuration file<br/>"
              localConfig = new LocalConfig()
              localConfig.save {_id: "coconut.config.local"},
                success: ->
                  $('#message').append "Local configuration file saved<br/>"
                  sync = new Sync()
                  sync.save null,
                    success: ->
                      $('#message').append "Updating application<br/>"
                      sync.getFromDocs
                        success: ->
                          Coconut.router.navigate("",false)
                          location.reload()
                        error: (model, err, cb) ->
                          console.log JSON.stringify err
                    error: (model, err, cb) ->
                      console.log JSON.stringify err
                error: (model, err, cb) ->
                  console.log JSON.stringify err
        error: (error) ->
          console.log "Couldn't find config file at #{coconutCloudConfigURL}"
      return false
    else
      $('#message').html "Fields incomplete"
      return false

  saveLocal: ->
    localConfig = $('#local-config').toObject()
    coconutCloud = $("input[name=coconut-cloud]").val()
    coconutCloudConfigURL = "#{coconutCloud}/coconut.config"
    cloudConfig =
      "_id": "coconut.config",
      "_rev": "11-7b57beeb6ba84273897732a2a798b4b1",
      "title": "Coconut Clinic",
      "cloud": "localhost:5984",
      "local_couchdb_admin_username": "admin",
      "local_couchdb_admin_password": "password",
      "cloud_credentials": "coco:blond4eva!",
      "date_format": "YYYY-MM-DD",
      "datetime_format": "YYYY-MM-DD HH:mm:ss",
      "sync_mode": "couchdb-sync",
      "synchronization_target": "https://kiwicentral.org:6984/coconut-moz-2014/"
    Coconut.config.save cloudConfig,
      success: ->
        $('#message').append "Creating local configuration file<br/>"
        Coconut.config.local = new LocalConfig()
        Coconut.config.local.save {_id: "coconut.config.local", coconutCloud: coconutCloud},
          success: ->
            $('#message').append "Local configuration file saved<br/>"
            sync = new Sync()
            sync.save null,
              success: ->
                $('#message').append "Updating application<br/>"
#                TODO: make getFromDocs deferred
                _.delay ->
                  document.location.reload()
                , 3000
                #                      sync.getFromCloud
                sync.getFromJSs
                  success: ->
                    Coconut.syncView.sync.replicateToServer()
                    Coconut.router.navigate("",false)
                    location.reload()
                  error: (model, err, cb) ->
                    console.log JSON.stringify err
              error: (model, err, cb) ->
                console.log JSON.stringify err
          error: (model, err, cb) ->
            console.log JSON.stringify err
      error: (model, err, cb) ->
        console.log JSON.stringify err
    return false
