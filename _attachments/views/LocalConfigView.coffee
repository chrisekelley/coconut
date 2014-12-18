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
      options =
        url: coconutCloudConfigURLCreds
        dataType: "jsonp"
        username: username
        password: password
        error: (xOptions, textStatus) ->
          $('#message').append "There was an error - the username/password were probably incorrect. Error message: " + textStatus + "<br/>"
#        dataFilter: (json, type) ->
#            return json;
        statusCode:
          404: ->
            alert( "page not found" )
          401: ->
            alert( "incorrect username/password" )
        success: (cloudConfig) ->
          $('#message').append "Saving configuration file<br/>"
          delete cloudConfig["_rev"]
          Coconut.config.save cloudConfig,
              success: ->
                  $('#message').html "Downloading configuration file from #{coconutCloudConfigURL}<br/>"
                  $('#message').append "Creating local configuration file<br/>"
                  cloud_credentials = cloudConfig.cloud_credentials
                  Coconut.syncView = new SyncView()
                  $('#message').append "Replicating local form definitions and syncing with the server.<br/>"
                  opts =
                      success: ->
                          repFromOpts =
                              success: ->
                                repToOpts =
                                    success: ->
                                      $('#message').append "Replication from app was successful. Finished with Config. Reloading app in 2 seconds.<br/>"
                                      _.delay ->
                                          Coconut.router.navigate("",false)
                                          document.location.reload()
                                      , 2000
                                    error: (obj, msg)->
                                      $('#message').append "Replication Error:" + msg + "<br/>"
                                $('#message').append "Replication to server was successful.<br/>"
                                Coconut.syncView.sync.replicateToServer(repToOpts)
                              error: (obj, msg)->
                                $('#message').append "Replication Error:" + msg + "<br/>"
                          Coconut.syncView.sync.replicateFromServer(repFromOpts)
                      error: (obj, msg)->
                          $('#message').append "Error fetching Forms. App will not function properly. Error:" + msg + "<br/>"
                  Coconut.config.local = new LocalConfig()
                  Coconut.config.local.save {_id: "coconut.config.local", coconutCloud: coconutCloud, cloud_credentials: cloud_credentials},
                      Coconut.syncView.sync.replicateForms(opts)

              error: (model, err, cb) ->
                  console.log JSON.stringify err
        fail: (jqXHR, textStatus, errorThrown) ->
            # NOTE: error won't be called because the server is not returning proper JSONP response. Sorry.
            message = "Couldn't find config file at #{coconutCloudConfigURL}. Message: "  + textStatus + " Error Thrown: " + JSON.stringify(errorThrown)
            console.log message
            $('#message').append message
            alert( "Error:" + message)
      request = $.ajax options
#        url: coconutCloudConfigURLCreds
        #        dataType: "jsonp"
      return false
    else
      $('#message').html "Fields incomplete"
      return false

