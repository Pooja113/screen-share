const socket = io("http://rdsapi.gcmtechsolutions.com", {
    reconnection: false,
    transports: ['polling'],
    upgrade: false
});

var userData = JSON.parse(localStorage.getItem('userData'));
//console.log(contactUserData);
//client-side
socket.on("connect", () => {
    console.log(socket.id); // x8WIv7-mJelg7on_ALbx
    socket.emit('join', { senderID: userData.user_id });

});


// handle our events
socket.on('sendMessagetoReciver', function (data) {
    var contactUserData = JSON.parse(localStorage.getItem('contactUserData'));
    if (contactUserData.user_id != data.senderID) {
        return false;
    }
    var msgdateTime = new Date();
    msgDate = msgdateTime.toLocaleDateString("en-US");
    msgTime = msgdateTime.toLocaleTimeString("en-US");
    // process data from node script
    $('#privateMSGContainer').append(
        `<div class="d-flex justify-content-start mb-4">
                    <div class="img_cont_msg">
                        <img src="https://static.turbosquid.com/Preview/001292/481/WV/_D.jpg" class="rounded-circle user_img_msg">
                    </div>
                    <div class="msg_cotainer">`
        + data.msg +
        `<span class="msg_time">` + msgDate + ' ' + msgTime + `</span>
                    </div>
                </div>`
    );
    console.log(data.msg);
});


// if someting went wront and node script sent error data
socket.on('error', function () {
    console.error(arguments);
});

$('.send_btn').click(function (e) {
    e.preventDefault();
    let msg = $("#usgMsgtext").val();
    var msgdateTime = new Date();
    msgDate = msgdateTime.toLocaleDateString("en-US");
    msgTime = msgdateTime.toLocaleTimeString("en-US");
    $('#privateMSGContainer').append(
        `<div class="d-flex justify-content-end mb-4">
                    <div class="msg_cotainer_send">`
        + msg +
        `<span class="msg_time_send">` + msgDate + ' ' + msgTime + `</span>
                    </div>
                    <figure class="img_cont_msg">
                    <img src="images/rohit_im.svg">
                    </figure>
                    </div>`
    );
    $("#usgMsgtext").val('');
    var contactUserData = JSON.parse(localStorage.getItem('contactUserData'));
    socket.emit('sendMessage', { reciverID: contactUserData.user_id, senderID: userData.user_id, message: msg });
});
