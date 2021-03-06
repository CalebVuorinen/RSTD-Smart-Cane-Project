const mongoose = require('mongoose'),
      Schema = mongoose.Schema,
      State = require('./state');

//console.log(State);
const HistorySchema = new Schema({
  productName  : { type : String, required: true, trim: true },
  itemCost     : { type : Number },
});

const LocationsSchema = new Schema({
  latitude    : { type : Number },
  longitude   : { type : Number },
  date        : { type : String },
  time        : { type : String },
  dateTime    : { type : Date },
});

const CustomerSchema = new Schema({
  firstName   : { type : String, required: true, trim: true },
  lastName    : { type : String, required: true, trim: true },
  email       : { type : String, required: true, trim: true },
  address     : { type : String, required: true, trim: true },
  city        : { type : String, required: true, trim: true },
  stateId     : { type : String, required: true },
  state       : State.schema ,
  zip         : { type : Number },
  gender      : { type : String },
  // orderCount  : { type : Number },
  // history      : [ historychema ],
  latitude    : { type : Number },
  longitude   : { type : Number },
  locations   : [ LocationsSchema ],
  macAddress  : { type : String }
});

CustomerSchema.static('findByMac', function (macAddress, callback) {
  return this.find({ macAddress: macAddress }, callback);
});

module.exports = mongoose.model('Customer', CustomerSchema, 'customers');
