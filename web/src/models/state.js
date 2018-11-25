const mongoose = require('mongoose'),
      Schema = mongoose.Schema,
      ObjectId = Schema.ObjectId;

const StateSchema = new Schema({
  abbreviation : { type : String, required: true, trim: true },
  name         : { type :  String, required: true, trim: true }
});

module.exports = mongoose.model('State', StateSchema);
