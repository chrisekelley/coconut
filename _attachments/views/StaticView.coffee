StaticView = Backbone.Marionette.ItemView.extend
  template: JST["_attachments/templates/StatcView.handlebars"]

  #        el: "#userMenu",

  #        className: 'app ui-content', // this class will be added to the wrapping div when you render the view


  ui:
    checkboxes: "input[type=checkbox]"

  events:
    "click #scanRetry": "scanRetry"
    "click #register": "register"
    "click #registrationLink": "submitRegistration"
    "click #newReportLink": "newReportLink"

  initialize: ->
  #            $('input[type=checkbox]').button();
  #            $(function() {
  #                $(":checkbox").checkbox();
  #            });

  scanRetry: ->
    console.log "scanRetry"
    if @user != null
      Coconut.trigger "displayUserScanner"
    else
      Coconut.trigger "displayAdminScanner"
    return

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
