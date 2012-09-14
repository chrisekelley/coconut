class Message extends Backbone.Model
  url: "/message"

  sendSMS: (options) ->
    to = (@get "to").replace(/^07/,"2557")
    $.ajax
      url: 'https://CHANGEME/bulksms/dispatch.php'
      dataType: "jsonp"
      data:
        user: 'user'
        password: 'pass'
        msisdn: to
        message: @get "text"
      success: ->
        options.success()
      error: (error) ->
        console.log error
        if error.statusText is "success"
          options.success()
        else
          options.error(error)
