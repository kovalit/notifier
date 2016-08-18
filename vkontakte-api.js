
    var nodemailer  = require('nodemailer');
    var config      = require('config');
    var log4js      = require('log4js'); 

    log4js.configure({
        appenders: [
          { 
            "type": "file",
            "filename": "logs/vk.log",
            "category": "vk"
          }
        ]
      });
      
    var transporter = nodemailer.createTransport(
            config.get('smtp')
        );
      
    var log = log4js.getLogger("vk");

    var vk = {
        
        mailOptions: {
            from: 'kovallit@gmail.com', 
            to: 'kovalit@mail.ru', 
            subject: 'Notifier Mailing', 
        },
        
        sendNotification: function(ids, text, done) {
            
            this.mailOptions.html = ids + '<br/ >' + text;
            
            transporter.sendMail(this.mailOptions, function(error, info){
                if(error){  
                    return log.error('Notification not send ' + ids);
                }
                var idsArr = ids.split(",");
                var length = idsArr.length;
                for (var i = 0; i < length; i++) {
                    log.info('Notification, vk_id: ', idsArr[i]);
                }
                done();
            });
        } 
        
    };
    
    module.exports = vk;
    

