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
    "displayUserScanner": "displayUserScanner"
    "displayAdminScanner": "displayAdminScanner"
    "registration": "registration"
    "userRegistration": "userRegistration"
    "postUserRegistrationMenu": "postUserRegistrationMenu"
    "postAdminRegistrationMenu": "postAdminRegistrationMenu"
    "displayReportMenu": "displayReportMenu"
    "userScan": "userScan"
    "scanRetry":	 "scanRetry"
    "scanRetry/:user":	 "scanRetry"
    "users": "users"
    "displayClientRecords": "displayClientRecords"
    "displayAllRecords": "displayAllRecords"
    "loadTestClient": "loadTestClient"
    "enroll": "enroll"
    "enroll/:user": "enroll"
    "": "displayAdminScanner"

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

  displayUserScanner: ->
    @userLoggedIn
      success: ->
        Coconut.Controller.displayUserScanner()

  displayAdminScanner: ->
    @userLoggedIn
      success: ->
        Coconut.Controller.displayAdminScanner()

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

  postAdminRegistrationMenu: ->
    @userLoggedIn(
      success: ->
        Coconut.Controller.postAdminRegistrationMenu()
    )

  enroll: (user) ->
    @userLoggedIn
      success: ->
        if user == 'user'
          Coconut.Controller.enrollUser()
        else
          Coconut.Controller.enrollAdmin()
    return

  displayReportMenu: ->
    @userLoggedIn
      success: ->
        Coconut.Controller.displayReportMenu()


  userScan: (user) ->
    @userLoggedIn
      success: ->
        Coconut.Controller.displayUserScanner
    return

  scanRetry: (user) ->
    @userLoggedIn
      success: ->
        Coconut.Controller.scanRetry user
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
      user = new User
        _id: "user.admin"
#      currentAdmin = $.cookie('currentAdmin');
#      console.log('currentAdmin: ' + currentAdmin)
      if !Coconut.session
        Coconut.session = {}
      expires = Coconut.session['currentAdmin']
      if expires
        now = new Date();
        if now < expires
            callback.success(user)
          else
            console.log('No currentAdmin')
            Coconut.trigger "displayAdminScanner"
      else
          console.log('No currentAdmin')
          Coconut.trigger "displayAdminScanner"
#    User.isAuthenticated
#      success: (user) ->
#        callback.success(user)
#      error: ->
#        Coconut.loginView.callback = callback
#        Coconut.loginView.render()

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
    Coconut.Controller.displayAdminScanner

  displayClientRecords: ->
    @userLoggedIn
      success: ->
#        Coconut.Controller.showDashboard()
        Coconut.Controller.displayClientRecords()

  displayAllRecords: ->
    @userLoggedIn
      success: ->
        Coconut.Controller.displayAdminRecords()

  loadTestClient: ->
    @userLoggedIn
      success: ->
        Coconut.Controller.loadTestClient()


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
        Coconut.syncView ?= new SettingsView()
        Coconut.syncView.render()

  # TODO refactor these to not use view - just use the sync model
  syncSend: (action) ->
    Coconut.router.navigate("sync",false)
    @userLoggedIn
      success: ->
        Coconut.syncView.sync.replicateToServer
          success: ->
              Coconut.syncView.refreshLog()
        Coconut.syncView.sync.replicateFromServer
          success: ->
              Coconut.syncView.refreshLog()

  syncGet: (action) ->
    Coconut.router.navigate("",false)
    @userLoggedIn
      success: ->
        Coconut.syncView ?= new SettingsView()
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
          error: (error) ->
            console.log("Unable to fetch model: " + JSON.stringify(error))

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

  bootstrapApp: ->
    Controller.displaySiteNav()
    Coconut.config = new Config()
    Coconut.config.fetch
      success: ->
          Coconut.router.fetchUserAndStartAppUI()
      error: ->
        Coconut.localConfigView ?= new LocalConfigView()
        Coconut.localConfigView.render()

  fetchUserAndStartAppUI: ->
    user = new User
        _id: "user.admin"
    user.fetch
        success: ->
          langChoice = user.get('langChoice')
          console.log("langChoice from doc: " + user.get('langChoice'))
          if !langChoice
            langChoice = 'pt'
            user.set('langChoice',langChoice)
            user.save null,
              success: ->
                  console.log("langChoice saved: " + langChoice)
                  deferred = CoconutUtils.fetchTranslation langChoice
                  deferred.done ->
                      console.log("Got translation. Starting app")
                      Coconut.router.startAppUI()
              error: (json, msg) ->
                  console.log("Error saving langChoice  " + msg)
          else
            deferred = CoconutUtils.fetchTranslation langChoice
            deferred.done ->
              console.log("Got translation. Starting app")
              Coconut.router.startAppUI()
        error: ->
            console.log("Error: user.admin should be in the local db.")


  startAppUI: ->
    $('#application-title').html Coconut.config.title()
    Controller.displaySiteNav()
    Coconut.loginView = new LoginView()
    Coconut.questions = new QuestionCollection()
    Coconut.questionView = new QuestionView()
    Coconut.menuView = new MenuView()
    Coconut.syncView = new SettingsView()
    KiwiUtils.fetchDistricts()
    Coconut.syncView.sync.replicateToServer()
    Coconut.syncView.sync.replicateFromServer()
    #        Coconut.syncView.update()
    Backbone.history.start()
    if navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/)
      CoconutUtils.checkVersion()
