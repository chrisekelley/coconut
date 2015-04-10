UserFormView = Backbone.Marionette.ItemView.extend

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
      "click #PostOperativeFollowup": "postOperativeFollowup",
      "click #TrichiasisSurgery": "trichiasisSurgery"
      "click #PostOperativeEpilation": "postOperativeEpilation"
      "click #PostOperativeFollowup_1day": "postOperativeFollowup_1day"
      "click #PostOperativeFollowup_7_14_days": "postOperativeFollowup_7_14_days"
      "click #PostOperativeFollowup_3_6_months": "postOperativeFollowup_3_6_months"

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

    trichiasisSurgery: ->
      console.log "trichiasisSurgery"
      Coconut.router.navigate "#new/result/Trichiasis%20Surgery",true
      return

    postOperativeFollowup: ->
      console.log "postOperativeFollowup"
      Coconut.router.navigate "#new/result/Post-Operative%20Followup",true
      return

    postOperativeEpilation: ->
      console.log "postOperativeEpilation"
      Coconut.router.navigate "#new/result/PostOperativeEpilation",true
      return

    postOperativeFollowup_1day: ->
      console.log "postOperativeFollowup_1day"
      Coconut.router.navigate "#new/result/PostOperativeFollowup_1day",true
      return

    postOperativeFollowup_7_14_days: ->
      console.log "postOperativeFollowup_7_14_days"
      Coconut.router.navigate "#new/result/PostOperativeFollowup_7_14_days",true
      return

    postOperativeFollowup_3_6_months: ->
      console.log "postOperativeFollowup_3_6_months"
      Coconut.router.navigate "#new/result/PostOperativeFollowup_3_6_months",true
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
