$(document).ready(function(){
    $("#login").click(login);
});





function login(){
var username = $("#user").val(),
    password = $("#pass").val();

var passHash = (new jsSHA(password)).getHash('SHA-256','HEX');
loginApi = new apiWrapper('/api');
loginApi.callAPI('login',{username:username,passHash:passHash},checkLogin);
}

function checkLogin(data){
    if (data.error){
        console.log('sorry brah, wrong username/pass');
    }else if(data.login == "successful"){
        //woo you are logged in!
        TINY.box.show({html:'<center><p>success</p></center>', height:50,width:80,openjs:function(){$('.tinner').css('background','lightBlue')}});
        document.cookie="sessionid="+data.sessionId;
    }

}

