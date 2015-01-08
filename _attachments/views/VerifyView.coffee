VerifyView = Backbone.Marionette.ItemView.extend
#    template: "VerifyView"
    template: JST["_attachments/templates/VerifyView.handlebars"]()
    className: "itemView" # this class will be added to the wrapping div when you render the view
    events:
      "click #identifyIndividual": "identifyIndividual"
      "click #identifyAdmin": "identifyAdmin"
      "click #scan": "scanNewIndividual"
      "click #verifyYes": "displayNewUserRegistration"
      "click #verifyNo": "displayNewUserRegistration"
      "click #refresh": "refresh"
      "click #verifySendLogs":  "sendLogs"

    nextUrl:null

    hasCordova:true

    initialize: ->
      @sync = new Sync()
      if typeof cordova is "undefined"
#        console.log "cordova is not defined."
        @hasCordova = false

    displayNewUserRegistration: ->
      Coconut.router.navigate "userRegistration", true
      return

    diplayNewReportMenu: ->

    scanNewIndividual:(e) ->
#      @scan e, "userRegistration"
      @scan e, "Enroll"
      return

    register:(e) ->
      @scan e, "Enroll"
      return

    identifyIndividual:(e) ->
      @scan e, "Identify", "Individual"
      return

    identifyAdmin:(e) ->
      @scan e, "Identify", "Admin"
      return

    scan: (event, method, user) ->
      this.eventUrl = @nextUrl
      display = (message) ->
        console.log "display message: " + message
        display = document.getElementById("message") # the message div
        lineBreak = document.createElement("br") # a line break
        label = document.createTextNode(message) # create the label
        display.appendChild lineBreak # add a line break
        display.appendChild label # add the message node
        return

      revealSlider = (event, method, user) =>
        startLadda = (e) =>
          l = Ladda.create(e.currentTarget)
          l.start()
