class LocalConfig extends Backbone.Model
  initialize: ->
    @set
      _id: "coconut.config.local"

  url: "/local_configuration"
