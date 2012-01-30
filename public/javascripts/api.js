function api(apiPathName){
    this.apiPathName = apiPathName;
}

function getSession() { 
    if (document.cookie.indexOf('sessionid') != -1){
        return document.cookie.substr(document.cookie.indexOf('sessionid')+10,32);
    }
}

if (!api.prototype.history){
    api.prototype.history = [];
}

function apiWrapper(apiPathName){

    //constants
    var publicKey = '009DBDD9C9732F59445E831AEE65717A072FA96A2D7082E0425A3C2061EB6013';
    var secretKey = '11A112F200DD31331C5D538101E00E4A55F661F52F6F20E3FFA42E74A4FCC957';

    var debug = true


    var history ;

    var history = api.prototype.history;

    var callAPI = function(method, paramObj, callback){
        requestObj = {
            "headers" : {
                "publicKey": publicKey
            },
            "method" : method,
            "parameters" : paramObj
        };
        
        var signature = getSignature(requestObj);
        var requestURL = this.apiPathName + "/" + signature;
        if(debug){
            recordHistory(method, paramObj, callback, Date(), this.apiPathName);
        }

        $.post(requestURL, (requestObj), callback);
    }

    var printHistory = function(){
        for (var i = 0; i < history.length; i++) {
            console.log('The history for index number',i+':');
            console.log('    Method:',history[i].method);  
            console.log('    Parameters:',history[i].parameters);  
            console.log('    Callback:',{callback:history[i].callback});  
            console.log('    Time:',history[i].time);  
            console.log('    api path:',history[i].apiPathName);  
        };
    }

    var recordHistory = function(method, parameters, callback, time, apiPathName){
        history.push({method:method, parameters:parameters, callback:callback, time: time, apiPathName:apiPathName});
    }

    var replayHistory = function(index){ //replays the index of the api history
        if (index < 0) index += history.length; //allow reverse indexing!
        var historyCommand = history[index];
        var api = new apiWrapper(historyCommand.apiPathName);
        api.callAPI(historyCommand.method, historyCommand.parameters, printData);
    }

    var printData = function(data) { //just print the data
        console.log(data);
    }

    var calcHMAC = function(text, key){
        var shaObj = new jsSHA(text);
        return shaObj.getHMAC(key, "ASCII", "SHA-256", "HEX");
    }


    var getSignature = function(requestObj){
        var paramObjSer = JSON.stringify(requestObj),
            signature = calcHMAC(paramObjSer, secretKey);
        return signature;
    }

    api.prototype.callAPI = callAPI;
    api.prototype.printData = printData;
    api.prototype.printHistory = printHistory;
    api.prototype.replayHistory = replayHistory;


    return new api(apiPathName);

}

//useful for getting GET parameters
function getParameterByName(name){
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(window.location.href);
    if(results == null)
        return "";
    else
        return decodeURIComponent(results[1].replace(/\+/g, " "));
}


String.prototype.commafy = function () {
    return this.replace(/(^|[^\w.])(\d{4,})/g, function($0, $1, $2) {
        return $1 + $2.replace(/\d(?=(?:\d\d\d)+(?!\d))/g, "$&,");
    });
}

// Convenience method for numbers
Number.prototype.commafy = function () {
    return String(this).commafy();
}

$(document).ready(function(){
(function(d){d.each(["backgroundColor","borderBottomColor","borderLeftColor","borderRightColor","borderTopColor","color","outlineColor"],function(f,e){d.fx.step[e]=function(g){if(!g.colorInit){g.start=c(g.elem,e);g.end=b(g.end);g.colorInit=true}g.elem.style[e]="rgb("+[Math.max(Math.min(parseInt((g.pos*(g.end[0]-g.start[0]))+g.start[0]),255),0),Math.max(Math.min(parseInt((g.pos*(g.end[1]-g.start[1]))+g.start[1]),255),0),Math.max(Math.min(parseInt((g.pos*(g.end[2]-g.start[2]))+g.start[2]),255),0)].join(",")+")"}});function b(f){var e;if(f&&f.constructor==Array&&f.length==3){return f}if(e=/rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(f)){return[parseInt(e[1]),parseInt(e[2]),parseInt(e[3])]}if(e=/rgb\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*\)/.exec(f)){return[parseFloat(e[1])*2.55,parseFloat(e[2])*2.55,parseFloat(e[3])*2.55]}if(e=/#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(f)){return[parseInt(e[1],16),parseInt(e[2],16),parseInt(e[3],16)]}if(e=/#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/.exec(f)){return[parseInt(e[1]+e[1],16),parseInt(e[2]+e[2],16),parseInt(e[3]+e[3],16)]}if(e=/rgba\(0, 0, 0, 0\)/.exec(f)){return a.transparent}return a[d.trim(f).toLowerCase()]}function c(g,e){var f;do{f=d.curCSS(g,e);if(f!=""&&f!="transparent"||d.nodeName(g,"body")){break}e="backgroundColor"}while(g=g.parentNode);return b(f)}var a={aqua:[0,255,255],azure:[240,255,255],beige:[245,245,220],black:[0,0,0],blue:[0,0,255],brown:[165,42,42],cyan:[0,255,255],darkblue:[0,0,139],darkcyan:[0,139,139],darkgrey:[169,169,169],darkgreen:[0,100,0],darkkhaki:[189,183,107],darkmagenta:[139,0,139],darkolivegreen:[85,107,47],darkorange:[255,140,0],darkorchid:[153,50,204],darkred:[139,0,0],darksalmon:[233,150,122],darkviolet:[148,0,211],fuchsia:[255,0,255],gold:[255,215,0],green:[0,128,0],indigo:[75,0,130],khaki:[240,230,140],lightblue:[173,216,230],lightcyan:[224,255,255],lightgreen:[144,238,144],lightgrey:[211,211,211],lightpink:[255,182,193],lightyellow:[255,255,224],lime:[0,255,0],magenta:[255,0,255],maroon:[128,0,0],navy:[0,0,128],olive:[128,128,0],orange:[255,165,0],pink:[255,192,203],purple:[128,0,128],violet:[128,0,128],red:[255,0,0],silver:[192,192,192],white:[255,255,255],yellow:[255,255,0],transparent:[255,255,255]}})(jQuery);

});

