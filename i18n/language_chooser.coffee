# kudos:http://www.tipsfromsiliconvalley.com/2013/09/07/internationalization-i18n-of-a-backbone-js-application-using-polyglot/#sthash.Ztd5XFeE.dpuf
#Handlebars.registerHelper   'polyglot', (phrase)->
#    Polyglot.t(phrase)
userLang = navigator.language || navigator.userLanguage
file = 'en.js'
if userLang == "en-US" || userLang == "en_Us "
    file = 'en.js'
else
    file = 'pt_PT.js'
file = 'pt_PT.js'
console.log "userLang: " + userLang + "file: " + file
url = '<script type="text/javascript" src="i18n/'+file+'"></script>'  #directory with your translation files
$('head').append(url);


