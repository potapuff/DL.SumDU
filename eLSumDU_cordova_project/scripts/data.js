(function () {
    "use strict";

    var app = WinJS.app;

    function processPage(_url) {
        console.log(_url);
        var url = document.createElement('a');
        url.href = _url;
        var placeholder = document.querySelector(".courseHolder");
        var process  = function (progress) {
            placeholder.innerHTML = "<progress class='win-ring' id='progressRing'></progress>";
        }
        var error = function(error){
            placeholder.innerHTML = "page fetch fail";
        }

        return WinJS.xhr({ url: url.href })
               .then(
                  function (response) {
                      console.log('start process');
                      console.log(response);
                      var html = response.responseText;
                      var textbooks,ex;
                      try {
                          textbooks = (new DOMParser()).parseFromString(html, "text/html");
                      } catch (ex) {
                          var doc = document.implementation.createHTMLDocument("");
                          WinJS.Utilities.setInnerHTMLUnsafe(doc.documentElement, html);
                          textbooks = doc;
                      }
                      // get root url for document 
                      var parts = url.pathname.replace('index.html', '').replace(/\/$/, '').split('/');
                      var normalized_doc_url = [url.protocol + '/', url.host, parts.join('/')].join('/');
                      parts.pop();
                      var normalized_root_url = [url.protocol + '/', url.host, parts.join('/')].join('/')
                      // rush!
                      WinJS.Utilities.query('a', textbooks).forEach(function (obj, idx, arr) {
                          var str = obj.attributes['href'] && obj.attributes['href'].value;
                          if (!str) {
                              return;
                          }
                          if (str.indexOf('/') == 0) {
                              obj.protocol = url.protocol;
                              obj.hostname = url.hostname;
                          } else {
                              if (str.indexOf('..') == 0) {
                                  str = str.replace('..', normalized_root_url);
                                  obj.href = str;
                              } else {
                                  obj.href = normalized_doc_url +'/' + str;
                              }
                          }
                      });
                      var base_url = new RegExp(/^.*\/\/.*?\/(www\/)?/);
                      WinJS.Utilities.query('img', textbooks).forEach(function (obj, idx, arr) {
                          obj.src = obj.src.replace(base_url, normalized_doc_url + '/');
                      });
                      console.log('before place')
                      WinJS.Utilities.setInnerHTMLUnsafe(placeholder, textbooks.getElementsByClassName('mainContent')[0].innerHTML);
                      console.log('after place')
                      WinJS.Utilities.query('a', placeholder).forEach(function (obj, idx, arr) {
                          obj.addEventListener('click', DL.Textbook.navigate, false);
                      });
                      console.log('touch img')
                      WinJS.Utilities.query('img', placeholder).forEach(function (obj, idx, arr) { obj.src = obj.src+'?renew';});
                  }, error, process
                  );
    }

    var textbookClickEvent = function (event) {
        DL.Textbook.processPage(event.target.href);
        event.preventDefault();
        return false;
    };


    WinJS.Namespace.define("DL.Textbook", {
        processPage: processPage,
        navigate: textbookClickEvent,
    });

    //TODO remane url to api_url
    WinJS.Namespace.define("DL", {
        url: "http://dl.sumdu.edu.ua/api/v1/",
        site: "dl.sumdu.edu.ua"
    });

    function currentUser() {
        var user = DL.Users._currentUser || getCacheData('current_user', 60 * 60 * 24 * 7 * 3);
        if (user && user.auto_login) {
            cacheData('current_user', {login:user.login, password:user.password,auto_login:user.auto_login});
        }
        return user;
    }

    function doLogout() {
         //TODO implemet
    }

    function doAuth(options) {
        options = options || {};
        var user = currentUser();
        if (!user) {
           return WinJS.Promise.as(options.error);
        }
        return WinJS.xhr({ url: DL.url + "party/login?login=" + user.login + "&password=" + user.password })
          .then(
          function (response) {
              DL.Users.currentUser.authentificated = true;
              DL.Users.currentUser.attempts = 0;
              if (options.success) {
                  options.success(response);
              }
          },
          function (error) {
              var user = DL.Users.currentUser;
              if (user) {
                  user.attempts = (user.attempts || 0) + 1;
              }
              if (options.error) {
                  options.error(error);
              }
          },
          function (progress) {
              //console.log('Auth courses process...' + progress)
              if (options.progress) {
                  options.progress(progress);
              }
          }
          );
    }

    WinJS.Namespace.define("DL.Users", {
        currentUser: { get: currentUser },
        doAuth: doAuth,
        doLogout: doLogout
    });

    function getCourses() {
        var courses = DL.Courses._courses;
        if (!courses) {
            courses = new WinJS.Binding.List();
            DL.Courses._courses_by_role = courses.createGrouped(
                    function (x) { return (x.role_type || 'none')},
                    function (x) { return {title: WinJS.Resources.getString('Roles.'+(x.role_type||'none'))} },
                    function (str1, str2) { return str1 < str2 ? -1 : str1 > str2; }
                 );
            DL.Courses._courses = courses;
            fetchCourses();
        }
        return courses;
    }

    function getGroupedCourses(){
        var grouped = DL.Courses._courses_by_role;
        if (! grouped){
            getCourses();
            grouped = DL.Courses._courses_by_role;
        }
        return grouped;
    }

    function fetchCourses(){
        var url = DL.url + "courses";
        return  WinJS.xhr({ url: url }).then(
              function (response) {
                  var data = JSON.parse(response.responseText).data;
                  console.log(data);
                  var courses = DL.Courses.courses;
                  for (var i in data) {
                      if (!data[i].logo) {
                          data[i].logo = './images/courses/default.png'
                      }
                      courses.push(data[i]);
                  }
                  return courses;
              },
              function (error) {
                  console.log('error:' + error.responseText);
              },
              function (progress) {
                  //console.log('courses process...' + progress)
              }
              );
    }

    WinJS.Namespace.define("DL.Courses", {
        courses: { get: getCourses },
        grouped_courses: {get: getGroupedCourses}
    });

    function getPm() {
        var pm = DL.Messages._messages;
        if (!pm) {
            pm = new WinJS.Binding.List();
            DL.Messages._inbox = pm.createFiltered(function (x) { return x.folder_type == 'I' });
            DL.Messages._unread = DL.Messages._inbox.createFiltered( function (x) { return !x.is_read });
            DL.Messages._boxes = pm.createGrouped(
                    function (x) { return x.folder_type },
                    function (x) { return { title: WinJS.Resources.getString('Folder.' + x.folder_type) } },
                    function (str1, str2) { return str1 < str2 ? -1 : str1 > str2; }
                 );
            DL.Messages._messages = pm;
            fetchPm();
        }
        return pm;
    }
    function fetchPm(){
        var url = DL.url + "pm";
        return WinJS.xhr({ url: url }).then(  
          function (response) {
              var data = JSON.parse(response.responseText).data;
              var messages = DL.Messages.messages;
              for (var i = 0, len = data.length; i < len; i++) {
                  var user = DL.Users.byId(data[i].sender_id);
                  data[i].sender = user;
                  messages.push(data[i]);
              }
              return messages;
          },
          function (error) {
              console.log('error:' + error.responseText);
          },
          function (progress) {
             // console.log('messages process...' + progress)
          }
        );
    }

    function getInbox(){
        var pms = DL.Messages._inbox || (getPM() && DL.Messages._inbox);
        return pms;
    }

    function getUnread(){
        var pms = DL.Messages._unread || (getPM() && DL.Messages._unread);
        return pms;
    }

    function getGrouped(){
        var pms = DL.Messages._boxes || (getPM() && DL.Messages._boxes);
        return pms;
    }

    WinJS.Namespace.define("DL.Messages", {
        messages: { get: getPm },
        inbox: { get: getInbox },
        unread: { get: getUnread},
        boxes: {get: getGrouped}
    });

//-------------------------------------------------------------------------------------------------

    function initUsers() {
        //TODO load from cache if possible
        DL.Users._users = new WinJS.Binding.List();
        DL.Users._users_by_id = DL.Users._users.createGrouped(
                    function (x) { return x.id },
                    function (x) { return {} },
                    function (str1, str2) { return str1 < str2 ? -1 : str1 > str2; }
        );
        DL.Users._users_by_login = DL.Users._users.createGrouped(
                    function (x) { return x.login },
                    function (x) { return {} },
                    function (str1, str2) { return str1 < str2 ? -1 : str1 > str2; }
        );
    }


    var noOne = { id: -1, login: 'UNKNOWN', name: 'UNKNOWN', image: './images/users/default.png' };

    function processingUserStub(user_id) {
        return WinJS.Binding.as({ name: 'processing...', image: './images/users/processing.gif', id: user_id });
    }

    function cacheUsers() {
        //TODO add caching
    }

    function getUserById(user_id) {
        if (typeof user_id == 'undefined') {
            return noOne;
        }
        if (!DL.Users._users) {
            initUsers();
        }
        var id = DL.Users._users_by_id.groups.getItemFromKey(user_id);
        var user;
        if (id) {
            user = DL.Users._users_by_id.getAt(id.firstItemIndexHint);
        } else {
            user = processingUserStub(user_id);
            DL.Users._users.push(user);
            var url = DL.url + "party/by_id/" + user_id;
            WinJS.xhr({ url: url }).then(
              function (response) {
                var data = JSON.parse(response.responseText).data;
                var id = DL.Users._users_by_id.groups.getItemFromKey(data.id);
                var user = DL.Users._users_by_id.getAt(id.firstItemIndexHint);
                extend(user, data);
                DL.Users._users_by_id.notifyReload();
                cacheUsers();
                return user;
                },
                function (error) {
                    console.log('error:' + error.responseText);
                    return noOne;
                },
                function (progress) { }
            );
        }
        return user;
    }

    WinJS.Namespace.define("DL.Users", {
        byId: getUserById,
    });

    //------------------------------------------

    function clearCache(key) {
        window.localStorage[key] = null;
    }

    function cacheData(key, data) {
        window.localStorage[key] = JSON.stringify({
            date: new Date(),
            data: data
        })
    }
    function getCacheData(key, maxSeconds) {
        var secondsInADay = maxSeconds || 86400;
        var cache = window.localStorage[key];
        if (cache) {
            cache = JSON.parse(cache);
            if ((new Date() - new Date(cache.date)) / 1000 < secondsInADay) {
                return cache.data;
            } else {
                clearCache(key);
            }
        }
    }

    //Copy from hash to object 
    function extend(dest, source) {
        for (var prop in source) {
            dest.setProperty(prop, source[prop]);
        }
        return dest;
    }
   
})();
