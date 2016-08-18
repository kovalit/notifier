    var kue             = require('kue');
    var vk              = require('./vkontakte-api');
    var models          = require('./models');
    var notifications   = require('./models/notifications');
    
    var worker = {

        template: null,
        
        jobs: null,

        renderTemplate: function(name) {

           return this.template.replace("%name%", name);

        },


        create: function() { 
            
            this.jobs = kue.createQueue();

            this.jobs.on('job complete', function(id, result){
               this.jobs.inactiveCount(function(err,count){
                        if(!err && count === 0) {
                            this.setFinish();
                        }
                    }.bind(this));
                }.bind(this));
  
        },
       


        add: function(ids, name) {

            var text = this.renderTemplate(name);

            this.jobs.create('email', {
                    ids: ids,
                    text: text
                }).save();
        },


        start: function() {
            
            this.jobs.process('email', function (job, done) {
                setTimeout(function(){
                    vk.sendNotification(job.data.ids, job.data.text, done);
                }, 5000);
            });
        },
        
        
        setFinish: function() {
            notifications.findOne({ "name": 'vk' }, function (err, result) {
                if (err) throw err;

                if (!result) {
                   console.error('Notifications is not found');
                   return;
                }

                result.isFinish = true;
                result.save(function (err, data) {
                    if (err) throw err;
                });

            });
        }
        

    };
        
        
    module.exports = worker;