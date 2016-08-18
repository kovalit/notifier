
    var nodemailer  = require('nodemailer');
    var config      = require('config');
    var log4js = require('log4js'); 

    log4js.configure({
        appenders: [
          { 
            "type": "file",
            "filename": "logs/vk.log",
            "category": "vk-api"
          }
        ]
      });
      
    var transporter = nodemailer.createTransport(
            config.get('smtp')
        );
      
    var log = log4js.getLogger("vk-api");

    var vk = {
        
        mailOptions: {
            from: 'kovallit@gmail.com', 
            to: 'kovalit@mail.ru', 
            subject: 'Hello', 
            text: 'Hello world', 
            html: '<b>Hello world </b>' 
        },
        
        sendNotification: function(ids, text, done) {
            
            this.mailOptions.subject = 'Hello ' + text;
            
            transporter.sendMail(this.mailOptions, function(error, info){
                if(error){  
                    return log.error('email not send ' + ids);
                }
                log.info('email send ' + ids);
                done();
            });
        } 
        
    };
    
    module.exports = vk;
    

