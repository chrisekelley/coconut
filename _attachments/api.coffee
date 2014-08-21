API =
  home: ->
    App.Controller.displayScanner()
    return

  registration: (user) ->
    App.Controller.displayRegistration user
    return

  userScan: (user) ->
    App.Controller.displayScanner "user"
    return

  userMain: ->
    App.Controller.displayUserMain()
    return

  userRegistration: ->
    API.registration "user"
    return

  postUserRegistrationMenu: ->
    App.Controller.postUserRegistrationMenu()
    return

  displayReportMenu: ->
    App.Controller.displayReportMenu()
    return

  displayImmunization: ->
    App.Controller.displayImmunization()
    return

  saveRecord: (record) ->
    App.Controller.saveRecord record
    return
