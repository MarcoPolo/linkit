var apiWrapper = require('../models/api').apiWrapper;
    jsSHA = require('../models/sha').jsSHA,
    mongo = require('mongodb').Db,
    mongoose = require('mongoose')
    Db = mongo.Db,
    Server = mongo.Server,
    BSON = mongo.BSOM,
    OID = mongo.ObjectID;


mongoose.connect('mongodb://localhost/linkit');

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var userSchema = new Schema({
    username : {type: String, index: {unique: true } }
  , passHash : {type:String}
  , email : {type:String}
  , userId : ObjectId
});

var userModel = mongoose.model('username',userSchema);

var api = {};

api.registerUser = function(parameters){
    var user = new userModel(); 
    user.username=parameters.username;
    user.passHash=parameters.passHash;
    if(parameters.email) user.email=parameters.email;
    user.save( function(error){
                if(error) console.log('something bad happened in registering the user',error);
    });

}

api.login = function(username, passHash){
    userModel.find({username:username},
        function(error, docs){
                if(error) console.log('something bad happened in logging in the user',error);
                for (var i = 0; i < docs.length; i++) {
                    console.log('the doc is',doc[i]);
                };
        }
    );
}


exports.api = function(req, res){
    console.log('woooooo');
    console.log(apiWrapper);
    console.log(jsSHA);
    console.log(req.body);
    var a = new apiWrapper('dfda');
    
    var sigcheck=a.checkSignature(req.body,req.params.signature,jsSHA);
    if(sigcheck) api[req.body.method](req.body.parameters);
    console.log(sigcheck);
    
    res.send(req.body);
};
