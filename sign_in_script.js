var loader = {
    start: function () {
        document.getElementById('loading').style.display = 'block';
    },
    dismiss: function () {
        document.getElementById('loading').style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', function () {
    setTimeout(function () {
        loader.dismiss();
        if(localStorage.getItem('isLoggedin')){
            window.location = "dashboard.html";
        }
    }, 2000);

}, false);

$("#loginBtn").click(function (e) {
    e.preventDefault();
    var allRequired = true;
    $('.required').each(function () {
        if ($(this).val() == '') {
            allRequired = false;
        }
    });
    if (!allRequired) {
        $("#msgSpan").removeClass('d-none');
        $("#msgSpan").text("Please Enter Email and Password !");
        return false;
    } else {
        $("#msgSpan").addClass('d-none');
    }


    var formData = {
        "email": $('#loginEmail').val(),
        "password": $('#loginPassword').val(),
    };

    $.ajax({
        type: "post",
        url: "http://rdsapi.gcmtechsolutions.com/api/users/login",
        data: formData,
        dataType: "json",
        success: function (response) {
            localStorage.setItem('userData', JSON.stringify(response));
            localStorage.setItem('isLoggedin',true);
            localStorage.setItem('user_id_1',response.user_id);
            window.location = "dashboard.html";
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $('#msgSpan').removeClass("d-none");
            $('#msgSpan').text(jqXHR.responseJSON.message);
        }
    });

});