var username = $("#user").val(),
    password = $("#pass").val();


var passHash = (new jsSHA(password)).getHash('SHA-256','HEX');
loginApi = new apiWrapper('/api');
loginApi.callApi('login',{username:username,hash:passHash},o


function login(){
var username = $("#user").val(),
    password = $("#pass").val();


var passHash = (new jsSHA(password)).getHash('SHA-256','HEX');
loginApi = new apiWrapper('/api');
loginApi.callApi('login',{username:username,hash:passHash},o
}

function checkLogin(data){
    if (data.error){
        console.log('sorry brah, wrong username/pass');
    }else{
        document.cookie="sessionid="+data.sessionid;
    }

}

