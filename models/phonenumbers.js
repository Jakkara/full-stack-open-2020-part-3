const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator');

const url = process.env.MONGODB_URI
console.log('Connecting to DB...');
mongoose.connect(
  url,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  })
  .then(result => {
    console.log('Connected')
  })
  .catch(e => {
    console.log('Error while connecting to DB.', e.message)
  })

const phoneNumberSchema = new mongoose.Schema(
  {
    name: {type: String, unique: true},
    number: String
  })
  .set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })
  .plugin(uniqueValidator)

module.exports = mongoose.model('PhoneNumber', phoneNumberSchema)
