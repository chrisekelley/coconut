Controller =
  displayScanner: (user) ->
    staticView = undefined
    if typeof user isnt "undefined"
      staticView = new VerifyView(template: JST["_attachments/templates/ScanVerifyView.handlebars"])
    else
      staticView = new VerifyView(template: JST["_attachments/templates/VerifyView.handlebars"])
    Coconut.mainRegion.show staticView
    return

  displayRegistration: (user) ->
    $("#message").html ""
#    staticView = undefined
    if typeof user isnt "undefined"
#      staticView = new UserRegistrationView(template: Handlebars.templates.UserRegistrationView)
#      staticView = new UserRegistrationView(template: JST["_attachments/templates/UserRegistrationView.handlebars"]())
      Coconut.router.navigate("#new/result/Individual%20Registration",true)
    else
#      staticView = new UserRegistrationView(template: JST["_attachments/templates/AdminUserRegistrationView.handlebars"]())
#       http://localhost:8080/#new/result/Admin%20Registration
      Coconut.router.navigate("#new/result/Admin%20Registration",true)

#    staticView.PouchDB = PouchDB
#    staticView.userType = user
#    Coconut.mainRegion.show staticView

  displayUserMain: ->
    $("#message").html ""
    staticView = new UserMainView()
    Coconut.mainRegion.show staticView
    return

  postUserRegistrationMenu: ->
    $("#message").html ""
    staticView = new UserMainView(template: JST["_attachments/templates/PostUserRegistrationMenuView.handlebars"])
    Coconut.mainRegion.show staticView
    return

  displayReportMenu: ->
    $("#message").html ""
    staticView = new UserFormView(template: JST["_attachments/templates/UserReportMenu.handlebars"])
    Coconut.mainRegion.show staticView
    return

  displayImmunization: ->
    $("#message").html ""
    staticView = new UserFormView(template: "ImmunizationForm")
    Coconut.mainRegion.show staticView
    return

  saveRecord: (record) ->
    $("#message").html ""
    record = new Record(record)
    record.post()
    console.log 'saved' +  JSON.stringify(record);
    Coconut.trigger "userMain"
    return

