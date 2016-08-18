
    var config    = require('config');
    var mongoose  = require('mongoose');

    mongoose.connect(config.get('mongoose.uri'));

    var db = mongoose.connection;

    db.on('error', function (err) {
            console.error('Connection error: ' + err);
    });

    db.once('open', function callback () {
            console.info("Connected to DB!");
    });

    module.exports = mongoose;