window.polyglot = new Polyglot()
window.polyglot.extend({
    "Home": "home"
    "verifyAdmin": "verifyAdmin"
})

Handlebars.registerHelper   'polyglot', (phrase)->
    window.polyglot.t(phrase)

if typeof window.CoconutUtils == "undefined" || window.CoconutUtils == null
    window.CoconutUtils = {};

CoconutUtils.fetchTranslation = (languge) ->
    if !options
        options = {}
    deferred = $.Deferred();
#    Coconut.translation = {} if !Coconut.translation
    translation = new Translation {_id: languge}
    opts =
    _.extend options, opts
    translation.fetch
        success: (record)->
            json = record.toJSON()
            window.polyglot = new Polyglot()
            window.polyglot.extend(json)
            Handlebars.registerHelper   'polyglot', (phrase)->
                window.polyglot.t(phrase)
            deferred.resolve()

        error: (error, response) ->
            console.log("Unable to fetch translation for " + " languge:" + languge + " model:" + JSON.stringify(error) + " response: " + response)
    return deferred.promise()

