const mongoose = require('mongoose')

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

const phoneNumberSchema = new mongoose.Schema({
  name: String,
  number: String
}).set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('PhoneNumber', phoneNumberSchema)
