class Log extends Backbone.Model
    initialize: ->
        username

        if typeof Coconut.currentAdmin != 'undefined' && Coconut.currentAdmin != null
            username = Coconut.currentAdmin.id
        timestamp = moment(new Date()).format(Coconut.config.get "datetime_format")
        @set
            username: username
            timestamp: timestamp
            cordova: device.cordova
            model: device.model
            platform: device.platform
            uuid: device.uuid
            version: device.version
            collection: "log"

    url: "/log"

    save: (message,options) ->
        super(message,options)

