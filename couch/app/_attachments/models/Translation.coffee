class Translation extends Backbone.Model
    url: "/translation"

    toJSON: ->
        json = super()
    #    _.each json, (value, key) =>
    #        if value? and _.contains(@identifyingAttributes, key)
    #            json[key] = b64_sha1(value)

        return json
