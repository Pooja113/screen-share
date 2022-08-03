var userData = JSON.parse(localStorage.getItem('userData'));
$("#user_fullname").text(userData.full_name);
const socket = io("http://rdsapi.gcmtechsolutions.com", {
    reconnection: false,
    transports: ['polling'],
    upgrade: false
});
socket.on("connect", () => {
    console.log(socket.id); // x8WIv7-mJelg7on_ALbx
    socket.emit('join', { senderID: userData.user_id });

});
// if someting went wront and node script sent error data
socket.on('error', function () {
    console.error(arguments);
});
socket.on('CallStartNotification', function (data) {
    console.log(data);
    if (data.reciverID === userData.user_id) {
        localStorage.setItem('unique_room_id', data.unique_room_id);
        var txt = data.caller_name + ' ' + 'is calling....';
        $(".toast-body").text(txt);
        $('.toast').toast('show');
    }
});

socket.on('sendMessagetoGroupchat', function (data) {
    //console.log(data); return ;
    var groupID = localStorage.getItem('groupID');
    if (groupID === data.groupID && data.senderID != userData.user_id) {
        var msgdateTime = new Date();
        msgDate = msgdateTime.toLocaleDateString("en-US");
        msgTime = msgdateTime.toLocaleTimeString("en-US");
        // process data from node script
        $('#grpMsgDiv').append(
            `<div class="d-flex justify-content-start mb-4">
                        <div class="img_cont_msg">
                            <img src="https://static.turbosquid.com/Preview/001292/481/WV/_D.jpg" class="rounded-circle user_img_msg">
                            <span>`+ data.full_name + `</span>
                            </div>
                        <div class="msg_cotainer">`
            + data.msg +
            `<span class="msg_time">` + msgDate + ' ' + msgTime + `</span>
                        </div>
                    </div>`
        );
    };

    //console.log(data.msg);
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
    //console.log("1111");
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
                $('#grpMsgDiv').append(
                    `<div class="d-flex justify-content-end mb-4">
                                <div class="msg_cotainer_send">`
                    + msg +
                    `<span class="msg_time_send">` + msgDate + ' ' + msgTime + `</span>
                                </div>
                                <div class="img_cont_msg">
                                <img src="images/rohit_im.svg">
                                </div>
                                </div>`
                );
                $("#usgMsgtext").val('');
                var objDiv = document.getElementById("grpMsgDiv");
                objDiv.scrollTop = objDiv.scrollHeight;
                var groupID = localStorage.getItem('groupID');
                socket.emit('sendMessageToGroup', { groupID: groupID, senderID: userData.user_id, full_name: userData.full_name, message: msg });
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
    $('#grpMsgDiv').append(
        `<div class="d-flex justify-content-end mb-4">
                    <div class="msg_cotainer_send">`
        + msg +
        `<span class="msg_time_send">` + msgDate + ' ' + msgTime + `</span>
                    </div>
                    <div class="img_cont_msg">
                    <img src="images/rohit_im.svg">
                    </div>
                    </div>`
    );
    $("#usgMsgtext").val('');
    var objDiv = document.getElementById("grpMsgDiv");
    objDiv.scrollTop = objDiv.scrollHeight;
    var groupID = localStorage.getItem('groupID');
    socket.emit('sendMessageToGroup', { groupID: groupID, senderID: userData.user_id, full_name: userData.full_name, message: msg });
});



$("#createGroup").click(function (e) {
    e.preventDefault();
    let group_name = $("#group_name").val();
    let group_description = $("#group_description").val();
    let admin_id = userData.user_id;
    $.ajax({
        type: "post",
        url: "http://rdsapi.gcmtechsolutions.com/api/users/createNewGroup",
        data: { admin_id: admin_id, descriptions: group_description, name: group_name },
        dataType: "json",
        success: function (response) {
            // console.log(response);
            window.location.reload(true);
        }
    });
});

$(function () {
    $.ajax({
        type: "post",
        url: "http://rdsapi.gcmtechsolutions.com/api/users/getAllGroup",
        data: { user_id: userData.user_id },
        dataType: "json",
        success: function (response) {
            console.log(response);
            var len = response.length;
            for (var i = 0; i < len; i++) {
                var group_id = response[i]['group_id'];
                var name = response[i]['name'];
                // console.log(name); class = groupChat_active
                let group = `<div onclick="showGroupChat(` + group_id + `)" class="d-flex  posi_relative mt-3 ">
                                <div class="img_cont">
                                    <img src="./images/people.png" class="rounded-circle user_img">
                                   
                                </div>
                                <div class="user_info" style="cursor:pointer">
                                    <span>`+ name + `</span>                      
                                </div>
                               </div>`;
                $("#GroupChatList").append(group);
            }
        }
    });
});

