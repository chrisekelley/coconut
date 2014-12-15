window.polyglot = new Polyglot()
window.polyglot.extend({
    "Home": "Início"
})

Handlebars.registerHelper   'polyglot', (phrase)->
    window.polyglot.t(phrase)

fetchTranslation = (languge) ->
    deferred = $.Deferred();
#    Coconut.translation = {} if !Coconut.translation
    translation = new Translation {_id: languge}
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
user = new User
    _id: "user.admin"
user.fetch
    success: ->
        langChoice = user.get('langChoice')
        console.log("langChoice from doc: " + user.get('langChoice'))
        if !langChoice
            langChoice = 'pt'
            user.set('langChoice',langChoice)
            user.save
                success: ->
                    console.log("langChoice saved: " + langChoice)
                error: (json, msg) ->
                    console.log("Error saving langChoice  " + msg)
    error: ->
        console.log("Error: user.admin should be in the local db.")

if !langChoice
    langChoice = 'pt'
    $.cookie('langChoice', langChoice);

deferred = fetchTranslation langChoice
deferred.done ->
    console.log("Got translation.")