#      CoconutUtils.check_network()

$(() =>

  onOffline = () ->
    message = 'Device is offline.'
    console.log message
    Coconut.connectionStatus = "offline"
    $("#statusIcons").html('<img src="images/connection-down.png"/>')
  onOnline = () ->
    message = 'Device is online.'
    console.log message
    Coconut.connectionStatus = "online"
    $("#statusIcons").html('<img src="images/connection-up.png"/>')

  onDeviceReady = () =>
    if navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/)
      console.log("Init Secugen: this wheel is on fire.")
      cordova.plugins.SecugenPlugin.requestPermission (results) ->
          console.log "SecugenPlugin requestPermission: " + results
      , (error) ->
          console.log(error)
          if error == 'Error: Either a fingerprint device is not attached or the attached fingerprint device is not supported.'
              messagePt = "Erro: ou um digitalizador não está ligada ou o digitalizador conectado não é suportado.  Favor de fechar o pacote no 'Task Manager',  conecte o digitalizador,  e renicie novamente. \n"
              messageEn = "Error: Either a fingerprint device is not attached or the attached fingerprint device is not supported.  Please kill the app in the Task Manager, connect the device, and restart the app."
#              message = polyglot.t("deviceError")
              message = messagePt.concat(messageEn)
              alert   message

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
    Coconut.currentClient = null;
    Coconut.currentAdmin = null;

    Coconut.currentPosition = null
    Coconut.currentPositionError = null

    Coconut.addRegions siteNav: "#siteNav"
    Coconut.addRegions mainRegion: "#content"
    Coconut.addRegions dashboardRegion: "#dashboard"

    Coconut.on "displayReportMenu", ->
      Coconut.router.navigate("displayReportMenu")
      Coconut.Controller.displayReportMenu()

    #Coconut.on "userScan", ->
    #  Coconut.router.navigate "userScan"
    #  Coconut.API.userScan "user"

    Coconut.on "displayAdminScanner", ->
      Coconut.router.navigate "displayAdminScanner"
      Coconut.Controller.displayAdminScanner()

    Coconut.on "displayUserScanner", ->
      Coconut.router.navigate "displayUserScanner"
      Coconut.Controller.displayUserScanner()

    Coconut.on "displayAdminRegistrationForm", ->
      Coconut.router.navigate "displayRegistration"
      Coconut.Controller.displayRegistration()

    Coconut.on "displayUserRegistrationForm", ->
      Coconut.router.navigate "displayRegistration"
      Coconut.Controller.displayRegistration "user"

    Coconut.on "displayEnrollUser", ->
      Coconut.router.navigate "enroll/user"
      Coconut.Controller.enrollUser()

    Coconut.on "displayEnrollAdmin", ->
      Coconut.router.navigate "enroll/admin"
      Coconut.Controller.enrollAdmin()

    Coconut.on "displayClientRecords", ->
      Coconut.router.navigate "displayClientRecords"
      Coconut.Controller.displayClientRecords()
    #  Coconut.Controller.showDashboard()

    Coconut.on "displayAllRecords", ->
      console.log("displayAllRecords triggered")
      Coconut.router.navigate "displayAllRecords"
      Coconut.Controller.displayAdminRecords()

    Coconut.on "displaySync", ->
      Coconut.router.navigate "sync"
      Coconut.Controller.displaySync()

    Coconut.router.bootstrapApp()

    Coconut.debug = (string) ->
#      console.log string
      Coconut.replicationLog = "" unless Coconut.replicationLog?
      Coconut.replicationLog += "<br/>"
      Coconut.replicationLog += string
  #  $("#log").append string + "<br/>"

#  Coconut.fetchTranslation = (languge) ->
#    deferred = $.Deferred();
#    Coconut.translation = {} if !Coconut.translation
#    Coconut.translation[languge] = new Translation {id: languge}
#    Coconut.translation[languge].fetch
#        success: ->
#            polyglot = new Polyglot()
#            polyglot.extend()
#            Handlebars.registerHelper   'polyglot', (phrase)->
#                polyglot.t(phrase)
#            deferred.resolve()
#
#        error: (error) ->
#            console.log("Unable to fetch translation for " + " languge:" + languge + " error:" + JSON.stringify(error))
#    return deferred.promise()

#  deferred = Coconut.fetchTranslation "pt"
#  deferred.done ->
  if navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/)
    console.log("listening for deviceready event.")
    document.addEventListener("deviceready", onDeviceReady, false);
    document.addEventListener("offline", onOffline, false);
    document.addEventListener("online", onOnline, false);
  else
    onDeviceReady()
)



