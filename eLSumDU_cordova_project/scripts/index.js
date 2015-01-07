(function () {
    "use strict";

    WinJS.app = WinJS.Application;
    var app = WinJS.app;
    var nav = WinJS.Navigation;
    var sched = WinJS.Utilities.Scheduler;
    var ui = WinJS.UI;

    app.User = {};
    app.User.login='student15';
    app.User.password = 'student015';
    app.url = "http://dl.sumdu.edu.ua/api/v1/";

    app.bindings = {};

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
        //TODO: do l10n 
        var p = WinJS.xhr({ url: "./strings/" + Windows.Globalization.ApplicationLanguages.languages[0] + "/resources.resjson" })
          .then(function (response) {
              window.strings = JSON.parse(response.responseText);
        }).then(ui.processAll)
          .then(function () {
            return nav.navigate(nav.location || Application.navigator.home, nav.state);
        }).then(function () {
            return sched.requestDrain(sched.Priority.aboveNormal + 1);
        }).then(function () {
            ui.enableAnimations();
        });

    }

})();