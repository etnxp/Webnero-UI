$(document).ready(function(){
    ModelViewController.fillData();
});

var pin_code = "";

$(document).on("click", "#send-modal", function(){
    $('.form-group').removeClass("has-error");
    if(checkMandatoryField("amount") &&
        checkMandatoryField("receiver"))
        openModal();
});

function checkMandatoryField(id){
    if($("#" + id).val() == ""){
        $("#" + id).closest('.form-group').addClass("has-error");
        return false;
    }
    
    return true;
}

function openModal(){
    $("#send-code-modal").modal();
}

$(document).on("click", "#send", function(){
    $(".alert").css("display", "none");
    $(".btn-code").css("display", "none");
    if(pin_code.length < 5){
        sendFail("Provide 5 digits code");
    }
    else {
        console.log(pin_code);
        var coin_selected = $(".btn-selected").attr("id");

        PassportPipeline.setCode(pin_code);
        if(coin_selected == "etnxp-send")
            PassportPipeline.performOperation("etnxp", sendCallback);
        else
            PassportPipeline.performOperation("etnx", sendCallback);            
    }     
});

function sendCallback(coinSymbol){

    PassportPipeline.passportParams.method = 'send';
    PassportPipeline.passportParams.amount = $("#amount").val();
    PassportPipeline.passportParams.receiver = $("#receiver").val();
    PassportPipeline.passportParams.pid = $("#pid").val();
    
    PassportPipeline.remoteCall().then((response) => {
        if(response){
            console.log(response); 
            var sendResult = JSON.parse(response);

            if(sendResult.hasOwnProperty("error"))
                sendFail("Transaction Fail");
            else
                sendSuccess();    
        }
        else
            sendFail("System Fail");
    });
}

$(document).on("click", "#del", function(){
    $("#digit-" + pin_code.length).val("");
    pin_code = pin_code.substring(0, pin_code.length - 1);
});

$(document).on("click", ".digit", function(){
    var digit = $(this).attr("id");
    pin_code += digit;
    $("#digit-" + pin_code.length).val(digit);
});

function sendSuccess(){
    $(".alert-success").css("display", "block");
}

function sendFail(message){
    $(".alert-danger").html("Transfer error: " + message);
    $(".alert-danger").css("display", "block");
    $(".btn-code").css("display", "block");
}