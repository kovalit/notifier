
    var MainController      = require('../controllers/MainController');

    module.exports = function(app){
        
        app.get('/send', MainController.Send);
        
    };