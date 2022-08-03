var userData = JSON.parse(localStorage.getItem('userData'));
const socket = io("http://rdsapi.gcmtechsolutions.com", {
    reconnection: false,
    transports: ['polling'],
    upgrade: false
});
$(document).ready(function () {


    $("#txt_search").keyup(function () {
        var search = $(this).val();
        if (search != "") {
            $.ajax({
                url: 'http://rdsapi.gcmtechsolutions.com/api/users/search/contacts',
                type: 'post',
                data: { text: search, user_id: localStorage.getItem('user_id_1') },
                dataType: 'json',
                success: function (response) {

                    var len = response.length;
                    $("#searchResult").empty();
                    for (var i = 0; i < len; i++) {
                        var id = response[i]['user_id'];
                        var name = response[i]['full_name'];

                        $("#searchResult").append("<li class='list-group-item' value='" + id + "'>" + name + " <button type='button' class='btn btn-primary btn-sm float-right'><i class='fas fa-paper-plane'></i>  Invite</button> </li>");

                    }

                    // binding click event to li
                    $("#searchResult li").bind("click", function () {
                        setText(this);
                    });

                }
            });
        }
    });
    // update contactlists
    $.ajax({
        url: 'http://rdsapi.gcmtechsolutions.com/api/users/getMyContacts',
        type: 'post',
        data: { user_id: localStorage.getItem('user_id_1') },
        dataType: 'json',
        success: function (response) {
            var len = response.length;
            for (var i = 0; i < len; i++) {
                var id = response[i]['friend_id'];
                var name = response[i]['full_name'];
                var meetingId = response[i]['unique_room_id'];
                // console.log(name);
                $("#contactList").append("<button id='contactList-" + id + "' data-meetingid='" + meetingId + "' onclick='showProfile(" + id + ")' class='cnt_lst_con'><span class='img_active'><img src='images/image_ashish.svg'></span>" + name + "</button>");
            }
        }
    });

    // update invitations contactlists
    $.ajax({
        url: 'http://rdsapi.gcmtechsolutions.com/api/users/getMyinvitations',
        type: 'post',
        data: { user_id: localStorage.getItem('user_id_1') },
        dataType: 'json',
        success: function (response) {
            var len = response.length;
            for (var i = 0; i < len; i++) {
                var id = response[i]['friend_id'];
                var name = response[i]['full_name'];
                var is_accepted = response[i]['is_accepted'];
                var btn = "";
                if (!is_accepted) {
                    var btn = "<span class='float-right'><i onclick='acceptBtn(" + id + ")'  class='fa-solid fa-user-plus text-success pr-4'></i><i onclick='rejectBtn(" + id + ")' class='fa-solid fa-user-xmark text-danger'></i></span>";
                }
                // console.log(name);
                $("#invitationList").append("<button id='invitationList-" + id + "' onclick='showinivitationProfile(" + id + ")' class='cnt_lst_con'><span class='img_active'><img src='images/image_ashish.svg'></span>" + name + btn + "</button>");
            }
        }
    });

    // update invitations contactlists
    $.ajax({
        url: 'http://rdsapi.gcmtechsolutions.com/api/users/getSentinvitations',
        type: 'post',
        data: { user_id: localStorage.getItem('user_id_1') },
        dataType: 'json',
        success: function (response) {
            var len = response.length;
            for (var i = 0; i < len; i++) {
                var id = response[i]['friend_id'];
                var name = response[i]['full_name'];
                // console.log(name);
                var btn = "<span class='float-right text-danger'>Pending</span>";
                $("#sentinvitationList").append("<button id='invitationList-" + id + "' onclick='showinivitationProfile(" + id + ")' class='cnt_lst_con'><span class='img_active'><img src='images/image_ashish.svg'></span>" + name + btn + "</button>");
            }
        }
    });

});

