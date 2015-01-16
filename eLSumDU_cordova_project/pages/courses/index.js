(function () {
    "use strict";

    var ui = WinJS.UI;

    ui.Pages.define("./pages/courses/index.html", {

        _items: DL.Courses.grouped_courses,

        processed: function (element) {
            element.querySelector("header[role=banner] .pagetitle").textContent = this.title;

            var pivot = document.querySelector('.course_pivot').winControl;
            var pivotItems = new WinJS.Binding.List();
            var Groups = this._items;
            var i = Groups.groups.length;
            var R = WinJS.Resources.getString;
            while (--i >= 0) {
                var group = Groups.groups.getItem(i);
                var item = new WinJS.UI.PivotItem(document.createElement("div"), { 'header': R('Roles.'+group.key).value });
                var list = new WinJS.UI.ListView(item.contentElement, {
                    itemDataSource: this._items.createFiltered(function (obj) {
                        return obj.role_type == group.key
                    }).dataSource,
                    layout: { type: WinJS.UI.ListLayout },
                    itemTemplate: document.querySelector('.courseItemTemplate'),
                    selectionMode: 'none',
                    mangedLV: true,
                    oniteminvoked: this._itemInvoked
                });
                pivotItems.push(item);
            }
            pivot.items = pivotItems;
            WinJS.Binding.processAll(element);
            WinJS.Resources.processAll(element);
        },

        // This function is called to initialize the page.
        init: function (element, options) {
            this.title = (options && options.title) || WinJS.Resources.getString("App.title").value;
        },

        // This function is called whenever a user navigates to this page.
        ready: function (element, options) {},

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
                WinJS.Navigation.navigate("./pages/courses/show.html", { Course: invokedItem.data  });
            });

        }
    });
})();

