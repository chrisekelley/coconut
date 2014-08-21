UserMainView = Backbone.Marionette.ItemView.extend
    template: JST["_attachments/templates/UserMainView.handlebars"]
    
    #        el: "#userMenu",
    
    #        className: 'app ui-content', // this class will be added to the wrapping div when you render the view
    events:
      "click #registrationLink": "submitRegistration"
      "click #newReportLink": "newReportLink"

    initialize: ->

    
    #            $('input[type=checkbox]').button();
    #            $(function() {
    #                $(":checkbox").checkbox();
    #            });
    submitRegistration: ->
      console.log "submitRegistration"
      Coconut.trigger "userScan"
      return

    newReportLink: ->
      console.log "newReportLink"
      Coconut.trigger "displayReportMenu"
      return

    ui:
      checkboxes: "input[type=checkbox]"


