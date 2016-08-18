    var kue         = require('kue');
    var vk          = require('./vkontakte-api');
    
    var worker = {

        template: null,
        
        jobs: null,

        renderTemplate: function(name) {

           return this.template.replace("%name%", name);

        },


        create: function() { 
            
            this.jobs = kue.createQueue();
            
            this.jobs.on('job complete', function(id, result){
               this.jobs.activeCount(function( err, total ) {
                    console.log( total );
            });
            }.bind(this));
               
            
        },
       


        add: function(ids, name) {

            var text = this.renderTemplate(name);

            this.jobs.create('email', {
                    ids: ids,
                    text: text
                }).save();

                
            console.log(name + ' ' + ids );

        },


        start: function() {
            
            this.jobs.process('email', function (job, done) {
                console.log('email');
                setTimeout(function(){
                    vk.sendNotification(job.data.ids, job.data.text, done);
                }, 10000);
            });
        }
        

    };
        
        
    module.exports = worker;