#          if not typeof cordova is "undefined"

          findUserFromServiceUUID = (serviceUuid, scannerPayload) ->
            viewOptions = {}
            users = new SecondaryIndexCollection
            users.fetch
              fetch: 'query',
              options:
                query:
                  key: serviceUuid,
                  include_docs: true,
                  fun: 'by_serviceUuid'
              success: =>
                console.log 'by_serviceUuid returned: ' + JSON.stringify users
                l.stop()
                # Update the top nav strip
                #                      Controller.displaySiteNav()
                if users.length > 0
                  if user == "Admin"
                    adminUser = users.first()
                    console.log 'Coconut.currentAdmin: ' + JSON.stringify adminUser
                    Coconut.currentAdmin = adminUser
                    CoconutUtils.setSession('currentAdmin', adminUser.get('email'))
                    Coconut.router.navigate "displayUserScanner", true
                  else
                    user = users.first()
                    console.log 'Coconut.currentClient: ' + JSON.stringify user
                    Coconut.currentClient = user
                    CoconutUtils.setSession('currentClient', true)
                    Coconut.router.navigate "displayClientRecords", true
                else
                  console.log 'Strange. This user was identified but is not registered.'
                  uuid = CoconutUtils.uuidGenerator(30)
                  Coconut.currentClient = new Result
                    _id: uuid
                    serviceUuid: serviceUuid
                    Template: scannerPayload.Template
                  console.log "currentClient: " + JSON.stringify Coconut.currentClient
                  Coconut.scannerPayload = scannerPayload
                  if user == "Admin"
                    Coconut.trigger "displayAdminRegistrationForm"
                  else
                    Coconut.trigger "displayUserRegistrationForm"

          if @hasCordova
            console.log "method: " + method
            if (method == "Identify")
              cordova.plugins.SecugenPlugin.scan (results) =>
                finger = $('#Finger').val();
                payload =  {}
                payload["Key"] = Coconut.config.get("AfisServerKey")
                payload["Name"] = Coconut.config.get("AfisProjectName")
                payload["Template"] = results
                payload["Finger"] = finger
                console.log "payload: " + JSON.stringify payload
                urlServer = Coconut.config.get("AfisServerUrl")  + Coconut.config.get("AfisServerUrlFilepath") + "Identify";
                $.post(urlServer, payload,
                (result) =>
                  console.log "response from service: " + JSON.stringify result
                  try
                    scannerPayload = payload["Template"]
                    statusCode = result.StatusCode
                    serviceUuid = result.UID
                    console.log 'query for serviceUuid: ' + serviceUuid
                  catch error
                    console.log error
                    $('#progress').append "<br/>Error uploading scan: " + error
                  if statusCode != null && statusCode == 1
                    findUserFromServiceUUID(serviceUuid, scannerPayload)
                  if statusCode != null && statusCode == 4
#                    Status Code 4 = No Person found
                    l.stop()
                    if user == 'Admin'
                      CoconutUtils.setSession('currentAdmin', null)
                    else
                      CoconutUtils.setSession('currentClient', true)
                    $('#progress').append "<br/>Enrolling new fingerprint. "
                    urlServer = Coconut.config.get("AfisServerUrl")  + Coconut.config.get("AfisServerUrlFilepath") + "Enroll";
                    $.post(urlServer, payload,
                      (result) =>
                        console.log "response from service: " + JSON.stringify result
                        statusCode = result.StatusCode
                        serviceUuid = result.UID
                        console.log "statusCode: " + statusCode
                        if statusCode != null
                          if statusCode == 1
                            $( "#progress" ).html( 'Fingerprint enrolled. Success!' );
                            Coconut.currentClient = new Result
                              serviceUuid:serviceUuid
                              Template: payload.Template
                            if typeof user != 'undefined' && user != null && user == 'user'
                              Coconut.trigger "displayUserRegistrationForm"
                            else
                              Coconut.trigger "displayAdminRegistrationForm"
                          else
                            $( "#progress" ).html( 'Problem enrolling fingerprint. StatusCode: ' +  statusCode);
                            Coconut.trigger "displayEnroll"
                    , "json")

                  else
                    l.stop()
                    $( "#message").html("No match - you must register.")
                    Coconut.scannerPayload = scannerPayload
                    if  @nextUrl?
                      Coconut.router.navigate @nextUrl, true
                    else
                      Coconut.router.navigate "registration", true
                , "json")
              , (error) ->
                  console.log("SecugenPlugin.identify error: " + error)
                  message = error
                  if error == "Scan failed: Unable to capture fingerprint. Please kill the app in the Task Manager and restart the app."
                      message = '<p>' + polyglot.t("scanFailed") + '<br/><a data-role="button" id="refresh" class="btn btn-primary btn-lg" data-style="expand-right">Refresh</a></p>'
                  $("#message").html message
                  l.stop()
            else
              cordova.plugins.SecugenPlugin.register (results) =>
                console.log "SecugenPlugin.register: " + results
                $( "#message").html(results)
                l.stop()
                obj = JSON.parse(results)
                statusCode = obj.StatusCode
                serviceUuid = obj.UID
                if statusCode == 1
                  uuid = CoconutUtils.uuidGenerator(30)
                  Coconut.currentClient = new Result
                    _id:uuid
                    serviceUuid:serviceUuid
                  console.log "currentClient: " + JSON.stringify Coconut.currentClient
                  $( "#message").html("No match - you must register.")
                  if  @nextUrl?
                    Coconut.router.navigate @nextUrl, true
                  else
                    Coconut.router.navigate "registration", true
                else
                  Coconut.router.navigate "displayAdminScanner", true
          else
            i=1
            interval = setInterval =>
              if i == 50
                uuid = CoconutUtils.uuidGenerator(30)
                serviceUuid = CoconutUtils.uuidGenerator(30)
                console.log("Go to next page. Generated UUID: " + uuid)
                Coconut.scannerPayload =
                  "Template":"46 4D 52 00 20 32 30 00 00 00 00 F0 00 00 01 04 01 2C 00 C5 00 C5 01 00 00 00 00 23 40 83 00 40 71 00 40 52 00 53 75 00 80 33 00 6B 8A 00 80 A9 00 6C 72 00 40 5B 00 81 7D 00 80 93 00 87 71 00 40 28 00 99 91 00 40 17 00 A1 11 00 40 44 00 A9 8D 00 40 81 00 B8 78 00 40 1B 00 BA 10 00 40 73 00 C2 80 00 40 3F 00 C3 94 00 40 DF 00 C7 E8 00 80 4B 00 CE 11 00 40 32 00 D6 91 00 40 16 00 D8 14 00 80 3D 00 E0 10 00 40 1A 00 E2 11 00 40 A3 00 E3 EE 00 40 38 00 F3 94 00 40 9E 00 F5 73 00 40 6D 00 FB 00 00 40 56 00 FC 93 00 40 A8 00 FC E3 00 40 26 00 FC 11 00 40 40 00 FD 10 00 40 7C 01 01 F8 00 80 C9 01 03 EA 00 40 38 01 04 9A 00 80 6D 01 07 7F 00 40 9E 01 0E 6C 00 40 32 01 10 17 00 40 88 01 11 EE 00 80 88 01 23 72 00 00 00 ",
                  "Name":"Test CK",
                  "email":"someone@somewhere.com",
                  "Finger":1,
                  "Key":"HH8XGFYSDU9QGZ833"
                Coconut.currentClient = new Result
                  _id:uuid
                  serviceUuid:serviceUuid
                $( "#message").html("Scanning complete!")
                CoconutUtils.setSession('currentAdmin', Coconut.scannerPayload.email)
                l.stop()
                if  @nextUrl?
                  Coconut.router.navigate @nextUrl, true
                else
                  Coconut.router.navigate "registration", true
