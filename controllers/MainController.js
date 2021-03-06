    
    var models          = require('../models');
    var players         = require('../models/players');
    var notifications   = require('../models/notifications');
    var worker          = require('../worker');
    var chunk           = require('chunk');
    var async           = require('async');
    
    
    var setStart = function(callback) {
        notifications.findOne({ "name": 'vk' }, function (err, result) {
            if (err) throw err;
            
            if (!result) {
               var error = 'Notifications is not found';
               return callback(error);
            }
            
            if (result.isStart) {
                var error = 'Worker is busy';
                return callback(error);
            }
            else {
                result.isStart = true;
                result.save(function (err, data) {
                    if (err) throw err;
                    callback(null); 
                });
            }  
        });
    };
    

    var getPlayers = function(callback) {
        players.find({}, function (err, result) {
            if (err) throw err; 
            
            if (!result) {
               var error = 'Players is not found';
               callback(error) 
            }
            
            callback(null, result)
        })
        
    };
    
    
    var fillNotifications = function(data, callback) {

        worker.create();

        var names = {};
        
        var length = data.length;
        
        for (var i=0; i<length; i++) {
            var name = data[i].first_name;
            if (typeof names[name] === 'undefined') {
                names[name] = [];
            }
            names[name].push(data[i].vk_id);
        }

        for (var key in names) {
            var idsCount = names[key].length;

            if (idsCount > 100) {
                var namesChunk = chunk(names[key], 100);
                for (var num in namesChunk) {
                    var namesList = namesChunk[num].join(',');
                    worker.add(namesList, key);
                }
            }
            else {
                var namesList = names[key].join(',');
                worker.add(namesList, key);
            }
        }

        worker.start();
        
        callback(null);
        
    }
    
            
    exports.Create = function (req, res) {
        res.render('create');
    };      
    
    
    exports.Send = function (req, res) {
        
        if (typeof req.body.template === 'undefined') {
            
           return res.render('send', {'message': "Template not found"});
           
        }
        
        worker.template = req.body.template;

        async.waterfall([
                setStart,
                getPlayers,
                fillNotifications 
            ], function (err) {
                    var message = "Start the notification server"
                    if (err) message = err;
                    res.render('send', {'message': message});       
        });
            

    };