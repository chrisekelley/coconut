class Router extends Backbone.Router
  routes:
    "login": "login"
    "logout": "logout"
    "design": "design"
    "select": "select"
    "show/results/:question_id": "showResults"
    "new/result/:question_id": "newResult"
    "edit/result/:result_id": "editResult"
    "delete/result/:result_id": "deleteResult"
    "delete/result/:result_id/:confirmed": "deleteResult"
    "edit/resultSummary/:question_id": "editResultSummary"
    "analyze/:form_id": "analyze"
    "delete/:question_id": "deleteQuestion"
    "edit/:question_id": "editQuestion"
    "manage": "manage"
    "sync": "sync"
    "sync/send": "syncSend"
    "sync/get": "syncGet"
    "configure": "configure"
    "map": "map"
    "reports": "reports"
    "reports/*options": "reports"
    "alerts": "alerts"
    "show/case/:caseID": "showCase"
    "users": "users"
    "messaging": "messaging"
    "help": "help"
    "displayScanner": "displayScanner"
    "registration": "registration"
    "userRegistration": "userRegistration"
    "postUserRegistrationMenu": "postUserRegistrationMenu"
    "displayReportMenu": "displayReportMenu"
    "userScan": "userScan"
    "users": "users"
    "": "default"

  route: (route, name, callback) ->
    Backbone.history || (Backbone.history = new Backbone.History)
    if !_.isRegExp(route)
      route = this._routeToRegExp(route)
    if _.isFunction(name)
      callback = name;
      name = '';
    if !callback
      callback = this[name];
    router = this;
    Backbone.history.route(route, (fragment) =>
      args = router._extractParameters(route, fragment)
      callback && callback.apply(router, args)
      router.trigger.apply(router, ['route:' + name].concat(args))
      router.trigger('route', name, args)
      Backbone.history.trigger('route', router, name, args)

# Run this before
#      $('#loading').slideDown()
      this.trigger.apply(this, ['route:' + name].concat(args))
# Run this after
#      $('#loading').fadeOut()

    , this)

  help: ->
    @userLoggedIn
      success: ->
        Coconut.helpView ?= new HelpView()
        Coconut.helpView.render()

  displayScanVerifyView: ->
    @userLoggedIn
      success: ->
        staticView = new VerifyView(template: JST["_attachments/templates/ScanVerifyView.handlebars"]())
        Coconut.mainRegion.show staticView

  displayScanner: ->
    @userLoggedIn
      success: ->
        Coconut.Controller.displayScanner()

  registration: (user) ->
    @userLoggedIn
      success: ->
        Coconut.Controller.displayRegistration user

  userRegistration: ->
    @userLoggedIn
      success: ->
#        API.registration "user"
        console.log("displayRegistration.")
        Coconut.Controller.displayRegistration "user"

  postUserRegistrationMenu: ->
    @userLoggedIn
      success: ->
        console.log("postUserRegistrationMenu.")
        Coconut.Controller.postUserRegistrationMenu()

  displayReportMenu: ->
    @userLoggedIn
      success: ->
        Coconut.Controller.displayReportMenu()

  userScan: (user) ->
    @userLoggedIn
      success: ->
        Coconut.Controller.displayScanner "user"
    return

  users: ->
    @adminLoggedIn
      success: ->
        Coconut.usersView ?= new UsersView()
        Coconut.usersView.render()

  messaging: ->
    @adminLoggedIn
      success: ->
        Coconut.messagingView ?= new MessagingView()
        Coconut.messagingView.render()

  login: ->
    Coconut.loginView.callback =
      success: ->
        Coconut.router.navigate("",true)
    Coconut.loginView.render()


  userLoggedIn: (callback) ->
    User.isAuthenticated
      success: (user) ->
        callback.success(user)
      error: ->
        Coconut.loginView.callback = callback
        Coconut.loginView.render()

  adminLoggedIn: (callback) ->
    @userLoggedIn
      success: (user) ->
        if user.isAdmin()
          callback.success(user)
      error: ->
        $("#content").html "<h2>Must be an admin user</h2>"

  logout: ->
    User.logout()
    Coconut.router.navigate("",true)

  default: ->
    @userLoggedIn
      success: ->
        viewOptions = {}
        results = new SecondaryIndexCollection
        results.fetch
          fetch: 'query',
          options:
            include_docs: true,
            query:
              include_docs: true,
#                  fun:QUERIES.resultsByQuestionAndComplete(question.id, complete)
#                  key:'Individual Registration',
              fun: 'question_complete_index'
          success: =>
            console.log JSON.stringify results
            viewOptions =
              collection : results
            client = new Result
              _id:'34409584-3922-1903-A2FC-954BF5552907'
            client.fetch
              success: ->
                console.log JSON.stringify  client
                Coconut.client = client
