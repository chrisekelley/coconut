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
    "click #continueAfterFail":  "continueAfterFail",
    "click #submitUserLogin":  "submitUserLogin",
    "click #searchByID":  "searchByID",
    "click #searchByDOB":  "searchByDOB"
    "click #searchButton":  "displaySearchPage"
    "click .loadPatientView":  "searchByIDclicked"

  nextUrl:null

  hasCordova:true

  currentOfflineUser:null

  initialize: ->
    @sync = new Sync()
    if typeof cordova is "undefined"
#        console.log "cordova is not defined."
      @hasCordova = false
    districtJson = KiwiUtils.districts
    districtList = []
    index = 0
    for own key, phrase of districtJson
      if key != '_id' && key != 'id' && key != '_rev' && key != 'noClientPush'
        index++
        district =
          id:key
          name:phrase
        districtList.push  district
    this.districts = districtList

    if !@hasCordova
      if this.options.user == "Admin"
        user = this.options.user
  #      Coconut.currentDistrict = district
        viewOptions = {}
        adminRegdropdown = ""
        adminRegCollection = new SecondaryIndexCollection
        adminRegCollection.fetch
          fetch: 'query',
          options:
            query:
              include_docs: true,
              fun: 'by_AdminRegistration'
          success: =>
  #          console.log JSON.stringify results
#            console.log "Retrieved Admin registrations: " + JSON.stringify adminRegCollection
            adminRegdropdown = "\n<div class=\"form-group\">\n\t<select id=\"formDropdown\" class=\"form-control\">\n<option value=\"\"> -- " + polyglot.t("SelectOne") + " -- </option>\n"
            adminRegCollection.each (adminReg)->
              id = adminReg.get("_id")
              name = adminReg.get("Name")
              option = "<option value=\"" + id + "\">" + name + "</option>\n"
              adminRegdropdown = adminRegdropdown + option
            adminRegdropdown = adminRegdropdown + "\t</select>\n</div>\n"
            $("#adminDropdown").css({
              "display": "block"
            })
            $("#submitUserLogin").css({
              "display": "block"
            })
  #          console.log message
  #          $('#progress').append message
            $("#submitUserLoginMessage").html(adminRegdropdown)
          error: (model, err, cb) ->
            console.log JSON.stringify err

  districts: null

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
    district = $('#District').val();
    if district == ''
      return alert(polyglot.t("districtRequired"))
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

        findUserFromServiceUUID = (serviceUuid, prints, threshold) ->
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
#                  console.log 'Coconut.currentAdmin: ' + JSON.stringify adminUser
                  Coconut.currentAdmin = adminUser
                  CoconutUtils.setSession('currentAdmin', adminUser.get('email'))
                  Coconut.router.navigate "displayUserScanner", true
                else
                  user = users.first()
                  sendClientToRecords(user, threshold)
              else
                message = 'Strange. This user was identified but is not registered. User: ' + user
                console.log message
                $('#progress').append "<br/>" + message
                uuid = CoconutUtils.uuidGenerator(30)
                Coconut.currentClient = new Result
                  _id: uuid
                  serviceUuid: serviceUuid
#                    Template: scannerPayload.Template
                  Fingerprints: prints
                console.log "currentClient: " + JSON.stringify Coconut.currentClient
                if user == "Admin"
                  Coconut.currentAdmin = new Result
                    _id: uuid
                    serviceUuid: serviceUuid
                    Fingerprints: prints
                  console.log "currentAdmin: " + JSON.stringify Coconut.currentAdmin
                  CoconutUtils.setSession('currentAdmin', null)
                  Coconut.trigger "displayAdminRegistrationForm"
                else
                  Coconut.trigger "displayUserRegistrationForm"

        if @hasCordova
          console.log "method: " + method
          if (method == "Identify")
            cordova.plugins.SecugenPlugin.scanFile (results) =>
              finger = $('#Finger').val();
              district = $('#District').val();
              binary = '';
              len = results.byteLength;
              for i in [0...len]
                binary += String.fromCharCode( results[ i ] )
              image = window.btoa( binary );
              payload =  {}
              payload["Key"] = Coconut.config.get("AfisServerKey")
              payload["Name"] = Coconut.config.get("AfisProjectName")
#              payload["Template"] = results
              payload["Template"] = image
              payload["Finger"] = finger
              payload["District"] = district
