﻿(function () {
    "use strict";

    var app = WinJS.app;
    var nav = WinJS.Navigation;
    var session = app.sessionState;
    var util = WinJS.Utilities;

    WinJS.UI.Pages.define("./pages/home/home.html", {

        init: function (element, options) {
            this.title = (options && options.title) || WinJS.Resources.getString("App.title").value;
        },

        processed: function (element) {
            element.querySelector("header[role=banner] .pagetitle").textContent = this.title;
            WinJS.Binding.processAll();
            WinJS.Resources.processAll();
        },

        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            var hub = element.querySelector(".hub").winControl;

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

   /* var progressBar = document.getElementById("determinateProgressBar");
    progressBar.value = value;*/
})();
/* Nawigation WASD 
WinJS.UI.XYFocus.keyCodeMap.up.push(WinJS.Utilities.Key.w);
WinJS.UI.XYFocus.keyCodeMap.down.push(WinJS.Utilities.Key.s);
WinJS.UI.XYFocus.keyCodeMap.left.push(WinJS.Utilities.Key.a);
WinJS.UI.XYFocus.keyCodeMap.right.push(WinJS.Utilities.Key.d);

WinJS.UI.XYFocus.enableXYFocus();

WinJS.UI.processAll();*/