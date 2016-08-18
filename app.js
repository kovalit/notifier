
    var express         = require('express');
    var bodyParser      = require('body-parser');
    var models          = require('./models');
    var notifications   = require('./models/notifications');
   // var players         = require('./models/players');
    
    
    var worker          = require('./worker');
  //  var ui          = require('kue-ui');
  //  var cors        = require('cors');
    var config          = require('config');
    
    var routes      = require('./routes');
    var app         = express();
    

    
//    for (var i=0;i<1000;i++) {
//        var num = i % 6;
//        players.create({ vk_id: i, first_name: "player" + num }, function(error, doc) {
//            if (error) throw error;
//        });
//    }

    // Restore notificarion
    notifications.findOne({ "name": 'vk' }, function (err, result) {
        if (err) throw err;
        if (result) {
            if (result.isStart && !result.isFinish) {
                worker.create();
                worker.start();
            }
        }
    });

   

//    kue.Job.rangeByState('complete', 0, 1000, 1, function(err, jobs) {
//      jobs.forEach(function(job) {
//        job.remove();  
//      });
//    });




//    // start the UI
//    ui.setup({
//        apiURL: '/api',
//        baseURL: '/test',
//        updateInterval: 1000
//    });
//
    
//    app.use(cors());
//    app.use('/api', kue.app);
//    app.use('/test', ui.app);

    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(bodyParser.json());

    app.set('view engine', 'twig');
    app.set("twig options", {
        strict_variables: false,
    });
    
    
    
    routes(app);

    app.listen(config.get('port'));
    
    module.exports = app;