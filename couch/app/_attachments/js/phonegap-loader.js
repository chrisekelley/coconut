// kudos: http://stackoverflow.com/a/17049268

(function(){
  var useragent = navigator.userAgent;
  console.log("useragent:" + useragent)
  if (useragent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/)) {
    loadScript('cordova.js');
  }

  function loadScript(url){
    // synchronous load by @Sean Kinsey
    // http://stackoverflow.com/a/2880147/813951
    var xhrObj =  new XMLHttpRequest();
    console.log("Fetching url: " + url);
    try {
        xhrObj.open('GET', url, false);
        xhrObj.send('');
        var se = document.createElement('script');
        se.text = xhrObj.responseText;
        document.getElementsByTagName('head')[0].appendChild(se);
    } catch (error) {
        console.log("Unable to fetch script.")
    }


  }
})();