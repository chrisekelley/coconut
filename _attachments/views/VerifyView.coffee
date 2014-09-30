VerifyView = Backbone.Marionette.ItemView.extend
#    template: "VerifyView"
    template: JST["_attachments/templates/VerifyView.handlebars"]()
    className: "itemView" # this class will be added to the wrapping div when you render the view
    events:
      "click #identifyIndividual": "identifyIndividual"
      "click #identifyAdmin": "identifyAdmin"
      "click #scan": "scanNewIndividual"
      "click #verifyYes": "displayNewUserRegistration"
      "click #verifyNo": "displayNewUserRegistration"

    nextUrl:null

    hasCordova:true

    initialize: ->
      if typeof cordova is "undefined"
        console.log "cordova is not defined."
        @hasCordova = false

    displayNewUserRegistration: ->
      Coconut.router.navigate "userRegistration", true
      return

    diplayNewReportMenu: ->

    scanNewIndividual:(e) ->
#      @scan e, "userRegistration"
      @scan e, "Enroll"
      return

    register:(e) ->
      @scan e, "Enroll"
      return

    identifyIndividual:(e) ->
      @scan e, "Identify", "Individual"
      return

    identifyAdmin:(e) ->
      @scan e, "Identify", "Admin"
      return

    scan: (event, method, user) ->
      this.eventUrl = @nextUrl
      display = (message) ->
        console.log "display message: " + message
        display = document.getElementById("message") # the message div
        lineBreak = document.createElement("br") # a line break
        label = document.createTextNode(message) # create the label
        display.appendChild lineBreak # add a line break
        display.appendChild label # add the message node
        return

      revealSlider = (event, method, user) =>
        startLadda = (e) =>
          l = Ladda.create(e.currentTarget)
          l.start()
#          if not typeof cordova is "undefined"
          if @hasCordova
            console.log "method: " + method
            if (method == "Identify")
              cordova.plugins.SecugenPlugin.identify (results) =>
                console.log "SecugenPlugin.identify: " + results
                $( "#message").html(results)
                l.stop()
                obj = JSON.parse(results)
                statusCode = obj.StatusCode
                serviceUuid = obj.UID
                if statusCode == 1
                  viewOptions = {}
                  users = new SecondaryIndexCollection
                  users.fetch
                    fetch: 'query',
                    options:
                      query:
                        key: serviceUuid,
                        include_docs: true,
                        fun: 'by_serviceUuid'
                    success: =>
                      console.log JSON.stringify users
                      if users.length > 0
                        if user == "Admin"
                          adminUser = users[0]
                          console.log JSON.stringify adminUser
                          Coconut.currentAdmin = adminUser
                          Coconut.router.navigate "displayUserScanner", true
                        else
                          user = users[0]
                          console.log JSON.stringify user
                          Coconut.currentClient = user
                          Coconut.router.navigate "displayClientRecords", true
                else
                  $( "#message").html("No match - you must register.")
                  if  @nextUrl?
                    Coconut.router.navigate @nextUrl, true
                  else
                    Coconut.router.navigate "registration", true
            else
              cordova.plugins.SecugenPlugin.register (results) =>
              console.log "SecugenPlugin.register: " + results
              $( "#message").html(results)
              l.stop()
              obj = JSON.parse(results)
              statusCode = obj.StatusCode
              serviceUuid = obj.UID
              if statusCode == 1
                uuid = coconutUtils.uuidGenerator(30)
                Coconut.currentClient = new Result
                  _id:uuid
                  serviceUuid:serviceUuid
                console.log "currentClient: " + JSON.stringify Coconut.currentClient
                $( "#message").html("No match - you must register.")
                if  @nextUrl?
                  Coconut.router.navigate @nextUrl, true
                else
                  Coconut.router.navigate "registration", true
              else
                Coconut.router.navigate "displayAdminScanner", true
          else
            i=1
            interval = setInterval =>
              if i == 50
                uuid = coconutUtils.uuidGenerator(30)
                serviceUuid = coconutUtils.uuidGenerator(30)
                console.log("Go to next page. Generated UUID: " + uuid)
                Coconut.currentClient = new Result
                  _id:uuid
                  serviceUuid:serviceUuid
                $( "#message").html("Scanning complete!")
                l.stop()
                if  @nextUrl?
                  Coconut.router.navigate @nextUrl, true
                else
                  Coconut.router.navigate "registration", true
#                  window.setTimeout =>
#                    Coconut.router.navigate("registration")
#                  , 2000
                clearInterval(interval);
              i++
            ,50
          return false;
        console.log "revealSlider"
        progress = document.querySelector("paper-progress")
        button = document.querySelector("paper-button")
#        thisSliderId = sliderId  if typeof sliderId isnt "undefined"
#        startProgress()
        startLadda(event)
        repeat = undefined
        maxRepeat = 5
#        addEventListener "polymer-ready", ->
#          startProgress()
#          return

#        return
      revealSlider event, method, user


        #      if not typeof cordova is "undefined"
#        cordova.plugins.SecugenPlugin.register ((results) ->
#          #                display(JSON.stringify(results));
#          console.log("SecugenPlugin register: " + results)
#          $("#message").html results
#          return
#
#        #                revealSlider();
#        ), (e) ->
#          console.log "Error: " + e
#          $("#message").html "Error:" + results
#          return
#
#
#      #                display("Error: " + e);
#      else
#        console.log "Cordova is not initialised. Plugins will not work."
#        revealSlider event, method
#      return

    
    #        revealSlider: function(e) {
    #            console.log("click scan.")
    #
    #            $( "#slider" ).show();
    #
    #            $( "#slider" ).parent().find('input').hide();
    #            $( "#slider" ).parent().find('.ui-slider-track').css('margin','0 15px 0 15px');
    #            $( "#slider" ).parent().find('.ui-slider-handle').hide();
    #            $( "#slider" ).slider({
    #                value: 0
    #                // setup the rest ...
    #            });
    #
    #            var i = 1;
    #            var interval = setInterval(function(){
    #                Coconut.progressBar.setValue('#slider',i);
    #                if(i === 50) {
    #                    console.log("Go to next page.")
    #                    $( "#message").html("Scanning complete!")
    #                    window.setTimeout(function() { Coconut.router.navigate("registration")}, 2000);
    #                    clearInterval(interval);
    #                }
    #                i++;
    #            },50);
    #        },
    
    #
    #         appends @message to the message div:
    #         
    display: (message) ->
      console.log "display message."
      display = document.getElementById("message") # the message div
      lineBreak = document.createElement("br") # a line break
      label = document.createTextNode(message) # create the label
      display.appendChild lineBreak # add a line break
      display.appendChild label # add the message node
      return



#        initSlider: function () {
#            $('<input>').appendTo('[ data-role="content"]').attr({'name':'slider','id':'slider','data-highlight':'true','min':'0','max':'100','value':'50','type':'range'}).slider({
#                create: function( event, ui ) {
#                    $(this).parent().find('input').hide();
#                    $(this).parent().find('input').css('margin-left','-9999px'); // Fix for some FF versions
#                    $(this).parent().find('.ui-slider-track').css('margin','0 15px 0 15px');
#                    $(this).parent().find('.ui-slider-handle').hide();
#                }
#            }).slider("refresh");
#
#            // Test
#            var i = 1;
#            var interval = setInterval(function(){
#                Coconut.progressBar.setValue('#slider',i);
#                if(i === 99) {
#                    console.log("Go to next page.")
#                    $( "#message").html("Scanning complete!")
#                    clearInterval(interval);
#                }
#                i++;
#            },100);
#        }