#                  window.setTimeout =>
#                    Coconut.router.navigate("registration")
#                  , 2000
                clearInterval(interval);
              i++
            ,50
          return false;
        console.log "revealSlider"
        progress = document.querySelector("paper-progress")
        button = document.querySelector("paper-button")
#        thisSliderId = sliderId  if typeof sliderId isnt "undefined"
#        startProgress()
        startLadda(event)
        repeat = undefined
        maxRepeat = 5
#        addEventListener "polymer-ready", ->
#          startProgress()
#          return

#        return
      revealSlider event, method, user


        #      if not typeof cordova is "undefined"
#        cordova.plugins.SecugenPlugin.register ((results) ->
#          #                display(JSON.stringify(results));
#          console.log("SecugenPlugin register: " + results)
#          $("#message").html results
#          return
#
#        #                revealSlider();
#        ), (e) ->
#          console.log "Error: " + e
#          $("#message").html "Error:" + results
#          return
#
#
#      #                display("Error: " + e);
#      else
#        console.log "Cordova is not initialised. Plugins will not work."
#        revealSlider event, method
#      return


    #        revealSlider: function(e) {
    #            console.log("click scan.")
    #
    #            $( "#slider" ).show();
    #
    #            $( "#slider" ).parent().find('input').hide();
    #            $( "#slider" ).parent().find('.ui-slider-track').css('margin','0 15px 0 15px');
    #            $( "#slider" ).parent().find('.ui-slider-handle').hide();
    #            $( "#slider" ).slider({
    #                value: 0
    #                // setup the rest ...
    #            });
    #
    #            var i = 1;
    #            var interval = setInterval(function(){
    #                Coconut.progressBar.setValue('#slider',i);
    #                if(i === 50) {
    #                    console.log("Go to next page.")
    #                    $( "#message").html("Scanning complete!")
    #                    window.setTimeout(function() { Coconut.router.navigate("registration")}, 2000);
    #                    clearInterval(interval);
    #                }
    #                i++;
    #            },50);
    #        },

    #
    #         appends @message to the message div:
    #
    display: (message) ->
      console.log "display message."
      display = document.getElementById("message") # the message div
      lineBreak = document.createElement("br") # a line break
      label = document.createTextNode(message) # create the label
      display.appendChild lineBreak # add a line break
      display.appendChild label # add the message node
      return

    refresh: ->
        Coconut.router.navigate("",false)
        location.reload()

    sendLogs: ->
        @sync.sendLogs('#progress')

#        initSlider: function () {
#            $('<input>').appendTo('[ data-role="content"]').attr({'name':'slider','id':'slider','data-highlight':'true','min':'0','max':'100','value':'50','type':'range'}).slider({
#                create: function( event, ui ) {
#                    $(this).parent().find('input').hide();
#                    $(this).parent().find('input').css('margin-left','-9999px'); // Fix for some FF versions
#                    $(this).parent().find('.ui-slider-track').css('margin','0 15px 0 15px');
#                    $(this).parent().find('.ui-slider-handle').hide();
#                }
#            }).slider("refresh");
#
#            // Test
#            var i = 1;
#            var interval = setInterval(function(){
#                Coconut.progressBar.setValue('#slider',i);
#                if(i === 99) {
#                    console.log("Go to next page.")
#                    $( "#message").html("Scanning complete!")
#                    clearInterval(interval);
#                }
#                i++;
#            },100);
#        }

