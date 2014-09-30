Controller =
  displayUserScanner: () ->
    staticView = new VerifyView(template: JST["_attachments/templates/ScanVerifyView.handlebars"])
    staticView.nextUrl = "#scanRetry/user"
    Coconut.mainRegion.show staticView
    return

  displayAdminScanner: () ->
    staticView = new VerifyView(template: JST["_attachments/templates/VerifyView.handlebars"])
    staticView.nextUrl = "#scanRetry"
#    staticView.nextUrl = "#new/result/Admin%20Registration"
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
    staticView = new StaticView()
    Coconut.mainRegion.show staticView
    return

  postUserRegistrationMenu: ->
    $("#message").html ""
    dashboardLayout = new DashboardLayout();
    Coconut.mainRegion.show dashboardLayout
    dashboardView = new ClientDashboardView {model: Coconut.currentClient}
    dashboardLayout.dashboardRegion.show dashboardView
    staticView = new StaticView(template: JST["_attachments/templates/PostUserRegistrationMenuView.handlebars"])
    dashboardLayout.contentRegion.show(staticView)
    return

  postAdminRegistrationMenu: ->
    $("#message").html ""
    staticView = new StaticView(template: JST["_attachments/templates/PostAdminRegistrationMenuView.handlebars"])
    Coconut.mainRegion.show staticView
    return

  enrollUser: ->
    $("#message").html ""
    staticView = new StaticView(template: JST["_attachments/templates/Enroll.handlebars"])
    staticView.user = 'user'
    Coconut.mainRegion.show staticView
    return

  enrollAdmin: ->
    $("#message").html ""
    staticView = new StaticView(template: JST["_attachments/templates/Enroll.handlebars"])
    staticView.user = 'admin'
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

  scanRetry: (user) ->
    $("#message").html ""
    staticView = new StaticView(template: JST["_attachments/templates/ScanRetry.handlebars"])
    staticView.user = user
    Coconut.mainRegion.show staticView
    return

  showDashboard: (user) ->
    if Coconut.currentClient != null
      staticView = new ClientDashboardView {model: Coconut.currentClient}
      Coconut.dashboardRegion.show staticView
    return

  loadTestClient: () ->
    $("#message").html ""
    client = new Result
      _id:'TestClient'
    client.fetch
      success: ->
        console.log JSON.stringify  client
        Coconut.currentClient = client
        Coconut.router.navigate("displayClientRecords",true)
      error: (model, err, cb) ->
        console.log JSON.stringify err

  displayClientRecords: () ->
    if Coconut.currentClient
      clientId = Coconut.currentClient.get("_id")
      viewOptions = {}
      results = new SecondaryIndexCollection
      results.fetch
        fetch: 'query',
        options:
          query:
            key: clientId,
            include_docs: true,
  #                  fun:QUERIES.resultsByQuestionAndComplete(question.id, complete)
  #                  key:'Individual Registration',
            fun: 'by_clientId'
        success: =>
          console.log JSON.stringify results
          viewOptions =
            collection : results
  #        Coconut.mainRegion.show new HomeCompositeView viewOptions
          dashboardLayout = new DashboardLayout();
          Coconut.mainRegion.show dashboardLayout
          #        if Coconut.currentClient != null
          dashboardView = new ClientDashboardView {model: Coconut.currentClient}
          dashboardLayout.dashboardRegion.show dashboardView
          dashboardLayout.contentRegion.show(new HomeCompositeView viewOptions)
        error: (model, err, cb) ->
                console.log JSON.stringify err
    else
      dashboardLayout = new DashboardLayout();
      Coconut.mainRegion.show dashboardLayout
      #        if Coconut.currentClient != null
      dashboardView = new ClientDashboardView {model: Coconut.currentClient}
      dashboardLayout.dashboardRegion.show dashboardView
      dashboardLayout.contentRegion.show(new HomeCompositeView viewOptions)
