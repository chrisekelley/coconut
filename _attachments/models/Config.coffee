class Config extends Backbone.Model
  initialize: ->
    @set
      _id: "coconut.config"

  fetch: (options) ->
    super
      success:->
        Coconut.config.local = new LocalConfig()
        Coconut.config.local.fetch
          success: ->
            options.success?()
          error: ->
            options.error?()
      error:->
        options.error?()

  
  url: "/configuration"

  title: -> @get("title") || "Coconut"

  database_name: ->
    Backbone.couch_connector.config.db_name

  design_doc_name: ->
    Backbone.couch_connector.config.ddoc_name

  cloud_url: ->
    "#{@get "synchronization_target"}"

  cloud_url_with_credentials: ->
    @cloud_url().replace(/http:\/\//,"http://#{@get "cloud_credentials"}@")
