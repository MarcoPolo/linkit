var apiWrapper = require('../models/api').apiWrapper;
    jsSHA = require('../models/sha').jsSHA,
    mongo = require('mongodb').Db,
    mongoose = require('mongoose')
    Db = mongo.Db,
    Server = mongo.Server,
    BSON = mongo.BSOM,
    OID = mongo.ObjectID;
    twoWeekDelta = 1209600000;
    hostname = 'hexxie.com';


mongoose.connect('mongodb://localhost/linkit');

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var userSchema = new Schema({
    username : {type: String, index: {unique: true } }
  , passHash : {type:String}
  , email : {type:String}
});

var sessionSchema = new Schema({
    userId: ObjectId
  , sessionId : {type:String}
  , date : {type:Date, default: Date.now}
});

var linkSchema = new Schema({
    link : {type:String, required: true}
  , title: {type:String}
  , shortcut : {type:String}
  , userId : ObjectId
});

var userModel = mongoose.model('username',userSchema);
var sessionModel = mongoose.model('session',sessionSchema);
var linkModel = mongoose.model('link',linkSchema);

var api = {};

var innards = {};

innards.randomId = function(){
    var id= '';
    for (var i = 0; i < 8; i++) {
    id+=(((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return id;
}

innards.createSession = function(userId, res){
    sessionModel.findOne({userId:userId},
        function(error, userSession){
            if(error) console.log('something bad happened in getting the session for the user',error);
            if (userSession){
                //lets check if the session is still valid
                if (Date.now() - userSession.date > twoWeekDelta){
                    sessionModel.remove({'._id':userSession._id});
                }
                console.log('reusing session:',userSession.sessionId);
                var sessionId=userSession.sessionId
            }else{
                var session = new sessionModel();
                session.userId = userId;
                session.sessionId = innards.randomId();
                session.save( function(error){
                            if(error) console.log('something bad happened in registering the session',error);
                            else console.log('saved session');
                });
                var sessionId=session.sessionId
                console.log('session is',session.sessionId);
            }
            res.send({login:'successful',sessionId:sessionId});
            
        }
    );
}

api.registerUser = function(parameters,res){
    var user = new userModel(); 
    user.username=parameters.username;
    user.passHash=parameters.passHash;
    if(parameters.email) user.email=parameters.email;
    user.save( function(error){
        if(error) {
            console.log('something bad happened in registering the user',error);
            res.send({register:'unsuccessful',error:'you may have already registered'});
        }else{
            console.log('successfully registered');
            res.send({register:'successful'});
        }
    });

}



api.login = function(parameters,res){
    userModel.findOne({username:parameters.username},
        function(error, userRecord){
                if(error) console.log('something bad happened in logging in the user',error);
                console.log(userRecord);
                if (userRecord.passHash === parameters.passHash && userRecord.username === parameters.username){
                    console.log('logging in', userRecord.username, userRecord._id);
                    innards.createSession(userRecord._id, res);
                }else{
                    res.send({login:'unsucessful',error:'sorry brah, wrong password'});
                }
        }
    );
}

api.logout = function(parameters, res){
    sessionModel.remove({sessionId:parameters.sessionId}, function(err,docs){
        if (!err) res.send({logout:'success'});
        else console.log(err);
    });
}

api.createLink = function(parameters, res){
    sessionModel.findOne({sessionId:parameters.sessionId}, function(error, user) {
        if (error) console.log('something bad happened in getting the user for thelinks',error);

        var link = new linkModel;
        link.link = parameters.link;
        link.title = parameters.title;
        link.shortcut = parameters.shortcut;
        link.userId = user.userId;
        link.save( function(error){
            if(error) {
                console.log('something bad happened in creating link for the user',error);
                res.send({save:'unsuccessful'});
            }else{
                console.log('successfully created link');
                res.send({save:'successful'});
            }
        });
    });
}

api.removeLinks = function(parameters, res){
    sessionModel.findOne({sessionId:parameters.sessionId}, function(error, user) {
        if (error) console.log('something bad happened in getting the user for thelinks',error);

        linkModel.remove({userId:user._id,_id:parameters.linkId},function(error){
            if (error) console.log('something bad happened in removing the link',error);
        });
    });
}

api.getLinks = function(parameters, res){
    console.log(parameters);
    if(parameters.sessionId == 'undefined'){
        res.send({error:'login'});
        return;
    }
    sessionModel.findOne({sessionId:parameters.sessionId}, function(error, user) {
        if (error) console.log('something bad happened in getting the user for thelinks',error);
        if(!user) res.send({error:'login'});
        linkModel.find({userId:user.userId},function(error,links){
            if (error) console.log('something bad happened in getting the links',error);
            res.send({links:links});
        });
    });
}

exports.router = function(req, res){
    var shortcut=req.params.shortcut;
    var sessionId=req.cookies.sessionid;
    console.log(req.headers.host);
    if(sessionId){
        sessionModel.findOne({sessionId:sessionId}, function(error, user) {
            if (error) console.log('something bad happened in getting the routing',error);
            linkModel.findOne({userId:user.userId,shortcut:shortcut}, function(error, link){
                res.redirect(link.link);
            });
        });
    }else{
        var host=req.headers.host;
        var endIndex = host.indexOf(hostname)-1;
        var username = host.substr(0,endIndex);
        console.log(username);
        userModel.findOne({username:username}, function(error, user) {
            if (error) console.log('something bad happened in getting the routing',error);
            console.log(shortcut);
            if(user){
                console.log(user._id);
                linkModel.findOne({"userId":user._id,shortcut:shortcut}, function(error, link){
                    if (error) console.log('something bad happened in getting the routing',error);

                    console.log(link);
                    if(link){
                        res.redirect(link.link);
                    }else{
                        res.send('');
                    }
                });
            }else{
                res.redirect('/login');
            }
        });
    }

}


exports.api = function(req, res){
    var a = new apiWrapper('dfda');
    
    var sigcheck=a.checkSignature(req.body,req.params.signature,jsSHA);
    if(sigcheck && api.hasOwnProperty(req.body.method)) api[req.body.method](req.body.parameters,res);
    console.log(sigcheck);
};
