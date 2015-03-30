class MessagingView extends Backbone.View

  initialize: ->
    @userCollection = new UserCollection()
    @messageCollection = new MessageCollection()
    @max = 140

  el: '#content'

  events:
    "click #check-all": "checkAll"
    "click .phone-number": "updateToField"
    "click input[value=Send]": "send"
    "keyup #message": "checkLength"

  checkLength: ->
    $("#charCount").html "Characters used: #{$("#message").val().length}. Maximum allowed: #{140}"
    if $("#message").val().length > @max
      $("#charCount").css("color","red")
    else
      $("#charCount").css("color","")

  send: ->
    messageText = $("#message").val()
    return false if messageText.length > @max or messageText.length is 0
    _.each @phoneNumbers, (phoneNumber) ->
      message = new Message
        date: moment(new Date()).format(Coconut.config.get("date_format"))
        text: messageText
        to: phoneNumber
      message.sendSMS
        success: ->
          message.save()
          $("#messageBox").append "Sent '#{messageText}' to #{phoneNumber}"
        error: (error) ->
          $("#messageBox").append "Error: [#{error}] while sending '#{messageText}' to #{phoneNumber}"

    return false

  checkAll: =>
    $("input[type=checkbox].phone-number").attr("checked", $("#check-all").is(":checked"))
    @updateToField()

  updateToField: ->
    @phoneNumbers = _.map $("input[type=checkbox].phone-number:checked"), (item) ->
      $(item).attr("id").replace(/check-user\./,"")
    $("#to").html @phoneNumbers.join(", ")
  
  render: =>
    fields =  "_id,district,name,comments".split(",")
    messageFields =  "date,to,text".split(",")
    @$el.html "
      <h2>Send Message</h2>
      <h3>Select Recipients</h2>


      <table class='recipients'>
        <thead>
          <th></th>
          #{
            _.map( fields, (field) ->
              "<th>#{if field is "_id" then "Phone Number" else  field.humanize()}</th>"
            ).join("")
          }
        </thead>
        <tbody>
        </tbody>
      </table>

      <form id='message-form'>
        Recipients:
        <div id='to'></div>

        <label style='display:block' for='message'>Message</label>
        <textarea style='width:100%' id='message' name='message'></textarea>
        <div id='messageBox'></div>
        </div>
        <input type='submit' value='Send'></input>
        <span id='charCount'></span>
      </form>

      <h3>Sent Messages</h3>
      <table class='sent-messages'>
        <thead>
          #{
            _.map( messageFields, (field) ->
              "<th>#{field}</th>"
            ).join("")
          }
        </thead>
        <tbody>
        </tbody>
      </table>
    "
    
    @userCollection.fetch
      success: =>
        $("table.recipients").before "<input id='check-all' type='checkbox'></input>Select All"
        @userCollection.sortBy (user) ->
          user.get "district"
        .forEach (user) ->
          return unless user.get("_id").match(/\d\d\d/)
          $(".recipients tbody").append "
            <tr>
              <td><input class='phone-number' id='check-#{user.get("_id")}' type='checkbox'></input></td>
              #{
                _.map(fields, (field) ->
                  data = user.get field
                  data = data.replace(/user\./,"") if field is "_id"
                  "<td>#{data}</td>"
                ).join("")
              }
            </tr>
          "
        $(".recipients tbody").append "
          <tr>
            <td><input class='phone-number' id='check-user.0787263670' type='checkbox'></input></td>
            <td>0787263670</td>
            <td></td>
            <td>Ritha</td>
            <td>RTI</td>
          </tr>
          <tr>
              <td><input class='phone-number' id='check-user.3141' type='checkbox'></input></td>
            <td>31415926</td>
            <td></td>
            <td>Test</td>
            <td>Doesn't actually work</td>
          </tr>
        "
        $("a").button()

    @messageCollection.fetch
      success: =>
        @messageCollection.forEach (item) ->
          $(".sent-messages tbody").append "
            <tr>
              #{
                _.map(messageFields, (field) ->
                  "<td>#{item.get field}</td>"
                ).join("")
              }
            </tr>
          "
        
