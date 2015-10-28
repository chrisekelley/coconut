class Log extends Backbone.Model
    initialize: ->
        username

        if typeof Coconut.currentAdmin != 'undefined' && Coconut.currentAdmin != null
            username = Coconut.currentAdmin.id
        timestamp = moment(new Date()).format(Coconut.config.get "datetime_format")
        if Coconut.version_code != 'undefined'
            coconut_version = Coconut.version_code
        if Coconut.currentDistrict != null
            district = Coconut.currentDistrict


        if typeof device != 'undefined'
            @set
                username: username
                district:district
                timestamp: timestamp
                model: device.model
                platform: device.platform
                deviceUuid: device.uuid
                cordova: device.cordova
                android_version: device.version
                userAgent:  navigator.userAgent
                coconut_version:coconut_version
                collection: "Log"
        else
            @set
                username: username
                district:district
                timestamp: timestamp
                coconut_version:coconut_version
                collection: "Log"

    url: "/Log"

    save: (message,options) ->
        super(message,options)