#                Coconut.homeView.render()
              error: (model, err, cb) ->
                console.log JSON.stringify err
#                Coconut.homeView.render()
            Coconut.mainRegion.show new HomeCompositeView viewOptions
          error: (model, err, cb) ->
            console.log JSON.stringify err
#            Coconut.homeView.render()
#            Coconut.mainRegion.show Coconut.homeView

#            App.headerRegion.show new Header()

  alerts: ->
    @userLoggedIn
      success: ->
        if Coconut.config.local.mode is "mobile"
          $("#content").html "Alerts not available in mobile mode."
        else
          $("#content").html "
            <h1>Alerts</h1>
            <ul>
              <li>
                <b>Localised Epidemic</b>: More than 10 cases per square kilometer in KATI district near BAMBI shehia (map <a href='#reports/location'>Map</a>). Recommend active case detection in shehia.
              </li>
              <li>
                <b>Abnormal Data Detected</b>: Only 1 case reported in MAGHARIBI district for June 2012. Expected amount: 25. Recommend checking that malaria test kits are available at all health facilities in MAGHARIBI.
              </li>
            </ul>
          "

  reports: (options) ->
    @userLoggedIn
      success: ->
        if Coconut.config.local.mode is "mobile"
          $("#content").html "Reports not available in mobile mode."
        else
          options = options?.split(/\//)
          reportViewOptions = {}

          # Allows us to get name/value pairs from URL
          _.each options, (option,index) ->
            unless index % 2
              reportViewOptions[option] = options[index+1]

          Coconut.reportView ?= new ReportView()
          Coconut.reportView.render reportViewOptions

  showCase: (caseID) ->
    @userLoggedIn
      success: ->
        Coconut.caseView ?= new CaseView()
        Coconut.caseView.case = new Result
          caseID: caseID
          _id: caseID
        Coconut.caseView.case.fetch
          success: ->
            Coconut.caseView.render()
#        console.log("hoo ha")

  configure: ->
    @userLoggedIn
      success: ->
        Coconut.localConfigView ?= new LocalConfigView()
        Coconut.localConfigView.render()

  editResultSummary: (question_id) ->
    @userLoggedIn
      success: ->
        Coconut.resultSummaryEditor ?= new ResultSummaryEditorView()
        Coconut.resultSummaryEditor.question = new Question
          id: unescape(question_id)

        Coconut.resultSummaryEditor.question.fetch
          success: ->
            Coconut.resultSummaryEditor.render()

  editQuestion: (question_id) ->
    @userLoggedIn
      success: ->
        Coconut.designView ?= new DesignView()
        Coconut.designView.render()
        Coconut.designView.loadQuestion unescape(question_id)

  deleteQuestion: (question_id) ->
    @userLoggedIn
      success: ->
        Coconut.questions.get(unescape(question_id)).destroy
          success: ->
            Coconut.menuView.render()
            Coconut.router.navigate("manage",true)

  sync: (action) ->
    @userLoggedIn
      success: ->
        Coconut.syncView ?= new SyncView()
        Coconut.syncView.render()

  # TODO refactor these to not use view - just use the sync model
  syncSend: (action) ->
    Coconut.router.navigate("",false)
    @userLoggedIn
      success: ->
#        Coconut.syncView ?= new SyncView()
        Coconut.syncView.sync.replicateToServer()
#        success: ->
#            Coconut.syncView.update()

  syncGet: (action) ->
    Coconut.router.navigate("",false)
    @userLoggedIn
      success: ->
        Coconut.syncView ?= new SyncView()
        Coconut.syncView.sync.getFromCloud()

  manage: ->
    @adminLoggedIn
      success: ->
        Coconut.manageView ?= new ManageView()
        Coconut.manageView.render()


  newResult: (question_id) ->
    @userLoggedIn
      success: ->
        Coconut.questionView ?= new QuestionView()
        Coconut.questionView.result = new Result
          question: unescape(question_id)
        Coconut.questionView.model = new Question {id: unescape(question_id)}
        Coconut.questionView.model.fetch
          success: ->
            Coconut.questionView.render()

  editResult: (result_id) ->
    @userLoggedIn
      success: ->
        Coconut.questionView ?= new QuestionView()
        Coconut.questionView.readonly = false

        Coconut.questionView.result = new Result
          _id: result_id
        Coconut.questionView.result.fetch
          success: ->
            Coconut.questionView.model = new Question
              id: Coconut.questionView.result.question()
            Coconut.questionView.model.fetch
              success: ->
                Coconut.questionView.render()



  deleteResult: (result_id, confirmed) ->
    @userLoggedIn
      success: ->
        Coconut.questionView ?= new QuestionView()
        Coconut.questionView.readonly = true

        Coconut.questionView.result = new Result
          _id: result_id
        Coconut.questionView.result.fetch
          success: ->
            if confirmed is "confirmed"
              Coconut.questionView.result.destroy
                success: ->
                  Coconut.menuView.update()
                  Coconut.router.navigate("show/results/#{escape(Coconut.questionView.result.question())}",true)
            else
              Coconut.questionView.model = new Question
                id: Coconut.questionView.result.question()
              Coconut.questionView.model.fetch
                success: ->
                  Coconut.questionView.render()
                  $("#content").prepend "
                    <h2>Are you sure you want to delete this result?</h2>
                    <div id='confirm'>
                      <a href='#delete/result/#{result_id}/confirmed'>Yes</a>
                      <a href='#show/results/#{escape(Coconut.questionView.result.question())}'>Cancel</a>
                    </div>
                  "
                  $("#confirm a").button()
                  $("#content form").css
                    "background-color": "#333"
                    "margin":"50px"
                    "padding":"10px"
                  $("#content form label").css
                    "color":"white"
                    

  design: ->
    @userLoggedIn
      success: ->
        $("#content").empty()
        Coconut.designView ?= new DesignView()
        Coconut.designView.render()

  showResults:(question_id) ->
    @userLoggedIn
      success: ->
        Coconut.resultsView ?= new ResultsView()
        Coconut.resultsView.question = new Question
          id: unescape(question_id)
        Coconut.resultsView.question.fetch
          success: ->
            Coconut.resultsView.render()

  map: () ->
    @userLoggedIn
      success: ->
        Coconut.mapView ?= new MapView()
        Coconut.mapView.render()

  startApp: ->
    Coconut.config = new Config()
    Coconut.config.fetch
      success: ->
#        $("#footer-menu").html "
#          <center>
#          <span style='font-size:75%;display:inline-block'>
#            User:<br/> <span id='user'></span>
#          </span>
#          <a href='#login'>Login</a>
#          <a href='#logout'>Logout</a>
#          <a id='reports' href='#reports'>Reports</a>
#          <a id='displayScanner' href='#displayScanner'>Scanner</a>
#          <a id='manage-button' style='display:none' href='#manage'>Manage</a>
#          &nbsp;
#          <a href='#sync/send'>Send data (last done: <span class='sync-sent-status'></span>)</a>
#          <a href='#sync/get'>Update (last done: <span class='sync-get-status'></span>)</a>
#          <a href='#help'>Help</a>
#          <span style='font-size:75%;display:inline-block'>Version<br/><span id='version'></span></span>
#          </center>
#        "
#        $("[data-role=footer]").navbar()
        $('#application-title').html Coconut.config.title()
        Coconut.loginView = new LoginView()
        Coconut.questions = new QuestionCollection()
        Coconut.questionView = new QuestionView()
        Coconut.menuView = new MenuView()
        Coconut.syncView = new SyncView()
        Coconut.syncView.sync.replicateToServer()
        #        Coconut.menuView.render()

        Coconut.syncView.update()
        Backbone.history.start()
      error: ->
        Coconut.localConfigView ?= new LocalConfigView()
        Coconut.localConfigView.render()

window.Coconut = new Marionette.Application()
matchResults = document.location.pathname.match(/^\/(.*)\/_design\/(.*?)\//)
if matchResults == null
  console.log 'Configuring for Pouchdb'
  Coconut.db_name = 'coconut'
  Coconut.ddoc_name = 'coconut'
else
  Coconut.db_name = matchResults[1]
  Coconut.ddoc_name = matchResults[2]
#Backbone.sync = BackbonePouch.sync({
#  db: PouchDB(Coconut.db_name)
#});

#Coconut.adminRegistrationForm = new Result(adminRegistrationForm);
#Coconut.trichiasisForm = new Result(trichiasisForm);
#Coconut.userAdminForm = new Result(userAdminForm);
#Coconut.individualRegistrationForm = new Result(individualRegistrationForm);
#Coconut.postOperativeFollowupForm = new Result(postOperativeFollowupForm);

Coconut.Controller = Controller
Coconut.API = API
Coconut.router = new Router()

Coconut.addRegions mainRegion: "#content"

Coconut.on "displayReportMenu", ->
  Coconut.router.navigate("displayReportMenu")
  Coconut.Controller.displayReportMenu()

Coconut.on "userScan", ->
  Coconut.router.navigate "userScan"
  Coconut.API.userScan "user"


Coconut.router.startApp()

Coconut.debug = (string) ->
  console.log string
  $("#log").append string + "<br/>"
