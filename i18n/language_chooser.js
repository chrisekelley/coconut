var file, url, userLang;

userLang = navigator.language || navigator.userLanguage;

file = 'en.js';

if (userLang === "en-US" || userLang === "en_Us ") {
  file = 'en.js';
} else {
  file = 'pt_PT.js';
}

file = 'pt_PT.js';

console.log("userLang: " + userLang + "file: " + file);

url = '<script type="text/javascript" src="i18n/' + file + '"></script>';

$('head').append(url);