#              console.log "payload: " + JSON.stringify payload
              lastModifiedAt = Date.now();

              options = new FileUploadOptions();
              options.fileKey = "file";
              options.fileName = district + lastModifiedAt;
              options.mimeType = "image/png";

              params = {};
              params.key = Coconut.config.get("AfisServerKey");

              options.params = params;

              ft = new FileTransfer();

              template = payload.Template
              # Set things up for future handling of multiple fingerprints
              fingerprint = {}
              fingerprint.template = template
              fingerprint.finger = finger
              fingerprint.district = district
              prints = []
              prints.push(fingerprint)
              # used when print upload fails and Continue button is pressed.
              Coconut.currentPrints = prints
              if typeof district != 'undefined'
                Coconut.currentDistrict = district
              # urlServer = Coconut.config.get("AfisServerUrl")  + Coconut.config.get("AfisServerUrlFilepath") + "Identify";
              urlServer = Coconut.config.get("AfisServerUrl")  + Coconut.config.get("AfisServerUrlFilepath");
#                timeout = 15000
              timeout = Coconut.config.get("networkTimeout");
              if (typeof Coconut.networkTimeout != 'undefined')
                timeout = Coconut.networkTimeout
              $('#progress').append "<br/>Fingerprint scanned. Now uploading to server. User: " + user
              $('#progress').append "<br/>Server URL: " + urlServer
              $('#progress').append "<br/>Timeout: " + timeout
#              $.ajaxSetup
#                type:'POST'
#                timeout:timeout
#                cache       : false
#                contentType : false
#                processData : false
#                error: (xhr)=>
#                  l.stop()
#                  @currentOfflineUser = user;
#                  viewOptions = {}
#                  adminRegdropdown = ""
#                  adminRegCollection = new SecondaryIndexCollection
#                  adminRegCollection.fetch
#                    fetch: 'query',
#                    options:
#                      query:
#                        include_docs: true,
#                        fun: 'by_AdminRegistration'
#                    success: =>
#            #          console.log JSON.stringify results
#                      console.log "Retrieved Admin registrations: " + JSON.stringify adminRegCollection
#                      adminRegdropdown = "\n<div class=\"form-group\">\n\t<select id=\"formDropdown\" class=\"form-control\">\n<option value=\"\"> -- " + polyglot.t("SelectOne") + " -- </option>\n"
#                      adminRegCollection.each (adminReg)->
#                        id = adminReg.get("_id")
#                        name = adminReg.get("Name")
#                        option = "<option value=\"" + id + "\">" + name + "</option>\n"
#                        adminRegdropdown = adminRegdropdown + option
#                      adminRegdropdown = adminRegdropdown + "\t</select>\n</div>\n"
#                      if user == 'Admin'
##                      Error uploading scan
##                      Operating in offline-mode. Press Continue to scan a new patient.
#                        message = polyglot.t("errorUploadingScan") + ": " + xhr.statusText + " . " + polyglot.t("offlineScanContinueAdmin")
#                        $("#uploadFailedMessage").html(message + adminRegdropdown)
#                      else
##                      Operating in offline-mode. Press Continue to enroll this new patient.
#                        message = polyglot.t("errorUploadingScan") + ": " + xhr.statusText + " . " + polyglot.t("offlineScanContinueNewPatient")
#                        $("#uploadFailedMessage").html(message)
#                      $("#uploadFailed").css({
#                        "display": "block"
#                      })
#                      console.log message
#                      console.log "Fingerprint server URL: " + urlServer
#                      $('#progress').append message
#                    error: (model, err, cb) ->
#                      console.log JSON.stringify err

#              $.post(urlServer, formData,
#              $.ajax({
#                url         : urlServer,
#                data        : formData}
              postSuccess = (result) =>
                console.log "response from service: " + JSON.stringify result
                $('#progress').append "<br/>Received response from service."
                try
                  if typeof result.response != "undefined"
                    response = JSON.parse(result.response)
                    scannerPayload = payload["Template"]
                    statusCode = response.StatusCode
                    serviceUuid = response.UID
                    threshold = response.Threshold
                    $('#progress').append "<br/>StatusCode: "  + statusCode
                    console.log 'StatusCode: ' + statusCode + 'query for serviceUuid: ' + serviceUuid
                catch error
                  console.log error
                  $('#progress').append "<br/>Error uploading scan: " + error
                if statusCode != null && statusCode == 1
                  $('#progress').append "<br/>Locating user in local database."
                  findUserFromServiceUUID(serviceUuid, prints, threshold)
                else if statusCode != null && statusCode == 4
                  $('#progress').append "<br/>User not in the local database."
