
    var kue         = require('kue');
    var express     = require('express');
    var ui          = require('kue-ui');
    var cors        = require('cors');
    var config      = require('config');

    var vk          = require('./vkontakte-api');
    
    var mongoose    = require('mongoose');
    mongoose.connect('mongodb://localhost:27017/notifier');
    var Players = require('./models/players');
    
    var chunk = require('chunk');


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
            // console.log(namesChunk);
            for (var num in namesChunk) {
                   //console.log(namesChunk[num]);
                var namesList = namesChunk[num].join(',');
                addJobs(namesList, key);
            }
        }
        else {
            var namesList = names[key].join(',');
            addJobs(namesList, key);
        }
        

    }

});


var addJobs = function(ids, name) {
    console.log(name+ ' ' + ids );
}

    // create our job queue
  















    //var jobs = kue.createQueue();
    var user = 1;

//    kue.Job.rangeByState('complete', 0, 1000, 1, function(err, jobs) {
//      jobs.forEach(function(job) {
//        job.remove();  
//      });
//    });

//    var names = ["Ivan", "Aleksey", "Sergey", "Vasya", "Andrey"];
//
//    for (var key in names) {
//        jobs.create('email', {user: names[key]}).save();
//    }
//
//    jobs.process('email', function (job, done) {
//        console.log('email');
//        setTimeout(function(){
//            vk.sendNotification(job.data.user, done);
//        }, 10000);
//    });

//    // start the UI
//    ui.setup({
//        apiURL: '/api',
//        baseURL: '/test',
//        updateInterval: 1000
//    });
//
    var app = express();
//    app.use(cors());
//    app.use('/api', kue.app);
//    app.use('/test', ui.app);

    app.listen(config.get('port'));