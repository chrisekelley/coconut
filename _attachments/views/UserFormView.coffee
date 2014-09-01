UserFormView = Backbone.Marionette.ItemView.extend
    
    # Add the attributes JQM expects to the view's element
#    attributes: ->
#      "data-url": "#displayReportMenu"
#      "data-role": "page"
#      id: "userMenu"
#      class: "app"

    template: JST["_attachments/templates/PostAdminRegistrationMenu.handlebars"]
    
    #        el: "#userMenu",
    className: "app ui-content" # this class will be added to the wrapping div when you render the view
    triggers:
      "click #submitContinueReportLink":
        event: "submitContinueReportLink"
        preventDefault: true # this param is optional and will default to true
        stopPropagation: false

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
      App.trigger "userScan"
      return

    newReportLink: ->
      console.log "newReportLink"
      App.trigger "displayReportMenu"
      return

    submitContinueReportLink: ->
      console.log "submitContinueReportLink"
      App.trigger "displayImmunization"
      return

    submitImmunizationLink: ->
      console.log "submitImmunizationLink"
      App.trigger "displayReportMenu"
      return



#        ui: {
#            checkboxes: "input[type=checkbox]"
#        },

#        render: function(){
#            var html = this.template();
#            var newElement = $(html)
#            this.$el.replaceWith(newElement);
#            this.setElement(newElement);
#            return this;
#        },
#        onRender: function(){
#            var self = this;
#            var template = this.options.template;
#            dust.render(template, {name:'helloworld'}, function(err,out){
#//                self.$el.html(out);
#//                console.log("dust: " + out)
#                var newElement = $(out)
#//                self.$el.replaceWith(newElement);
#//                $('#main-region').replaceWith(newElement);
#                $('body').append(newElement);
#//                self.setElement(newElement);
#            });
#            return this;
#        }

#        onRender: function() {
#            if (this.ui.checkboxes != null) {
#            this.ui.checkboxes.each(
#              function(){
#                  var id = $(this).attr('id');
#                  console.log("testo" + id);
#//                  var label = $("label[for='"+ id +"']")
#//                  var label =$("label[for='checkboxImmunization']")
#//                  label.addClass( "ui-checkbox-off" );
#//                  if(label = $("label[for="+$(this).attr('id')+"]")) {
#//                      console.log("label: " + id);
#//                      label.click(function(){
#//                          //ui-checkbox-off
#//                          console.log("clicked");
#////                          $(this).toggleClass('checked');
#////                          $("input[id="+$(this).attr('for')+"]").click(function(){ $(this).attr("checked"); });
#//                      });
#//                  }
#              }
#            );
#//                this.ui.checkbox.addClass('checked');
#            }
#        }
