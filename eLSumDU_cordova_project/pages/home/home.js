(function () {
    "use strict";

    var app = WinJS.app;
    var nav = WinJS.Navigation;
    var session = app.sessionState;
    var util = WinJS.Utilities;

    WinJS.UI.Pages.define("./pages/home/home.html", {

        init: function(element, options){
            return WinJS.Promise.as()
            .then(function () { DL.Courses.courses })
            .then(function () { DL.Messages.messages });
        },
        processed: function (element) {
            WinJS.Binding.processAll();
            WinJS.Resources.processAll();
        },

        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            var hub = element.querySelector(".hub").winControl;
            element.querySelector("header[role=banner] .pagetitle").textContent = WinJS.Resources.getString("App.title").value;

            hub.onheaderinvoked = function (args) {
                args.detail.section.onheaderinvoked(args);
            };
            hub.onloadingstatechanged = function (args) {
                if (args.srcElement === hub.element && args.detail.loadingState === "complete") {
                    hub.onloadingstatechanged = null;
                }
            }
        },

        courseHeaderNavigate: util.markSupportedForProcessing(function (args) {
            nav.navigate("./pages/courses/index.html", { title: args.detail.section.header, groupKey: 'role_type', items: DL.Courses.courses });
        }),

        courseItemNavigate:  util.markSupportedForProcessing(function (event) {
            event.detail.itemPromise.done(function (invokedItem) {
                WinJS.Navigation.navigate("./pages/courses/show.html", { Course: invokedItem.data });
            });
        }),

        messageHeaderNavigate: util.markSupportedForProcessing(function (args) {
            nav.navigate("./pages/messages/index.html", { groupKey: 'I'});
        }),

        messageItemNavigate:  util.markSupportedForProcessing(function (event) {
            event.detail.itemPromise.done(function (invokedItem) {
                WinJS.Navigation.navigate("./pages/messages/index.html",
                    {  mail: invokedItem.data, groupKey: invokedItem.data.folder_type });
            });
        }),

        unload: function () {
            // TODO: Respond to navigations away from this page.
        },

        updateLayout: function (element) {
            /// <param name="element" domElement="true" />

            // TODO: Respond to changes in layout.
        },
    });
})();