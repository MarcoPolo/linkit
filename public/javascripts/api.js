function api(apiPathName){
    this.apiPathName = apiPathName;
}

function getSession() { 
    if (document.cookie.indexOf('sessionid') != -1){
        return document.cookie.substr(document.cookie.indexOf('sessionid')+10,document.cookie.indexOf('sessionid')+41);
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

