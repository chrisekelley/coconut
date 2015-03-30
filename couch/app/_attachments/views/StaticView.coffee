StaticView = Backbone.Marionette.ItemView.extend
  template: JST["_attachments/templates/StatcView.handlebars"]

  #        el: "#userMenu",

  #        className: 'app ui-content', // this class will be added to the wrapping div when you render the view


  ui:
    checkboxes: "input[type=checkbox]"

  events:
    "click #scanRetry": "scanRetry"
    "click #register": "register"
    "click #registrationLink": "displayUserScanner"
    "click #newReportLink": "newReportLink"
    "click #displayEnroll": "displayEnroll"
    "click #enroll": "enroll"

  initialize: ->
  #            $('input[type=checkbox]').button();
  #            $(function() {
  #                $(":checkbox").checkbox();
  #            });

  hasCordova:true

  initialize: ->
    if typeof cordova is "undefined"
#      console.log "cordova is not defined."
      @hasCordova = false

  scanRetry: ->
    console.log "scanRetry"
    if @user != null
      Coconut.trigger "displayUserScanner"
    else
      Coconut.trigger "displayAdminScanner"
    return

  displayUserScanner: ->
    console.log "displayUserScanner"
    Coconut.trigger "displayUserScanner"
    return

  displayEnroll: ->
    console.log "displayEnroll"
    if @user != null
      Coconut.trigger "displayEnrollUser"
    else
      Coconut.trigger "displayEnrollAdmin"
    return

  enroll: ->
    console.log "enroll"
    if @hasCordova
      if typeof Coconut.scannerPayload != 'undefined'
        console.log 'we got Coconut.scannerPayload: ' + JSON.stringify Coconut.scannerPayload
        urlServer = Coconut.config.get("AfisServerUrl")  + Coconut.config.get("AfisServerUrlFilepath") + "Enroll";
        $.post(urlServer, Coconut.scannerPayload,
        (result) =>
          console.log "response from service: " + JSON.stringify result
          statusCode = result.StatusCode
          serviceUuid = result.UID
          console.log "statusCode: " + statusCode
          if statusCode != null
            if statusCode == 1
              $( "#enrollResults" ).html( 'Success!' );
              Coconut.currentClient = new Result
                serviceUuid:serviceUuid
                Template: Coconut.scannerPayload.Template
              if typeof @user != 'undefined' && @user != null && @user == 'user'
                Coconut.trigger "displayUserRegistrationForm"
              else
                Coconut.trigger "displayAdminRegistrationForm"
            else
              $( "#enrollResults" ).html( 'Problem.' );
              Coconut.trigger "displayEnroll"
        , "json")
      return
    else
      console.log("Using canned user.")
      Coconut.currentClient = new Result
        serviceUuid:Coconut.currentClient.serviceUuid
        Template: Coconut.scannerPayload.Template
      if typeof @user != 'undefined' && @user != null && @user == 'user'
        Coconut.trigger "displayUserRegistrationForm"
      else
        Coconut.trigger "displayAdminRegistrationForm"

  register: ->
      console.log "register"
      if @user != null
        Coconut.trigger "displayUserRegistrationForm"
      else
        Coconut.trigger "displayAdminRegistrationForm"
      return

  submitRegistration: ->
    console.log "submitRegistration"
    Coconut.trigger "displayUserRegistrationForm"
    return

  newReportLink: ->
    console.log "newReportLink"
    Coconut.trigger "displayReportMenu"
    return
