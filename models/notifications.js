
    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;

    var notificationsSchema = new Schema({
      name: String,
      isStart: Boolean,
      isFinish: Boolean,
      created_at: Date,
      updated_at: Date
    });


    var notifications = mongoose.model('notifications', notificationsSchema);

    module.exports = notifications;