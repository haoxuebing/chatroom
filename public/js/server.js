// 获取url里面的内容
var url = decodeURI(location.href).split('?')[1].split('&');

// 获取聊天内容框
var chatContent = document.getElementsByClassName('chat-content')[0];

// 获取聊天输入框
var editBox = document.getElementsByClassName('edit-box')[0];

// 获取聊天输入框发送按钮
var editButton = document.getElementsByClassName('edit-button')[0];

// 获取用户名栏
var userName = document.getElementsByClassName('user-name')[0];

// 获取在线人数栏
var onlineCount = document.getElementsByClassName('online-user-count')[0];

// 在线用户框
var onlineUsers = document.getElementsByClassName('online-user-name')[0];

var firstLoad = 1;

// 把登录页面的名称放在右侧
userName.innerHTML = url[1].split('=')[1];
var userImg = document.getElementsByClassName('user-img')[0];

// 把登录页面的头像放在右侧
userImg.src = 'img/' + url[0].split('=')[1];
var logOut = document.getElementsByClassName('log-out')[0];

// 发送按钮绑定点击事件
editButton.addEventListener('click', sendMessage);

// 登出按钮绑定点击事件
logOut.addEventListener('click', closePage);

// 绑定Enter键和发送事件
document.onkeydown = function(event) {
    var e = event || window.event;
    if (e && e.keyCode === 13) {
        if (editBox.value !== '') {
            editButton.click();
        }
    }
};

// 关闭页面
function closePage() {
    var userAgent = navigator.userAgent;
    if (userAgent.indexOf("Firefox") != -1 || userAgent.indexOf("Chrome") != -1) {
        window.location.href = "http://chat.luckybing.top";
    } else {
        window.opener = null;
        window.open("http://chat.luckybing.top", "_self");
        window.close();
    }
}
// socket部分
var socket = io();

// 当接收到消息并且不是本机时生成聊天气泡
socket.on('message', function(information) {
    if (information.name !== userName.textContent) {
        createOtherMessage(information);
    }
});

// 初次进入加载最新5条消息
socket.on('messages', function(informations) {
    if (firstLoad) {
        firstLoad = 0;
        createOtherMessages(informations);
    }
});

// 当接收到有人连接进来
socket.on('connected', function(result) {
    onlineCount.innerHTML = '在线用户:' + result.length;
    nowOnlineUsers(result);
});

// 当接收到有人断开后
socket.on('disconnected', function(result) {
    onlineCount.innerHTML = '在线用户:' + result.length;
    nowOnlineUsers(result);
});

function nowOnlineUsers(users) {
    onlineUsers.innerHTML = '';
    if (users.length > 0) {
        users.forEach(function(user) {
            var text = document.createElement('p');
            text.id = user.id;
            text.innerHTML = user.userName;
            onlineUsers.appendChild(text);
        });
    }
    onlineUsers.scrollTop = onlineUsers.scrollHeight;
}

// 发送本机的消息
function sendMessage() {
    if (editBox.value != '') {
        var myInformation = {
            name: userName.textContent,
            chatContent: editBox.value,
            img: userImg.src,
            createdTime: new Date().toLocaleString()
        };
        socket.emit('message', myInformation);
        createMyMessage(myInformation);
        editBox.value = '';
    }

};

// 生成本机的聊天气泡
function createMyMessage(myInformation) {
    var myMessageBox = document.createElement('div');
    myMessageBox.className = 'my-message-box';

    var messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    var text = document.createElement('span');
    text.innerHTML = editBox.value || myInformation.chatContent;
    messageContent.appendChild(text);
    myMessageBox.appendChild(messageContent);

    var arrow = document.createElement('div')
    arrow.className = 'message-arrow';
    myMessageBox.appendChild(arrow);

    var userInformation = document.createElement('div');
    userInformation.className = 'user-information';
    var userChatImg = document.createElement('img');
    userChatImg.className = 'user-chat-img';
    userChatImg.src = userImg.src;
    var userChatName = document.createElement('div');
    userChatName.className = 'user-chat-name';
    userChatName.innerHTML = userName.textContent;
    userInformation.appendChild(userChatImg);
    userInformation.appendChild(userChatName);
    myMessageBox.appendChild(userInformation);

    var timeBox = document.createElement('div');
    timeBox.align = 'center';
    timeBox.innerHTML = myInformation.createdTime;
    chatContent.appendChild(timeBox);
    chatContent.appendChild(myMessageBox);

    chatContent.scrollTop = chatContent.scrollHeight;
    document.head.getElementsByTagName("title")[0].innerHTML = '聊天室';
}


function createOtherMessages(informations) {
    for (var item = informations.length - 1; item >= 0; item--) {
        if (informations[item].name == userName.textContent) {
            createMyMessage(informations[item]);
        } else {
            createOtherMessage(informations[item]);
        }
    }

}

// 生成其他用户的聊天气泡
function createOtherMessage(information) {
    var otherMessageBox = document.createElement('div');
    otherMessageBox.className = 'other-message-box';

    var otherUserInformation = document.createElement('div');
    otherUserInformation.className = 'other-user-information';

    var userChatImg = document.createElement('img');
    userChatImg.className = 'user-chat-img';
    userChatImg.src = information.img;
    var userChatName = document.createElement('span');
    userChatName.className = 'user-chat-name';
    userChatName.innerHTML = information.name;
    otherUserInformation.appendChild(userChatImg);
    otherUserInformation.appendChild(userChatName);
    otherMessageBox.appendChild(otherUserInformation);

    var otherMessageArrow = document.createElement('div');
    otherMessageArrow.className = 'other-message-arrow';
    otherMessageBox.appendChild(otherMessageArrow);

    var otherMessageContent = document.createElement('div');
    otherMessageContent.className = 'other-message-content';
    var text = document.createElement('span');
    text.innerHTML = information.chatContent;
    otherMessageContent.appendChild(text);
    otherMessageBox.appendChild(otherMessageContent);

    var timeBox = document.createElement('div');
    timeBox.align = 'center';
    timeBox.innerHTML = information.createdTime;
    chatContent.appendChild(timeBox);

    chatContent.appendChild(otherMessageBox);

    chatContent.scrollTop = chatContent.scrollHeight;
    //title提示
    notification(information.chatContent);

}

function notification(title) {
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
            if (index > 10) {
                clearInterval(timer);
            }
        }, 500);
    }(timer);
}