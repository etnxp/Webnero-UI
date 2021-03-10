$(function() {
    $('#side-menu').metisMenu();
});

$(document).ready(function(){

    if(!PassportPipeline.hasValidSession()){ 
        location.href = "login.html";
    } else if(sessionStorage.fromLogin == "true"){
        ModelViewController.fillData();
        sessionStorage.setItem("fromLogin", false);
        setInterval(ModelViewController.refreshData, 150000);
        // set a key to authenticate crystalID 
        PassportPipeline.setUUkey('crfi');  
    } else {
        ModelViewController.fillData();
        setInterval(ModelViewController.refreshDataLight, 60000);
    }
});
