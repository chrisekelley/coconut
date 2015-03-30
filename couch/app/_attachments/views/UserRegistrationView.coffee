UserRegistrationView = Backbone.Marionette.ItemView.extend
    template: JST["_attachments/templates/UserRegistrationView.handlebars"]
    events:
      "click #submitUserRegistration": "submitUserRegistration"
      "click #submitAdminRegistration": "submitAdminRegistration"

    userType: null
    PouchDB: null
    initialize: ->
      console.log "init"
      return

    submitUserRegistration: ->
      Coconut.trigger "postUserRegistrationMenu"
      return

    submitAdminRegistration: ->
      Coconut.trigger "userMain"
      return


