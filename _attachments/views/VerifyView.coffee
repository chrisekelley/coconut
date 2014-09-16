VerifyView = Backbone.Marionette.ItemView.extend
#    template: "VerifyView"
    template: JST["_attachments/templates/VerifyView.handlebars"]()
    className: "itemView" # this class will be added to the wrapping div when you render the view
    events:
      "click #verify": "scan"
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
      @scan e, "userRegistration"
      return

    scan: (event, sliderId) ->
      this.eventUrl = @nextUrl
      display = (message) ->
        console.log "display message: " + message
        display = document.getElementById("message") # the message div
        lineBreak = document.createElement("br") # a line break
        label = document.createTextNode(message) # create the label
        display.appendChild lineBreak # add a line break
        display.appendChild label # add the message node
        return

      revealSlider = (event, sliderId) =>
        startLadda = (e) =>
          l = Ladda.create(e.currentTarget)
          l.start()
#          if not typeof cordova is "undefined"
          if @hasCordova
            cordova.plugins.SecugenPlugin.register (results) =>
              console.log "SecugenPlugin.register: " + results
              l.stop()
              #              Uploaded: b174ef51-d685-4a6b-a4ec-44b65670447d matches 3977ee73-fe47-4310-95bf-f6fee71c4346 Score: 46.6485
              #              "Error: " + uploadMessage + " Error: " + e
              #              callbackContext.success("Uploaded: " + uploadMessage);
              #              message = "NoMatch";
              #					     message = "Match: " + probe.Name + " matches " + match.Name + " Score: " + score;
              #              newUuid = resultsArray[0]
              #              matchUuid = resultsArray[1]
              resultsArray = results.split(" ")
              if (resultsArray.length > 2)
                info1 = resultsArray[0]
                info2 = resultsArray[1]
                if info2 == "NoMatch"
                  $( "#message").html("No match - you must register.")
                  if  @nextUrl?
                    Coconut.router.navigate @nextUrl, true
                  else
                    Coconut.router.navigate "registration", true
                else if info2 == "Match"
                  probe = resultsArray[2]
                  match = resultsArray[4]
                  score = resultsArray[6]
#                  l.stop()
                  $( "#message").html(results)
                else
#                  l.stop()
                  $( "#message").html(results)

#          $.post("your-url",
#            { data : data },
#            function(response){
#            console.log(response);
#          }, "json")
#          .always(function() { l.stop(); });
          else
            i=1
            interval = setInterval =>
              if i == 50
                console.log("Go to next page.")
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
        thisSliderId = sliderId  if typeof sliderId isnt "undefined"
#        startProgress()
        startLadda(event)
        repeat = undefined
        maxRepeat = 5
#        addEventListener "polymer-ready", ->
#          startProgress()
#          return

#        return
      revealSlider event, sliderId


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
#        revealSlider event, sliderId
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
