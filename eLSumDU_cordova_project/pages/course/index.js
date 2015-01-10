(function () {
    "use strict";

    var ui = WinJS.UI;

    ui.Pages.define("./pages/course/index.html", {

        _items: DL.Courses.grouped_courses,

        processed: function (element) {
            var pivot = document.querySelector('.course_pivot').winControl;
            var pivotItems = new WinJS.Binding.List();
            var Groups = this._items;
            var i = Groups.groups.length;
            while (--i >= 0) {
                var group = Groups.groups.getItem(i);
                var item = new WinJS.UI.PivotItem(document.createElement("div"), { 'header': group.key });
                var list = new WinJS.UI.ListView(item.contentElement, {
                    itemDataSource: this._items.createFiltered(function (obj) {
                        return obj.role_type == group.key
                    }).dataSource,
                    layout: { type: WinJS.UI.ListLayout },
                    itemTemplate: document.querySelector('.courseItemTemplate'),
                    selectionMode: 'none',
                    oniteminvoked: this._itemInvoked
                });
                pivotItems.push(item);
            }
            pivot.items = pivotItems;
            return WinJS.Resources.processAll(element);
        },

        // This function is called to initialize the page.
        init: function (element, options) {
            document.querySelector(".course_pivot");
        },

        // This function is called whenever a user navigates to this page.
        ready: function (element, options) {
            document.querySelector("header[role=banner] .pagetitle").textContent = options.title;
        },

        unload: function () {
            //this._items.dispose();
        },

        // This function updates the page layout in response to layout changes.
        updateLayout: function (element) {
            /// <param name="element" domElement="true" />

            // TODO: Respond to changes in layout.
        },

        _itemInvoked: function (args) {
            args.detail.itemPromise.done(function (invokedItem) {
                WinJS.Navigation.navigate("./pages/course/show.html", { Course: invokedItem.data  });
            });

        }
    });
})();

