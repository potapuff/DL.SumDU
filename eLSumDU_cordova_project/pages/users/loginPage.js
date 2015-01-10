(function () {
    "use strict";

    var ControlConstructor = WinJS.UI.Pages.define("./pages/users/loginPage.html", {
        // This function is called after the page control contents 
        // have been loaded, controls have been activated, and 
        // the resulting elements have been parented to the DOM. 
        ready: function (element, options) {
            options = options || {};
            var user = DL.Users.currentUser;
            if (user) {
                document.querySelector('#login').value = user.login;
            }
            var button = document.querySelector("#loginButton");
            button.addEventListener("click", this.processLogin,false);
        },
        processLogin: function (args) {
            var user =  DL.Users.currentUser || {}
            user.login = document.querySelector('#login').value;
            user.password = document.querySelector('#password').value;
            user.auto_login = true;  // TODO: Append UI with checkbox
            DL.Users._currentUser = user;
            DL.Users.currentUser; //Renew cache data
            WinJS.Promise.as(
                {
                    success: function (responce) {
                        console.log(responce);
                        if (DL.Users.currentUser.authentificated) {
                            WinJS.Navigation.navigate("./pages/home/home.html", args);
                        } else {
                            var pane = document.querySelector(".error-message");
                            pane.innerHtml(responce.responceText);
                        }
                    },
                    error: function (responce) {
                        concole.log(responce);
                        var pane = document.querySelector(".error-message");
                        pane.innerHtml(responce);
                    },
                    progress: function (responce) {
                        var pane = document.querySelector(".error-message");
                        pane.innerHtml("<progress class='win-ring'></progress>");
                    }

                }).then(DL.Users.doAuth);
        }
        });

    // The following lines expose this control constructor as a global. 
    // This lets you use the control as a declarative control inside the 
    // data-win-control attribute. 

    WinJS.Namespace.define("Apps.Controls.Users", {
        loginPage: ControlConstructor
    });
})();