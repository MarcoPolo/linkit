$(document).ready(function(){

    register = new registerWrapper();
    register.createCaptcha('captcha');
  $("#captchaSubmit").click(register.register);
  $('#captcha-modal').bind('shown',Recaptcha.focus_response_field);
});


function registerjs(){};

function registerWrapper(){

var cappublickey = '6LdPvMwSAAAAALHpuivE73WXJOaokOX7ZZ5-Na9C';
var regApi = new apiWrapper('/api');

  var register = function (){
    var username = $("#userReg").val()
    , password = $("#passReg").val()
    , email = $("#emailReg").val()
    , challenge = Recaptcha.get_challenge()
      response = Recaptcha.get_response();

    var passHash = (new jsSHA(password)).getHash('SHA-256','HEX');

    regApi.callAPI('registerUser',{username:username,passHash:passHash,email:email, challenge:challenge, response:response},checkStatus());
  }

  var checkStatus = function (){
    return function(data){
      if (data.error){
        switch(data.error) {
          case 'incorrect captcha':
            console.log('incorrect captcha');
            Recaptcha.reload();
            break;
          
          default:
            console.log('sorry brah,',data.error);
        }
      }else if(data.login == "successful"){
        //woo you are registered in!
        console.log('you are now registered');
        document.cookie="sessionid="+data.sessionId;
        window.location.reload();
      }
    }
  }

  var createCaptcha = function (element){
    Recaptcha.create(
      cappublickey,
      element,
      { 
        theme : "clean",
        callback : Recaptcha.focus_response_field
      });
  }

  registerjs.prototype = {
    register : register
  , createCaptcha : createCaptcha
  }

  return new registerjs();
}