function showGroupChat(group_id) {
    $("#grpMsgDiv").html('');
    $("#groupChatDiv").removeClass("d-none");
    localStorage.setItem('groupID', group_id);
    let roomIDgrp='group'+group_id;
    localStorage.setItem('unique_room_id',roomIDgrp);
    $.ajax({
        type: "post",
        url: "http://rdsapi.gcmtechsolutions.com/api/users/getGroupdtls",
        data: { group_id: group_id },
        dataType: "json",
        success: function (response) {
            $("#groupName").text(response[0].name);
            //console.log(response.name);
        }
    });


    $.ajax({
        type: "post",
        url: "http://rdsapi.gcmtechsolutions.com/api/users/getMyContacts",
        data: { user_id: userData.user_id },
        dataType: "json",
        success: function (response) {
            $("#addgroupMemberlist").html("");
            $.each(response, function (i, item) {

                $("#addgroupMemberlist").append('<div class="custom-control custom-checkbox"><input type="checkbox" class="custom-control-input groupcheck" value="' + item.friend_id + '" id="chk-' + item.friend_id + '"><label class="custom-control-label" for="chk-' + item.friend_id + '">' + item.full_name + '</label></div>');
            });
        }
    });

    $.ajax({
        type: "post",
        url: "http://rdsapi.gcmtechsolutions.com/api/users/getGroupChat",
        data: { group_id: group_id },
        dataType: "json",
        success: function (response) {
            // console.log(response);
            var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

            $.each(response, function (index, value) {
                var msgdateTime = new Date(value.timestamp);
                msgDate = msgdateTime.toLocaleDateString("en-US", options);
                msgTime = msgdateTime.toLocaleTimeString("en-US");
                if (value.user_id == userData.user_id) {
                    $('#grpMsgDiv').append(
                        `<div class="d-flex justify-content-end mb-4">
                            <div class="msg_cotainer_send">`
                        + value.message +
                        `<span class="msg_time_send">` + msgDate + ' ' + msgTime + `</span>
                            </div>
                            <div class="img_cont_msg">
                            <img src="images/rohit_im.svg">
                             
                            </div>
                            </div>`
                    );
                } else {
                    $('#grpMsgDiv').append(
                        `<div class="d-flex justify-content-start mb-4">
                                    <div class="img_cont_msg">
                                        <img src="https://static.turbosquid.com/Preview/001292/481/WV/_D.jpg" class="rounded-circle user_img_msg">
                                        <span>`+ value.full_name + `</span>
                                    </div>
                                    <div class="msg_cotainer">`
                        + value.message +
                        `<span class="msg_time">` + msgDate + ' ' + msgTime + `</span>
                                    </div>
                                </div>`
                    );

                }

            });

            var objDiv = document.getElementById("grpMsgDiv");
            objDiv.scrollTop = objDiv.scrollHeight;
        }
    });
}

$("#add_group_member").click(function (e) {
    e.preventDefault();
    //addGroupMember
    // alert();
    var groupID = localStorage.getItem('groupID');
    $("input[type='checkbox']:checked").each(function () {

        //addGroupMember
        //alert("Id: " + $(this).attr("id") + " Value: " + $(this).val());
        $.ajax({
            type: "post",
            url: "http://rdsapi.gcmtechsolutions.com/api/users/addGroupMember",
            data: { user_id: $(this).val(), group_id: groupID },
            dataType: "json",
        });
    });
    window.location.reload(true);
});

function viewGroupMembers() {
    var groupID = localStorage.getItem('groupID');
    $('#viewGroupMemberlist').html(" ");
    $.ajax({
        type: "post",
        url: "http://rdsapi.gcmtechsolutions.com/api/users/viewGroupMembers",
        data: { group_id: groupID },
        dataType: "json",
        success: function (response) {
            $.each(response, function (key, value) {
                $('#viewGroupMemberlist').append(`<tr>
                            <td>`+ value.full_name + `</td>
                            <td>`+ value.email + `</td>
                            <td>`+ value.mobile + `</td>
                            </tr>`);
            })
            $('#viewGroupMember').modal("show")
        }
    });

}

$("#groupVideoCall").on("click", function () {
    window.location.href="group_video_call.html";
});
$("#groupAudioCall").on("click", function () {
    window.location.href="group_audio_call.html"; 
  });