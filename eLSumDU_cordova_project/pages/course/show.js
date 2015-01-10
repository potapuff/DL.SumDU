(function () {
    "use strict";

    var app = WinJS.app;
    var nav = WinJS.Navigation;
    var session = app.sessionState;
    var util = WinJS.Utilities;

    var varCourseTutors = new WinJS.Binding.List();


    WinJS.UI.Pages.define("./pages/course/show.html", {
        processed: function (element, options) {
            WinJS.Binding.processAll(element, this);
            WinJS.UI.processAll(element).then(function () {
                for (var i in options.Course.tutors) {
                    var tutor = options.Course.tutors[i];
                    DL.Users.byLogin(tutor).done(function (obj) {
                        varCourseTutors.push(obj);
                    });
                }
            });
            return WinJS.Resources.processAll();
        },

        ready: function (element, options) {
            var course = options.Course;
            document.querySelector(".titlearea .pagetitle").textContent = course.title;
           //document.querySelector("#courseFrame").src = course.textbook;

            if (WinJS.Utilities.isPhone) {
                document.getElementById("backButton").style.display = "none";
            }
        },
        CourseTutors: varCourseTutors,
        init: function (element, options) {
            this.Course = options.Course;
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