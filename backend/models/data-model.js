const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const rideSchema = new mongoose.Schema({
  ride_id: { type: String, required: true },
  start_date: { type: Date, required: true },
  moving_time: { type: Number, required: true },
  distance: { type: Number, required: true },
  average_speed: { type: Number, required: true },
  average_heartrate: { type: Number, required: true },
});

rideSchema.plugin(uniqueValidator);
module.exports = mongoose.model("Ride", rideSchema);