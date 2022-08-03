$('#nextBtn').click(function () {
    $('#firstForm').addClass('d-none')
    $('#nextForm').removeClass('d-none');

});
$('#previousBtn').click(function () {
    $('#firstForm').removeClass('d-none')
    $('#nextForm').addClass('d-none');

});
$('#submitBtn').click(function () {
    var $val = 0;

    //check text fields
    $("input.required").each(function () {
        if (($(this).val()) == "") {
            $(this).addClass("error");
            $val = 1
        }
        else {
            $(this).removeClass("error");
        }

    });
    // if you want to check select fields 
    $("select.required").each(function () {
        if (($(this).val()) == "") {
            $(this).addClass("error");
            $val = 1
        }
        else {
            $(this).removeClass("error");
        }

    });
    if ($val > 0) {
        $('#msgdiv').removeClass("d-none");
        $('#msgdiv').text("All Field is required");
        return false;
    }
    if(IsEmail($('#email').val())==false){
        $('#msgdiv').removeClass("d-none");
        $('#msgdiv').text("Valid Email is required ");
        return false;
    }
    if(!$('#mobile').val().match('[0-9]{10}'))  {
        $('#msgdiv').removeClass("d-none");
        $('#msgdiv').text(" Valid mobile no is required 10 Digits");
        return false;
    }  

    var formData = {
        "full_name": $('#full_name').val(),
        "gender": $('#gender').val(),
        "email": $('#email').val(),
        "password": $('#password').val(),
        "mobile": $('#mobile').val(),
        "dob": $('#dob').val(),
    };

    $.ajax({
        type: "post",
        url: "http://rdsapi.gcmtechsolutions.com/api/users/register",
        data: formData,
        dataType: "json",
        success: function (response) {
            $('#registerForm').trigger("reset");
            $('#msgdiv').removeClass("d-none");
            $("#msgdiv").removeClass("text-danger");
            $("#msgdiv").addClass("text-success");
            $("#previousBtn").addClass("d-none");
            $('#msgdiv').text("You have Successfully registered !");
            // console.log(response);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $('#msgdiv').removeClass("d-none");
            $("#msgdiv").addClass("text-danger");
            //console.log(jqXHR.responseJSON.message);
            
           $('#msgdiv').text(jqXHR.responseJSON.message);
        }
    });
    
});

function IsEmail(email) {
var regex = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
if(!regex.test(email)) {
   return false;
}else{
   return true;
}
}