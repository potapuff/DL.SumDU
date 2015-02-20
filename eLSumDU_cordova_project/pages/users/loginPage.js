(function () {
    "use strict";

    var ControlConstructor = WinJS.UI.Pages.define("./pages/users/loginPage.html", {

        processed: function (element, options) {
            WinJS.Resources.processAll(element);
        },

        ready: function (element, options) {
            options = options || {};
            var user = DL.Users.currentUser;
            if (user) {
                document.querySelector('#login').value = user.login || '';
                if (user.auto_login) {
                    document.querySelector('#auto_login').checked = 'checked';
                }
            }
            var button = document.querySelector("#loginButton");
            button.addEventListener("click", this.processLogin,false);
        },
        processLogin: function (args) {
            var user =  DL.Users.currentUser || {}
            user.login = document.querySelector('#login').value;
            user.password = document.querySelector('#password').value;
            user.auto_login = document.querySelector('#auto_login').value == 'on';
            DL.Users._currentUser = user;
            DL.Users.currentUser; //Renew cache data
            WinJS.Promise.as(
                {
                    success: function (response) {
                        document.getElementById('loginButton').disabled = false;
                        document.getElementById('progressRing').style.display = 'none';
                        if (DL.Users.currentUser.authentificated) {
                            WinJS.Navigation.navigate("./pages/home/home.html", args);
                        } else {
                            document.querySelector(".error-message").innerHTML = response.responseText;
                        }
                    },
                    error: function (response) {
                        WinJS.debug('error'+response);
                        document.getElementById('loginButton').disabled = false;
                        document.getElementById('progressRing').style.display = 'none';
                        document.querySelector(".error-message").innerHTML = ('<p>Wrong password or user name</p>') || '... Problem with connection';
                    },
                    progress: function (responce) {
                        document.getElementById('loginButton').disabled = true;
                        document.getElementById('progressRing').style.display = 'inline';
                        document.querySelector(".error-message").innerHTML = '';
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