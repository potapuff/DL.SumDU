(function () {
    "use strict";

    var ui = WinJS.UI;
    var current_mail = WinJS.Binding.as({ subject: '', body: 'chouse mail' });
    var _set_mail_params = function (source, dest) {
        dest.subject = source.subject;
        dest.body = window.toStaticHTML(source.body.replace(/\n/g, "<br/>"));
    };

    ui.Pages.define("./pages/messages/index.html", {

        _items: DL.Messages.boxes,

        processed: function (element, options) {
            element.querySelector("header[role=banner] .pagetitle").textContent = this.title;
            options = options || {};

            var currentPivotList = 0;

            var pivot = element.querySelector('.mail_pivot').winControl;
            var pivotItems = new WinJS.Binding.List();
            var Groups = this._items;
            var i = Groups.groups.length;
            while (--i >= 0) {
                var group = Groups.groups.getItem(i);
                var item = new WinJS.UI.PivotItem(document.createElement("div"), {
                    'header': WinJS.Resources.getString('Messages.Folder.' + group.key).value
                });
                var list = new WinJS.UI.ListView(item.contentElement, {
                    itemDataSource: this._items.createFiltered(function (obj) {
                        return obj.folder_type == group.key
                    }).dataSource,
                    layout: { type: WinJS.UI.ListLayout },
                    itemTemplate: element.querySelector('.mailItemTemplate'),
                    selectionMode: 'none',
                    oniteminvoked: this._itemInvoked
                });
                var idx = pivotItems.push(item);
                if (group.key == 'I') {
                    currentPivotList = idx;
                }
            }
            if (options.mail) {
                _set_mail_params(options.mail, current_mail);
                var user = options.mail.sender;
                var item = new WinJS.UI.PivotItem(document.createElement("div"), {
                    'header': 'Conversation with'+user.name
                });
                var list = new WinJS.UI.ListView(item.contentElement, {
                    itemDataSource: this._items.createFiltered(function (obj) {
                        return obj.sender_id == user.id || obj.recepient_id == user.id
                    }).dataSource,
                    layout: { type: WinJS.UI.ListLayout },
                    itemTemplate: element.querySelector('.mailItemTemplate'),
                    selectionMode: 'none',
                    oniteminvoked: this._itemInvoked
                });
                currentPivotList = pivotItems.push(item);
            }

            //TODO if mail is set - open tab for this mail
            pivot.items = pivotItems;
            pivot.selectedIndex = currentPivotList-1;
            WinJS.Binding.processAll(element,this);
            WinJS.Resources.processAll(element);
        },

        // This function is called to initialize the page.
        init: function (element, options) {
            this.current_mail = current_mail;
            this.title = (options && options.title) || WinJS.Resources.getString('Messages.title').value;
            this.DL = DL;
        },

        // This function is called whenever a user navigates to this page.
        ready: function (element, options) {
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
                _set_mail_params(invokedItem.data, current_mail);
            });

        }
    });
})();