function showProfile(id) {
    // console.log(e);
    $("#contactContainer>div>button.cnt_lst_con").removeClass("active");
    $('#contactList-' + id).addClass('active');
    localStorage.setItem('unique_room_id', $('#contactList-' + id).data('meetingid'));
    $.ajax({
        type: "post",
        url: "http://rdsapi.gcmtechsolutions.com/api/users/viewContactProfile",
        data: { friend_id: id },
        dataType: "json",
        success: function (response) {
            //console.log(JSON.stringify(response));
            localStorage.setItem('contactUserData', JSON.stringify(response));
            $("#contact_full_name").text(response.full_name);
            $("#contact_mobile").html('<strong>Mobile</strong>' + response.mobile);
            $("#contact_email").html('<strong>Email</strong> <a href="#">' + response.email + '</a>');
            $("#personalChat").addClass('d-none');
            $("#chatmeet").removeClass('d-none');
            $("#profileDiv").removeClass('d-none');
            $("#privateMSGContainer").html('');

        }
    });
}
function showinivitationProfile(id) {
    $("#contactContainer>div>button.cnt_lst_con").removeClass("active");
    $('#invitationList-' + id).addClass('active');
    //console.log(id);
    $.ajax({
        type: "post",
        url: "http://rdsapi.gcmtechsolutions.com/api/users/viewContactProfile",
        data: { friend_id: id },
        dataType: "json",
        success: function (response) {
            //console.log(response);
            //localStorage.setItem('contact_email',response.email);
            $("#contact_full_name").text(response.full_name);
            $("#contact_mobile").html('<strong>Mobile</strong>' + response.mobile);
            $("#contact_email").html('<strong>Email</strong> <a href="#">' + response.email + '</a>');
            $("#personalChat").addClass('d-none');
            $("#chatmeet").addClass('d-none');
            $("#profileDiv").removeClass('d-none');

        }
    });
}

function acceptBtn(id) {
    var user_id = localStorage.getItem('user_id_1');
    //console.log(id);
    $.ajax({
        type: "post",
        url: "http://rdsapi.gcmtechsolutions.com/api/users/acceptContactRequest",
        data: { user_id: user_id, friend_id: id },
        dataType: "json",
        success: function (response) {
            if (response.status) {
                location.reload();
            }
        }
    });
}
function rejectBtn(id) {
    var user_id = localStorage.getItem('user_id_1');
    //console.log(id);
    $.ajax({
        type: "post",
        url: "http://rdsapi.gcmtechsolutions.com/api/users/rejectContactRequest",
        data: { user_id: user_id, friend_id: id },
        dataType: "json",
        success: function (response) {
            if (response.status) {
                location.reload();
            }
        }
    });

}

function openChat() {
    var contactUserData = JSON.parse(localStorage.getItem('contactUserData'));
    let user_id = localStorage.getItem('user_id_1');
    $("#profileDiv").addClass('d-none');
    $("#personalChat").removeClass('d-none');
    $("#contactName").text(contactUserData.full_name);
    $.ajax({
        type: "POST",
        url: "http://rdsapi.gcmtechsolutions.com/api/users/getPersonalChat",
        data: { user_id: user_id, contact_user_id: contactUserData.user_id },
        dataType: "json",
        success: function (response) {
            // console.log(response);
            var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

            $.each(response, function (index, value) {
                var msgdateTime = new Date(value.timestamp);
                msgDate = msgdateTime.toLocaleDateString("en-US", options);
                msgTime = msgdateTime.toLocaleTimeString("en-US");
                if (value.sender_id == contactUserData.user_id) {
                    $('#privateMSGContainer').append(
                        `<div class="d-flex justify-content-start mb-4">
                                    <div class="img_cont_msg">
                                        <img src="https://static.turbosquid.com/Preview/001292/481/WV/_D.jpg" class="rounded-circle user_img_msg">
                                    </div>
                                    <div class="msg_cotainer">`
                        + value.message +
                        `<span class="msg_time">` + msgDate + ' ' + msgTime + `</span>
                                    </div>
                                </div>`
                    );
                } else {
                    $('#privateMSGContainer').append(
                        `<div class="d-flex justify-content-end mb-4">
                            <div class="msg_cotainer_send">`
                        + value.message +
                        `<span class="msg_time_send">` + msgDate + ' ' + msgTime + `</span>
                            </div>
                            <figure class="img_cont_msg">
                            <img src="images/rohit_im.svg">
                            </figure>
                            </div>`
                    );
                }

            });

            var objDiv = document.getElementById("privateMSGContainer");
            objDiv.scrollTop = objDiv.scrollHeight;
        }
    });
}

