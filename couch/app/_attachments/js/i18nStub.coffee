window.polyglot = new Polyglot()
window.polyglot.extend({
    "Home": "Início",
    "verifyAdmin": "verifyAdmin",
    "Finger": "Finger",
    "Continue": "Continue",
    "scanSendLogs": "scanSendLogs",
    "Login": "Conecte-Se",
    "Settings": "Configurações",
    "PatientEncounters": "Visitas",
    "sendLogs": "sendLogs",
    "District": "District",
    "districtRequired":"Por favor, faça uma seleção para District.",
    "checkingForUpdate":"Verificação de uma atualização para o KiwiPrintsTT.",
    "scanFingerInstructions":"Digitalizar o polegar de sua mão direita. Se não estiver disponível, passe o dedo indicador direito.",
    "L1":"E1",
    "L2":"E2",
    "L3":"E3",
    "L4":"E4",
    "L5":"E5",
    "R1":"D1",
    "R2":"D2",
    "R3":"D3",
    "R4":"D4",
    "R5":"D5",
    "fingerSelectInstructions":"Se estiver a digitalizar o dedo polegar da sua mão direita, selecione D1. O dedo indicador de sua mão direita é D2."
})

Handlebars.registerHelper   'polyglot', (phrase)->
    window.polyglot.t(phrase)

if typeof window.CoconutUtils == "undefined" || window.CoconutUtils == null
    window.CoconutUtils = {};

CoconutUtils.fetchTranslation = (language) ->
    if !options
        options = {}
    deferred = $.Deferred();
#    Coconut.translation = {} if !Coconut.translation
    translation = new Translation {_id: language}
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