#                    Status Code 4 = No Person found
                  l.stop()
                  if user == 'Admin'
                    CoconutUtils.setSession('currentAdmin', null)
                  else
                    CoconutUtils.setSession('currentClient', true)
#                  $('#progress').append "<br/>Enrolling new fingerprint. User: " + user
                  # urlServer = Coconut.config.get("AfisServerUrl")  + Coconut.config.get("AfisServerUrlFilepath") + "Enroll";
#                  urlServer = Coconut.config.get("AfisServerUrl")  + Coconut.config.get("AfisServerUrlFilepath");
#                  $.post(urlServer, payload,
#                    (result) =>
#                      console.log "response from service: " + JSON.stringify result
#                      statusCode = result.StatusCode
#                      serviceUuid = result.UID
#                      threshold = result.Threshold
#                      console.log "statusCode: " + statusCode
#                      if statusCode != null
#                        if statusCode == 1
##                            $( "#progress" ).html( 'Fingerprint enrolled. Success!' );
#                          $('#progress').append "<br/>Fingerprint enrolled. Success! User: " + user
#                          @registerEnrolledPerson(serviceUuid, prints, user, false, threshold)
#                        else
#                          $( "#progress" ).append( 'Problem enrolling fingerprint. StatusCode: ' +  statusCode);
#                          Coconut.trigger "displayEnroll"
#                  , "json")
                  $('#progress').append "<br/>Fingerprint enrolled. Success! User: " + user
                  @registerEnrolledPerson(serviceUuid, prints, user, false, threshold)
                else
                  l.stop()
                  $( "#message").append("Problem processing fingerprint. StatusCode: " + statusCode)
#                    Coconut.scannerPayload = payload
                  log = new Log()
                  log.save  {message: "Problem processing fingerprint.", statusCode:statusCode},
                    success: () =>
                      $( "#message").append("<br/>Saved log about problem.")
                      console.log("Saved log about problem.")
                    ,
                    error: (model, err, cb) =>
                      console.log(JSON.stringify(err))
              postError = (xhr, textStatus, errorThrown) ->
                console.log("Error: " + JSON.stringify(xhr) + " textStatus: " + textStatus + " errorThrown: " + errorThrown)
                l.stop()
                @currentOfflineUser = user;
                viewOptions = {}
                adminRegdropdown = ""
                adminRegCollection = new SecondaryIndexCollection
                adminRegCollection.fetch
                  fetch: 'query',
                  options:
                    query:
                      include_docs: true,
                      fun: 'by_AdminRegistration'
                  success: =>
#          console.log JSON.stringify results
                    console.log "Retrieved Admin registrations: " + JSON.stringify adminRegCollection
                    adminRegdropdown = "\n<div class=\"form-group\">\n\t<select id=\"formDropdown\" class=\"form-control\">\n<option value=\"\"> -- " + polyglot.t("SelectOne") + " -- </option>\n"
                    adminRegCollection.each (adminReg)->
                      id = adminReg.get("_id")
                      name = adminReg.get("Name")
                      option = "<option value=\"" + id + "\">" + name + "</option>\n"
                      adminRegdropdown = adminRegdropdown + option
                    adminRegdropdown = adminRegdropdown + "\t</select>\n</div>\n"
                    if user == 'Admin'
#                      Error uploading scan
#                      Operating in offline-mode. Press Continue to scan a new patient.
                      message = polyglot.t("errorUploadingScan") + ": " + xhr.statusText + " . " + polyglot.t("offlineScanContinueAdmin")
                      $("#uploadFailedMessage").html(message + adminRegdropdown)
                    else
#                      Operating in offline-mode. Press Continue to enroll this new patient.
                      message = polyglot.t("errorUploadingScan") + ": " + xhr.statusText + " . " + polyglot.t("offlineScanContinueNewPatient")
                      $("#uploadFailedMessage").html(message)
                    $("#uploadFailed").css({
                      "display": "block"
                    })
                    console.log message
                    console.log "Fingerprint server URL: " + urlServer
                    $('#progress').append message
                  error: (model, err, cb) ->
                    console.log JSON.stringify err
