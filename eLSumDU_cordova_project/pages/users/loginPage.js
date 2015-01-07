(function () {
    "use strict";
    var app = WinJS.app;

    var ControlConstructor = WinJS.UI.Pages.define("./pages/users/loginPage.html", {
        // This function is called after the page control contents 
        // have been loaded, controls have been activated, and 
        // the resulting elements have been parented to the DOM. 
        ready: function (element, options) {
            options = options || {};
            var button = document.querySelector("#loginButton");
            button.addEventListener("click", this.processLogin,false);
        },
        processLogin: function (args) {
            app.User.login = document.querySelector('#login').value;
            app.User.password = document.querySelector('#password').value;
            WinJS.Promise.as(
                {
                    success: function (responce) {
                        console.log(responce);
                        if (app.User.authentificated) {
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

                }).then(DL.doAuth);
        }
        });

    // The following lines expose this control constructor as a global. 
    // This lets you use the control as a declarative control inside the 
    // data-win-control attribute. 

    WinJS.Namespace.define("Apps.Controls.Users", {
        loginPage: ControlConstructor
    });
})();