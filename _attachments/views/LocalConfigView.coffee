class LocalConfigView extends Backbone.View
  el: '#content'

  render: ->
    @$el.html "
      <form id='local-config'>
        <h1>Configure your Coconut system</h1>
        <label for='coconut-cloud' >Coconut Cloud URL</label>
        <input type='text' name='coconut-cloud' size='35' value='https://kiwicentral.org/coconut-central'></input>
        <br/>
        <br/>
        <label for='username' class='localConfigCols'>Username</label>
        <input type='text' name='username' size='15'></input><br/>
        <label for='password' class='localConfigCols'>Password</label>
        <input type='password' name='password' size='15'></input>
        <fieldset id='mode-fieldset'>
          <legend>Mode</legend>
            <label for='cloud'>Cloud (reporting system)</label>
            <input id='cloud' name='mode' type='radio' value='cloud'></input>
            <label for='mobile'>Mobile (data collection, probably on a tablet)</label>
            <input id='mobile' name='mode' type='radio' value='mobile'></input>
        </fieldset>
        <br/>
        <br/>
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
    "click #local-config button": "save"

  save: ->
    localConfig = $('#local-config').toObject()
    coconutCloud = $("input[name=coconut-cloud]").val()
    username = localConfig.username
    password = localConfig.password
    coconutCloudConfigURL = "#{coconutCloud}/coconut.config"
    replacement = 'https://' + username + ':' + password + '@'
    coconutCloudConfigURLCreds = coconutCloudConfigURL.replace(/https:\/\//,replacement)
    if localConfig.mode and coconutCloud?
      $('#message').html "Downloading configuration file from #{coconutCloudConfigURL}<br/>"
      $.ajax
        url: coconutCloudConfigURLCreds
        username: username
        password: password
        dataType: "jsonp"
        success: (cloudConfig, text) ->
          $('#message').append "Saving configuration file<br/>"
          delete cloudConfig["_rev"]
          Coconut.config.save cloudConfig,
            success: ->
              $('#message').append "Creating local configuration file<br/>"
              cloud_credentials = cloudConfig.cloud_credentials
              Coconut.config.local = new LocalConfig()
              Coconut.config.local.save {_id: "coconut.config.local", coconutCloud: coconutCloud, cloud_credentials: cloud_credentials},
                success: ->
                  $('#message').append "Local configuration file saved<br/>"
                  sync = new Sync()
                  sync.save null,
                    success: ->
                        #  sync.getFromCloud
                        $('#message').append "5 second delay before reloading home.<br/>"
                        _.delay ->
                            Coconut.router.navigate("",false)
                            document.location.reload()
                        , 5000
                        #  TODO: make getFromJSs deferred
                        $('#message').append "Loading local form definitions<br/>"
                        sync.getFromJSs()
                        Coconut.syncView = new SyncView()
                        Coconut.syncView.sync.replicateFromServer()
                        Coconut.syncView.sync.replicateToServer()
#                        replicateToServerOpts =
#                            success: ->
#                                MoreOpts =
#                                    success: ->
#                                        Coconut.router.navigate("",false)
#                                        location.reload()
#                                    error: (model, err, cb) ->
#                                        console.log JSON.stringify err
#                                Coconut.syncView.sync.replicateToServer(MoreOpts)
#                            error: (model, err, cb) ->
#                                console.log JSON.stringify err
#                        Coconut.syncView = new SyncView()
#                        Coconut.syncView.sync.replicateFromServer(replicateToServerOpts)
#                        Coconut.syncView = new SyncView()
#                        Coconut.syncView.sync.replicateToServer()
#                        Coconut.syncView.sync.replicateFromServer()
                    error: (model, err, cb) ->
                      console.log JSON.stringify err
                error: (model, err, cb) ->
                  console.log JSON.stringify err
        error: (error, text, errorThrown) ->
          message = "Couldn't find config file at #{coconutCloudConfigURL}. Error: " + JSON.stringify(error)
          console.log message
          alert(message)

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
      "cloud_credentials": "user:pass",
      "date_format": "YYYY-MM-DD",
      "datetime_format": "YYYY-MM-DD HH:mm:ss",
      "sync_mode": "couchdb-sync",
      "synchronization_target": "https://kiwicentral.org/projectdb/"
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