// Set Text to search box and get details
function setText(element) {
    // var value = $(element).text();
    var user_id_2 = $(element).val();
    var user_id_1 = localStorage.getItem('user_id_1');
    if (user_id_2 == user_id_1) {
        return false;
    }
    // $("#txt_search").val(value);
    $("#searchResult").empty();
    $.ajax({
        url: 'http://rdsapi.gcmtechsolutions.com/api/users/contacts/send-invite',
        type: 'post',
        data: { user_id_2: user_id_2, user_id_1: user_id_1 },
        dataType: 'json',
        success: function (response) {
            $("#txt_search").val("");
            $('#invite_to').modal('hide');
            $('#invite_too').modal('show');
        }
    });
}

$("#call_start").click(function (e) {
    e.preventDefault();

    // console.log(userData);alert();
    var contactUserData = JSON.parse(localStorage.getItem('contactUserData'));
    var unique_room_id = localStorage.getItem('unique_room_id')
    socket.emit('callStartContact', { reciverID: contactUserData.user_id, senderID: userData.user_id, unique_room_id: unique_room_id, caller_name: userData.full_name });
    window.location = "call_contact.html";

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
    if (data.reciverID === userData.user_id) {
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
    }

    //console.log(data.msg);
});


// if someting went wront and node script sent error data
socket.on('error', function () {
    console.error(arguments);
});



socket.on('CallStartNotification', function (data) {
    console.log(data);
    if (data.reciverID === userData.user_id) {
        localStorage.setItem('unique_room_id', data.unique_room_id);
        var txt = data.caller_name + ' ' + 'is calling....'
        $(".toast-body").text(txt);
        $('.toast').toast('show')
    }
});

$('#uploadbtn').click(function () {
    $('#fileupload').trigger('click');
});
$('#fileupload').change(function (e) {
    var fileName = e.target.files[0].name;
    files = e.target.files[0];
    $('#usgMsgtext').val('"' + fileName + '" is selected...');
    //alert('The file "' + fileName + '" has been selected.');
});
$('#send_btn').click(function (e) {
    e.preventDefault();
    var file = $('#fileupload')[0].files[0];
    if (file && file.length != 0) {
        var documentData = new FormData();
        documentData.append('avatar', file);
        $.ajax({
            url: 'http://rdsapi.gcmtechsolutions.com/upload-file',
            type: 'POST',
            data: documentData,
            cache: false,
            contentType: false,
            processData: false,
            success: function (response) {
                var msg=`<a href="`+ response.data.url +`" download target="_blank">`+ response.data.name+`</a>`;
                var msgdateTime = new Date();
                msgDate = msgdateTime.toLocaleDateString("en-US");
                msgTime = msgdateTime.toLocaleTimeString("en-US");
                $('#privateMSGContainer').append(
                    `<div class="d-flex justify-content-end mb-4">
                        <div class="msg_cotainer_send">`+msg+`
                    <span class="msg_time_send">` + msgDate + ' ' + msgTime + `</span>
                        </div>
                        <figure class="img_cont_msg">
                        <img src="images/rohit_im.svg">
                        </figure>
                        </div>`
                );
                $("#usgMsgtext").val('');
                var objDiv = document.getElementById("privateMSGContainer");
                objDiv.scrollTop = objDiv.scrollHeight;
                var contactUserData = JSON.parse(localStorage.getItem('contactUserData'));
                socket.emit('sendMessage', { reciverID: contactUserData.user_id, senderID: userData.user_id, message: msg });
            }
        });
        return false;
    }

    let msg = $("#usgMsgtext").val();
    if (msg.length == 0) {
        return false;
    }
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
    var objDiv = document.getElementById("privateMSGContainer");
    objDiv.scrollTop = objDiv.scrollHeight;
    var contactUserData = JSON.parse(localStorage.getItem('contactUserData'));
    socket.emit('sendMessage', { reciverID: contactUserData.user_id, senderID: userData.user_id, message: msg });
});
