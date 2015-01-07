(function () {
    "use strict";

    var app = WinJS.app;
    var nav = WinJS.Navigation;
    var session = app.sessionState;
    var util = WinJS.Utilities;

    var section3Group = Data.resolveGroupReference("group4");
    app.bindings['courses'] = new WinJS.Binding.List();
    app.bindings['pm'] = new WinJS.Binding.List();

    WinJS.UI.Pages.define("./pages/home/home.html", {

        init: function(element, options){
            return WinJS.Promise.as()
            .then(DL.doAuth)
            .then(DL.Courses.getCourses)
            .then(DL.Pm.getPm);
        },
        processed: function (element) {
            return WinJS.Resources.processAll()
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

            // TODO: Initialize the page here.
        },

        courseDataSource: app.bindings['courses'],
        pmDataSource: app.bindings['pm'],

        courseHeaderNavigate: util.markSupportedForProcessing(function (args) {
            nav.navigate("./pages/course/index.html", { title: args.detail.section.header, groupKey: 'role_type', items: app.bindings['courses'] });
        }),

        courseItemNavigate: util.markSupportedForProcessing(function (args) {
            //var item = Data.getItemReference(section3Items.getAt(args.detail.itemIndex));
            //nav.navigate("/pages/course/show.html", { item: item });
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