#              , "json"
#              $.ajax({
#                url         : urlServer,
#                data        : formData,
#                success     : postSuccess,
#                error     : postError
#              })
              ft.upload(results, urlServer, postSuccess, postError, options);
            , (error) ->
                l.stop()
                console.log("SecugenPlugin.scan error: " + error)
                message = error
                if error == "Scan failed: Unable to capture fingerprint. Please kill the app in the Task Manager and restart the app."
                    message = '<p>' + polyglot.t("scanFailed") + '<br/><a data-role="button" id="refresh" class="btn btn-primary btn-lg" data-style="expand-right">Refresh</a></p>'
                else
                    message = '<p> Error: ' + error + " " + polyglot.t("scanFailed") + '<br/><a data-role="button" id="refresh" class="btn btn-primary btn-lg" data-style="expand-right">Refresh</a></p>'
                $("#message").html message
                log = new Log()
                log.save  {message: "Problem scanning fingerprint.", error:error},
                  success: () =>
                    $( "#message").append("<br/>Saved log about problem.")
                    console.log("Saved log about problem.")
                  ,
                  error: (model, err, cb) =>
                    console.log(JSON.stringify(err))
        else
          i=1
          interval = setInterval =>
            if i == 5
              uuid = CoconutUtils.uuidGenerator(30)
              serviceUuid = CoconutUtils.uuidGenerator(30)
              district = $('#District').val();
              if user == "Admin"
                Coconut.currentDistrict = district
#              console.log("Go to next page. Generated UUID: " + uuid + " district: " + district)
              Coconut.scannerPayload =
                "Template":"46 4D 52 00 20 32 30 00 00 00 00 F0 00 00 01 04 01 2C 00 C5 00 C5 01 00 00 00 00 23 40 83 00 40 71 00 40 52 00 53 75 00 80 33 00 6B 8A 00 80 A9 00 6C 72 00 40 5B 00 81 7D 00 80 93 00 87 71 00 40 28 00 99 91 00 40 17 00 A1 11 00 40 44 00 A9 8D 00 40 81 00 B8 78 00 40 1B 00 BA 10 00 40 73 00 C2 80 00 40 3F 00 C3 94 00 40 DF 00 C7 E8 00 80 4B 00 CE 11 00 40 32 00 D6 91 00 40 16 00 D8 14 00 80 3D 00 E0 10 00 40 1A 00 E2 11 00 40 A3 00 E3 EE 00 40 38 00 F3 94 00 40 9E 00 F5 73 00 40 6D 00 FB 00 00 40 56 00 FC 93 00 40 A8 00 FC E3 00 40 26 00 FC 11 00 40 40 00 FD 10 00 40 7C 01 01 F8 00 80 C9 01 03 EA 00 40 38 01 04 9A 00 80 6D 01 07 7F 00 40 9E 01 0E 6C 00 40 32 01 10 17 00 40 88 01 11 EE 00 80 88 01 23 72 00 00 00 ",
                "Name":"Test CK",
                "email":"someone@somewhere.com",
                "Finger":1,
                "Key":"HH8XGFYSDU9QGZ833"
              Coconut.currentClient = new Result
                _id: uuid
                serviceUuid:serviceUuid
              $( "#message").html("Scanning complete!")
              if user == "Admin"
                Coconut.currentAdmin = Coconut.currentClient
              CoconutUtils.setSession('currentAdmin', Coconut.scannerPayload.email)
              l.stop()
              if  @nextUrl?
                Coconut.router.navigate @nextUrl, true
              else
                Coconut.router.navigate "registration", true
                window.setTimeout =>
                  Coconut.router.navigate("registration")
                , 2000
              clearInterval(interval);
            i++
          ,50
        return false;
#      console.log "revealSlider"
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

  registerEnrolledPerson: (serviceUuid, prints, user, createdOffline, threshold) ->
    if createdOffline
      uuid = 'oflId-' + CoconutUtils.uuidGenerator(30)
    else
      uuid = CoconutUtils.uuidGenerator(30)
    Coconut.currentClient = new Result
      _id: uuid
      serviceUuid: serviceUuid
      Fingerprints: prints
    if createdOffline
      Coconut.currentClient.createdOffline = true
    if typeof user != 'undefined' && user != null && user == 'Individual'
      Coconut.trigger "displayUserRegistrationForm"
    else
      Coconut.trigger "displayAdminRegistrationForm"

  continueAfterFail: ->
    serviceUuid = 'oflSid-' + CoconutUtils.uuidGenerator(30)
    user = @currentOfflineUser
    Coconut.offlineUser = true
    console.log('Continuing after the fail. User: ' + user)
    formDropdownValue = $('#formDropdown').val();
    if (formDropdownValue == "")
      return alert(polyglot.t("selectFromFormDropdown"))
    if user == "Admin"
      users = new SecondaryIndexCollection
      users.fetch
        fetch: 'query',
        options:
          query:
            include_docs: true,
            fun: 'by_AdminRegistration'
        success: =>
