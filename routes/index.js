
    var MainController      = require('../controllers/MainController');

    module.exports = function(app){
        
        app.get('/send', MainController.Set);
        app.post('/send', MainController.Send);
        
    };