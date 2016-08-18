    
    var models          = require('../models');
    var players         = require('../models/players');
    var notifications   = require('../models/notifications');
    var worker          = require('../worker');
    var chunk           = require('chunk');
    var async           = require('async');

    exports.Set = function (req, res) {
        res.render('set');
    };
 
    
    exports.Send = function (req, res) {
        
        if (typeof req.body.template === 'undefined') {
            
           return res.render('send', {'message': "Template not found"});
           
        }

        async.waterfall([

                function(callback){

                    notifications.findOne({ "name": 'vk' }, function (err, data) {
                        if (err) throw err;

                        if (data.isStart) {
                            var error = 'Worker is busy';
                            callback(error);
                        }
                        else {
                            data.isStart = true;
                            data.save(function (err, data) {
                                if (err) throw err;
                                callback(null); 
                            });

                        }

                    });

                },

                function(callback){

                    worker.create();

                    worker.template = req.body.template;

                    var names = {};

                    players.find({}, function (err, data) {

                        if (err) throw err;

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

                            if (idsCount > 2) {

                                var namesChunk = chunk(names[key]);
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

                        callback(null);
                    });
                },
                function(callback){

                    worker.start();

                    callback(null);
                },
            ], function (err) {
                    if (err) console.error(err);
            });
            

    };