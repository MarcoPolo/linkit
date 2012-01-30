var home = function(){

}

homeWrapper = function(){
    var linkContainer = '#linkContainer',
        linkTitle = '#linkTitle',
        linkUrl = '#linkUrl',
        linkShortcut = '#linkShortcut',
        deleteLink = '.deleteButton',
        createLinkId = '#createLink';

    var api = new apiWrapper('/api');
    var sessionId = getSession();
    $(createLinkId).click(createLink);

    function fetchLinks(){
        api.callAPI('getLinks',{sessionId:sessionId},printLinks);
    }

    function removeLink(){
      return function(){
        var linkid = $(this).attr('id');
        api.callAPI('removeLinks',{sessionId:sessionId, linkid:linkid},printLinks);
      }
    }

    function printLinks(data){
        var links = data.links;
        console.log(data.error);
        if (data.error == 'login'){
          showHome();
          return;
        }
        $(linkContainer).html('');
          var html = '';
          html += '<div class=row>';
          html += '<div class=span2><p>Title:</p></div>';
          html += '<div class=span2><p>Shortcut:</p></div>';
          html += '</div>';
          $(linkContainer).append(html);
        for (var i = 0; i < links.length; i++) {
            var html = '';
            html += '<div class=row>';
            html += '<div class=span2><a class=title href='+links[i].link+'>'+links[i].title +'</a> </div>';
            html += '<div class=span2><span class=shortcut>'+ links[i].shortcut+'</span></div>';
            html += '<div class=span2><button class="btn small danger deleteButton" id='+ links[i]._id+'>Delete</span></div>';
            html += '</div>';
            html += '<br/>';
            $(linkContainer).append(html);
        };

        $(deleteLink).click(removeLink())
        $(linkTitle).val('');
        $(linkUrl).val('');
        $(linkShortcut).val('');
        $(linkTitle).focus();
    
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
    if(typeof(loggedin) == "boolean"){
      var myHome = new homeWrapper();
      myHome.fetchLinks();
      $(linkShortcut).keypress(function(event) {
        if ( event.which == 13 ) {
          myHome.createLink();
        }
      });
    }
});
