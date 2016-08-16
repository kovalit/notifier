
    var kue         = require('kue');
    var express     = require('express');
    var ui          = require('kue-ui');
    var cors        = require('cors');

    var vk          = require('./vkontakte-api');

    // create our job queue

    var jobs = kue.createQueue();
    var user = 1;

    kue.Job.rangeByState('complete', 0, 1000, 1, function(err, jobs) {
      jobs.forEach(function(job) {
        job.remove();  
      });
    });

    var names = ["Ivan", "Aleksey", "Sergey", "Vasya", "Andrey"];

    for (var key in names) {
        jobs.create('email', {user: names[key]}).save();
    }

    jobs.process('email', function (job, done) {
        console.log('email');
        setTimeout(function(){
            vk.sendNotification(job.data.user, done);
        }, 10000);
    });

    // start the UI
    ui.setup({
        apiURL: '/api',
        baseURL: '/test',
        updateInterval: 1000
    });

    var app = express();
    app.use(cors());
    app.use('/api', kue.app);
    app.use('/test', ui.app);

    app.listen(3000);
    console.log('UI started on port 3000');