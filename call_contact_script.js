var apiObj = null;

function BindEvent(){
    
    $("#btnHangup").on('click', function () {
        apiObj.executeCommand('hangup');
    });
    $("#btnCustomMic").on('click', function () {
        apiObj.executeCommand('toggleAudio');
    });
    $("#btnCustomCamera").on('click', function () {
        apiObj.executeCommand('toggleVideo');
    });
    $("#btnCustomTileView").on('click', function () {
        apiObj.executeCommand('toggleTileView');
    });
    $("#btnScreenShareCustom").on('click', function () {
        apiObj.executeCommand('toggleShareScreen');
    });
}

function StartMeeting(roomName,dispNme,email){
    const domain = 'meet.jit.si';

    //var roomName = 'newRoome_' + (new Date()).getTime();
    
    const options = {
        roomName: roomName,
        width: '100%',
        height: '100%',
        parentNode: document.querySelector('#jitsi-meet-conf-container'),
        userInfo: {
            displayName: dispNme,
            email :email
        },
        configOverwrite:{
            doNotStoreRoom: true,
            startVideoMuted: 0,
            toolbarButtons: [],
            startWithVideoMuted: true,
            startWithAudioMuted: true,
            enableWelcomePage: false,
            prejoinPageEnabled: false,
            disableRemoteMute: true,
            remoteVideoMenu: {
                disableKick: true
            },
        },
        interfaceConfigOverwrite: {
            filmStripOnly: false,
            SHOW_JITSI_WATERMARK: false,
            SHOW_WATERMARK_FOR_GUESTS: false,
            DEFAULT_REMOTE_DISPLAY_NAME: 'New User',
            TOOLBAR_BUTTONS: []
        },
        onload: function () {
            //alert('loaded');
            $('#toolbox').show();
        }
    };
    apiObj = new JitsiMeetExternalAPI(domain, options);

    apiObj.addEventListeners({
        readyToClose: function () {
            //alert('going to close');
            $('#jitsi-meet-conf-container').empty();
                    $('#jitsi-meet-conf-container').text("Call is ended");
                    $('#toolbox').hide();
                    apiObj.dispose();
            // $.ajax({
            //     url: 'http://rdsapi.gcmtechsolutions.com/api/users/updateCallStatus',
            //     type: 'post',
            //     data: { unique_room_id:roomName},
            //     dataType: 'json',
            //     success: function (response) {
            //         $('#jitsi-meet-conf-container').empty();
            //         $('#jitsi-meet-conf-container').text("Call is ended");
            //         $('#toolbox').hide();
            //         apiObj.dispose();
            //     }
            // });
           
        },
        audioMuteStatusChanged: function (data) {
            if(data.muted){
                $("#btnCustomMic").removeClass("bi bi-mic-fill ");
                $("#btnCustomMic").addClass("bi bi-mic-mute-fill ");
               
            }else{
                $("#btnCustomMic").removeClass("bi bi-mic-mute-fill ");
                $("#btnCustomMic").addClass("bi bi-mic-fill ");
            }
            
               
        },
        videoMuteStatusChanged: function (data) {
            if(data.muted){
                $("#btnCustomCamera").removeClass("bi bi-camera-video-fill");
                $("#btnCustomCamera").addClass("bi bi-camera-video-off-fill");
               
            }else{
                $("#btnCustomCamera").removeClass("bi bi-camera-video-off-fill ");
                $("#btnCustomCamera").addClass("bi bi-camera-video-fill");
                
            }
             
        },
        tileViewChanged: function (data) {
            
        },
        errorOccurred:function(data){
            console.log('error_suman',data);
        },
        screenSharingStatusChanged: function (data) {
            if(data.on)
                $("#btnScreenShareCustom").text('Stop SS');
            else
                $("#btnScreenShareCustom").text('Start SS');
        },
        participantJoined: function(data){
            console.log('participantJoined', data);
        },
        participantLeft: function(data){
            console.log('participantLeft', data);
        }
    });

    apiObj.executeCommand('subject', 'GCM Tech');
}

