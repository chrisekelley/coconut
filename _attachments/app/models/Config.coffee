class Config extends Backbone.Model
  initialize: ->
    @id = "coconut.config"
  
  url: "/configuration"

  title: ->
    @get("title") || "Coconut"
