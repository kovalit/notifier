
    var MainController      = require('../controllers/MainController');

    module.exports = function(app){
        
        app.get('/send', MainController.Create);
        app.post('/send', MainController.Send);
        
    };