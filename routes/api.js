var apiWrapper = require('../models/api').apiWrapper;

exports.api = function(req, res){
    console.log('woooooo');
    console.log(apiWrapper);
    res.render('login', { title: 'Login:' })
};