#          console.log 'by_AdminRegistration returned: ' + JSON.stringify users
          if users.length > 0
#              adminUser = users.first()
#              adminUser =  users.findWhere({id:formDropdownValue})
            adminUser =  users._byId[formDropdownValue]
#            console.log 'Coconut.currentAdmin: ' + JSON.stringify adminUser
            if adminUser == null
              return alert(polyglot.t("Problem finding an Admin user. Have any users registerred on this tablet?"))
            Coconut.currentAdmin = adminUser
            CoconutUtils.setSession('currentAdmin', adminUser.get('email'))
            Coconut.router.navigate "displayUserScanner", true
          else
            message = 'Strange. There should already be an Admin user. '
            console.log message
            $('#progress').append "<br/>" + message
            uuid = 'oflId-' + CoconutUtils.uuidGenerator(30)
            Coconut.currentAdmin = new Result
              _id: uuid
              serviceUuid: serviceUuid
              Fingerprints: Coconut.currentPrints
            console.log "currentAdmin: " + JSON.stringify Coconut.currentAdmin
            CoconutUtils.setSession('currentAdmin', null)
            Coconut.trigger "displayAdminRegistrationForm"
    else
      @registerEnrolledPerson(serviceUuid, Coconut.currentPrints, user, true, null)

  submitUserLogin: ->
    serviceUuid = 'adminSid-' + CoconutUtils.uuidGenerator(30)
    formDropdownValue = $('#formDropdown').val();
    if (formDropdownValue == "")
      return alert(polyglot.t("selectFromFormDropdown"))
    users = new SecondaryIndexCollection
    users.fetch
      fetch: 'query',
      options:
        query:
          include_docs: true,
          fun: 'by_AdminRegistration'
      success: =>
#        console.log 'by_AdminRegistration returned: ' + JSON.stringify users
        if users.length > 0
#              adminUser = users.first()
#              adminUser =  users.findWhere({id:formDropdownValue})
          adminUser =  users._byId[formDropdownValue]
#          console.log 'Coconut.currentAdmin: ' + JSON.stringify adminUser
          if adminUser == null
            return alert(polyglot.t("Problem finding an Admin user. Have any users registerred on this tablet?"))
          Coconut.currentAdmin = adminUser
          CoconutUtils.setSession('currentAdmin', adminUser.get('email'))
          Coconut.router.navigate "displayUserScanner", true
        else
          message = 'Strange. There should already be an Admin user. '
          console.log message
          $('#progress').append "<br/>" + message
          uuid = 'oflId-' + CoconutUtils.uuidGenerator(30)
          Coconut.currentAdmin = new Result
            _id: uuid
            serviceUuid: serviceUuid
            Fingerprints: Coconut.currentPrints
          console.log "currentAdmin: " + JSON.stringify Coconut.currentAdmin
          CoconutUtils.setSession('currentAdmin', null)
          Coconut.trigger "displayAdminRegistrationForm"

  searchByID: () ->
    Coconut.idResults.reset()
    Coconut.dobResults.reset()
    id = $('#id').val();
#    console.log("Searching for id: " + id)
    success = (users) =>
      Coconut.searchUsers = {}
      Coconut.searchUsers = users
      tableView = new UserSearchResultCompositeView({collection: users})
      Coconut.idResults.show tableView
    error = (model, err, cb) ->
      console.log JSON.stringify err
      $('#idResults').append "Search error: " + err
    users = KiwiUtils.searchForUser('by_clientIdIndivReg', success, error, id)

  searchByDOB: () ->
    Coconut.idResults.reset()
    Coconut.dobResults.reset()
    dob = $('#dob').val();
    gender = $('#Gender').val();
    console.log("Searching for dob" + dob)
    success = (users) =>
      Coconut.searchUsers = {}
      Coconut.searchUsers = users
      tableView = new UserSearchResultCompositeView({collection: users})
      Coconut.dobResults.show tableView
    error = (model, err, cb) ->
      console.log JSON.stringify err
      $('#dobResults').append "Search error: " + err
    users = KiwiUtils.searchForUser('by_DOBGenderIndivReg', success, error, dob, gender)

  displaySearchPage: () ->
    Coconut.trigger "displaySearch"