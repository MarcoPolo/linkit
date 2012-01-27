var home = function(){

}

homeWrapper = function(){
    var linkContainer = '#links',
        linkTitle = '#linkTitle',
        linkUrl = '#linkUrl',
        linkShortcut = '#linkShortcut',
        createLinkId = '#createLink';

    var api = new apiWrapper('/api');
    var sessionId = getSession();
    $(createLinkId).click(createLink);

    function fetchLinks(){
        api.callAPI('getLinks',{sessionId:sessionId},printLinks);
    }

    function printLinks(data){
        var links = data.links;
        console.log(data.error);
        if (data.error == 'login') window.location = '/login';
        $(linkContainer).html('');
        for (var i = 0; i < links.length; i++) {
            $(linkContainer).append('<span class=title id='+links[i].title+'>'+links[i].title +'</span> &nbsp&nbsp <span class=shortcut>'+ links[i].shortcut+'</span>');
            $(linkContainer).append('<br/>');
        };
    
    }

    function createLink(){
        var title = $(linkTitle).val(),
            url = $(linkUrl).val(),
            shortcut = $(linkShortcut).val();
        if(url.indexOf('http://') == -1) url = 'http://'+url;
        api.callAPI('createLink',{sessionId:sessionId, title:title, link:url, shortcut:shortcut },fetchLinks);
    }
    


    home.prototype = {
        fetchLinks:fetchLinks
      , createLink:createLink
    };
    return new home();
}

$(document).ready(function(){
    var myHome = new homeWrapper();
    myHome.fetchLinks();
});
