(function () {
    "use strict";

    var app = WinJS.app;
    var nav = WinJS.Navigation;
    var session = app.sessionState;
    var util = WinJS.Utilities;

    var varCourseTutors = new WinJS.Binding.List();


    WinJS.UI.Pages.define("./pages/courses/show.html", {
        processed: function (element, options) {
            element.querySelector("header[role=banner] .pagetitle").textContent = this.title;

            WinJS.Binding.processAll(element,this);
            WinJS.UI.processAll(element).then(function () {
                for (var i in options.Course.tutors) {
                    var tutor = options.Course.tutors[i];
                    varCourseTutors.push(DL.Users.byId(tutor));
                }
            });
            return WinJS.Resources.processAll();
        },

        ready: function (element, options) {
            var course = options.Course;
            element.querySelector("header[role=banner] .pagetitle").textContent = course.title;
            DL.Textbook.processPage(course.textbook);
            if (WinJS.Utilities.isPhone) {
                document.getElementById("backButton").style.display = "none";
            }
        },
        CourseTutors: varCourseTutors,

        init: function (element, options) {
            this.Course = options.Course;
            this.DL = DL;
            this.title = (options && options.title) || WinJS.Resources.getString('Messages.title').value;
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