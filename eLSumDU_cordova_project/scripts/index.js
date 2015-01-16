(function () {
    "use strict";

    WinJS.app = WinJS.Application;
    var app = WinJS.app;
    var nav = WinJS.Navigation;
    var sched = WinJS.Utilities.Scheduler;
    var ui = WinJS.UI;

    document.addEventListener("deviceready", onReady, false);
    document.addEventListener("resume", onResume, false);
    document.addEventListener("pause", onPause, false);

    WinJS.UI.Pages.define("./pages/shared/header.html", {});
    
    function onReady() {
        // Handle the deviceready event.
        initialize();
    }

    function onResume() {
        // Handle the resume event
    }

    function onPause() {
        // Handle the pause event
    }

    function initialize() {

        nav.history = app.sessionState.history || {};
        nav.history.current.initialPlaceholder = true;

        ui.disableAnimations();
        var lang = window.navigator.language;
        if (['uk-UA', 'en-US'].indexOf(lang) < 0 ) {
            lang = 'en-US';
        }
        var p = WinJS.xhr({ url: "./strings/" + lang + "/resources.resjson" })
          .then(function (response) {
              window.strings = JSON.parse(response.responseText);
        }).then(ui.processAll)
          .then(function () {
              var location = nav.location || Application.navigator.home;
              var user = DL.Users.currentUser;
              var success = function (arg) {
                  return  nav.navigate(location, nav.state);
              }
              var error = function (arg) {
                  return nav.navigate('./pages/users/loginPage.html', arg)
              }
              var process = function (arg) {
                  //return console.log('auto login auth process...');
              }
              if (user && user.auto_login) {
                  return DL.Users.doAuth({ success: success, error: error, progress: process })
              }
              error(nav.state);
        }).then(function () {
            return sched.requestDrain(sched.Priority.aboveNormal + 1);
        }).then(function () {
            ui.enableAnimations();
        });

    }

})();

