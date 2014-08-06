class QuestionCollection extends Backbone.Collection
  model: Question
  url: '/question'
  parse: (result) ->
    _.pluck result.rows, 'value'

