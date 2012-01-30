$(document).ready(function(){
    login = new loginWrapper();
    $("#login").click(login.login);
});


function loginjs(){}

function loginWrapper(){
  var loginApi = new apiWrapper('/api');

  function login(){
    var username = $("#user").val()
    , password = $("#pass").val();

    var passHash = (new jsSHA(password)).getHash('SHA-256','HEX');
    loginApi.callAPI('login',{username:username,passHash:passHash},checkLogin);
  }

  function checkLogin(data){
    if (data.error){
      console.log('sorry brah, wrong username/pass');
    }else if(data.login == "successful"){
      //woo you are logged in!
      console.log('woo you are logged in');
      document.cookie="sessionid="+data.sessionId;
      window.location.reload();
    }
  }

  loginjs.prototype = {
    login : login
  }

  return new loginjs;

}
