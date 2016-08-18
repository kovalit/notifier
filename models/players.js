
    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;

    var playersSchema = new Schema({
      vk_id: { type: Number, unique: true },
      first_name: String,
      created_at: Date,
      updated_at: Date
    });


    var players = mongoose.model('players', playersSchema);

    module.exports = players;