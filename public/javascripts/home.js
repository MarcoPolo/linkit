var home = function(){}

homeWrapper = function(){
    var linkContainer = '#links';

    function fetchLinks(){
        var sessionId = getSession();
        var api = new apiWrapper('/api');
        api.callAPI('getLinks',{sessionId:sessionId},printLinks);
    }

    function printLinks(data){
        var links = data.links;
        for (var i = 0; i < links.length; i++) {
            $(linkContainer).append('<span class=title id='+links[i].title+'>'+links[i].title +'</span> &nbsp&nbsp <span class=shortcut>'+ links[i].shortcut+'</span>');
            $(linkContainer).append('<br/>');


        };
    
    }

    home.prototype = {fetchLinks:fetchLinks};
    return new home();
}

var myHome = new homeWrapper();
myHome.fetchLinks();
