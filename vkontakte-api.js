
    var nodemailer  = require('nodemailer');

    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'kovallit@gmail.com',
          pass: 'oohibich'
        }
    });
    

  
    
    var vk = {
        
        mailOptions: {
            from: 'kovallit@gmail.com', 
            to: 'kovalit@mail.ru', 
            subject: 'Hello', 
            text: 'Hello world', 
            html: '<b>Hello world </b>' 
        },
        
        sendNotification: function(user, done) {
            
            this.mailOptions.subject = 'Hello ' + user;
            
            transporter.sendMail(this.mailOptions, function(error, info){
                if(error){
                    return console.log(error);
                }
                done();
            });
        }
        
        
    }
    
    module.exports = vk;
    

