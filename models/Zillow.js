const
  mongoose = require('mongoose'),
  zillowSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    street: String,
    city: String,
    state: String,
    beds: Number,
    baths: Number,
    zestimate: Number,
    sqft: Number,
    useCode: String
  })

  const Zillow = mongoose.model('Zillow', zillowSchema)
  module.exports = Zillow
