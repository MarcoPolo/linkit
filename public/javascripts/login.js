$(document).ready(function(){
    $("#login").click(login);
});

function login(){
  var username = $("#user").val()
  , password = $("#pass").val();

  var passHash = (new jsSHA(password)).getHash('SHA-256','HEX');
  loginApi = new apiWrapper('/api');
  loginApi.callAPI('login',{username:username,passHash:passHash},checkLogin);
}

function checkLogin(data){
  if (data.error){
    console.log('sorry brah, wrong username/pass');
  }else if(data.login == "successful"){
    //woo you are logged in!
    console.log('woo you are logged in');
    document.cookie="sessionid="+data.sessionId;
  }
}

