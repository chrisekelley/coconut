class HelpView extends Backbone.View

  el: '#content'

  events:
    "click input[value=Send]": "send"

  render: ->
  
    @$el.html "
      <label style='display:block' for='message'>If you are having trouble please contact your supervisor as soon as possible. You can also describe the problem in the box below and it will send a message to our support team. We'll get back to you as soon as possible.</label>
      <textarea style='width:100%' id='message' name='message'></textarea>
      <div id='messageBox'></div>
      </div>
      <input type='submit' value='Send'></input>
    "

  send: ->
    messageText = $("#message").val()
    return false if messageText.length is 0
    help = new Help
      date: moment(new Date()).format(Coconut.config.get("date_format"))
      text: messageText
      user: User.currentUser.id.replace(/user\./,"")
    help.save()
    sync = new Sync()
    $("#messageBox").append "Attempting to 'Send Data'"
    sync.sendToCloud
      success: ->
        $("#messageBox").append "Thank you for your feedback, it has been sent"
      error: ->
        $("#messageBox").append "There was a problem sending data, but your messages has been saved. If you have connectivity you can try again by pressing the 'Send data' button at the bottom of the screen."

    return false
    
