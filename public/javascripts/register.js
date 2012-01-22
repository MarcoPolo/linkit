$(document).ready(function(){
    $("#register").click(register);
});
function register(){
var username = $("#user").val(),
    password = $("#pass").val();
    email = $("#email").val();

var passHash = (new jsSHA(password)).getHash('SHA-256','HEX');
regApi = new apiWrapper('/api');
regApi.callAPI('registerUser',{username:username,passHash:passHash,email:email},checkStatus);
}

function checkStatus(data){
    if (data.error){
        console.log('sorry brah,',data.error);
        TINY.box.show({html:'<center><p>Error: '+data.error+'</p></center>', height:50,width:160,openjs:function(){$('.tinner').css('background','red')}});
    }else if(data.register == "successful"){
        //woo you are registered in!
        TINY.box.show({html:'<center><p>success</p></center>', height:50,width:80,openjs:function(){$('.tinner').css('background','lightBlue')}});
        document.cookie="sessionid="+data.sessionId;
    }
}
