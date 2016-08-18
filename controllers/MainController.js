    
    var models      = require('../models');
    var Players     = require('../models/players');
    var vk          = require('../vkontakte-api');
    var kue         = require('kue');
    var chunk       = require('chunk');
    var jobs        = kue.createQueue();
 
    
    exports.Send = function (req, res) {

        var names = {};

        Players.find({}, function (err, data) {

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
                        addJobs(namesList, key);
                    }
                }
                else {
                    var namesList = names[key].join(',');
                    addJobs(namesList, key);
                }
            }
            
            res.end();
            

        });

    };
    

    var addJobs = function(ids, name) {
        jobs.create('email', {
                ids: ids,
                text: name
            }).save();
        console.log(name + ' ' + ids );
    };
    
    
    jobs.process('email', function (job, done) {
        console.log('email');
        setTimeout(function(){
            vk.sendNotification(job.data.ids, job.data.text, done);
        }, 10000);
    });