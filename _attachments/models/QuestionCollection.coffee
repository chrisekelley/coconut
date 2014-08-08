class QuestionCollection extends Backbone.Collection
  model: Question
  url: '/question'
  sync: BackbonePouch.sync
    db: PouchDB(Coconut.db_name)
    fetch: 'query'
    options:
      query:
        include_docs: true,
        fun: QUERIES.byQuestion
  parse: (result) ->
    _.pluck result.rows, 'value'
