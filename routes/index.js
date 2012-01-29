
/*
 * GET home page.
 */

var reCaptcha = require('recaptcha-async').reCaptcha
  , recaptcha = new reCaptcha();


exports.index = function(req, res){
    res.render('index.jade', { title: 'lynkit' , loggedin: '', user:'test'})
};


exports.login = function(req, res){
    res.render('login', { title: 'Login:' })
};
exports.loginbox = function(req, res){
    res.render('index', { title: 'Home:' })
};

exports.home = function(req, res){
    res.render('index', { title: 'Home:' })
};

exports.register = function(req, res){
    res.render('register', { title: 'Register:' })
}

