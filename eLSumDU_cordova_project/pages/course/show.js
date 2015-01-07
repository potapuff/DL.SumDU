(function () {
    "use strict";

    var app = WinJS.app;
    var nav = WinJS.Navigation;
    var session = app.sessionState;
    var util = WinJS.Utilities;

    WinJS.UI.Pages.define("./pages/course/show.html", {
        processed: function (element, options) {
            WinJS.Binding.processAll(element, this);
            return WinJS.Resources.processAll();
        },

        ready: function (element, options) {
            var Course = this.Course;
            document.querySelector(".titlearea .pagetitle").textContent = Course.title;
            for (var i in Course.tutors) {
                var tutor = Course.tutors[i];
                DL.User.byLogin(tutor).done(function (obj) {
                    document.querySelector(".TutorsList").winControl.itemDataSource.push(obj);
                });
            }
            if (WinJS.Utilities.isPhone) {
                document.getElementById("backButton").style.display = "none";
            }
        },
        init: function (element, options) {
            this.Course = options.Course;
            this.CourseTutor = new WinJS.Binding.List();
        },
        unload: function () {
            // TODO: Respond to navigations away from this page.
        },

        updateLayout: function (element) {
            /// <param name="element" domElement="true" />

            // TODO: Respond to changes in layout.
        },
    });
})();