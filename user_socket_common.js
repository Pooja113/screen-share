//$('.toast').toast('show');
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



socket.on('CallStartNotification', function (data) {
    console.log(data);
    if(data.reciverID===userData.user_id){
        localStorage.setItem('unique_room_id', data.unique_room_id);
        var txt = data.caller_name + ' ' + 'is calling....'
        $(".toast-body").text(txt);
        $('.toast').toast('show')
    }
});