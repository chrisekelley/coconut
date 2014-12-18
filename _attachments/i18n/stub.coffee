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


#langChoice = $.cookie('langChoice');
#user = new User
#    _id: "user.admin"
#user.fetch
#    success: ->
#        langChoice = user.get('langChoice')
#        console.log("langChoice from doc: " + user.get('langChoice'))
#        if !langChoice
#            langChoice = 'pt'
#            user.set('langChoice',langChoice)
#            user.save null,null,
#                success: ->
#                    console.log("langChoice saved: " + langChoice)
#                error: (json, msg) ->
#                    console.log("Error saving langChoice  " + msg)
#        else
#            deferred = fetchTranslation langChoice
#            deferred.done ->
#                console.log("Got translation.")
#    error: ->
#        console.log("Error: user.admin should be in the local db.")

#if !langChoice
#    langChoice = 'pt'
#    $.cookie('langChoice', langChoice);
