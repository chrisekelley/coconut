API =
  home: ->
    Coconut.Controller.displayScanner()
    return

  registration: (user) ->
    Coconut.Controller.displayRegistration user
    return

  userScan: (user) ->
    Coconut.Controller.displayScanner "user"
    return

  userMain: ->
    Coconut.Controller.displayUserMain()
    return

  userRegistration: ->
    Coconut.API.registration "user"
    return

  postUserRegistrationMenu: ->
    Coconut.Controller.postUserRegistrationMenu()
    return

  displayReportMenu: ->
    Coconut.Controller.displayReportMenu()
    return

  displayImmunization: ->
    Coconut.Controller.displayImmunization()
    return

  saveRecord: (record) ->
    Coconut.Controller.saveRecord record
    return
