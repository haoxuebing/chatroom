function _Notification(title, option) {
    var Notification = window.Notification || window.mozNotification || window.webkitNotification;
    Notification.permission === "granted" ? creatNotification(title, option) : requestPermission(title, option);

    function creatNotification(title, option) {
        var instance = new Notification(title, option);
        instance.onclick = function() {
            console.log('onclick');
        };
        instance.onerror = function() {
            console.log('onerror');
        };
        instance.onshow = function() {
            console.log('onshow');
        };
        instance.onclose = function() {
            console.log("close")
        }
    }

    function requestPermission(title, option) {
        Notification.requestPermission(function(status) {
            status === "granted" ? creatNotification(title, option) : failNotification(title);
        });
    }

    function failNotification(title) {
        var timer;
        return function(timer) {
            var index = 0;
            clearInterval(timer);
            timer = setInterval(function() {
                if (index % 2) {
                    document.head.getElementsByTagName("title")[0].innerHTML = '【　　　】' + title;
                } else {
                    document.head.getElementsByTagName("title")[0].innerHTML = '【新消息】' + title;
                }
                index++;
                if (index > 20) {
                    clearInterval(timer);
                }
            }, 500);
        }(timer);
    }
}