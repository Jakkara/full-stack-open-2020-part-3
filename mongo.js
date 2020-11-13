const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}
const phoneNumberSchema = new mongoose.Schema({
  name: String,
  number: String
})
const PhoneNumber = mongoose.model('PhoneNumbers', phoneNumberSchema)

const password = process.argv[2]
const url = `mongodb+srv://fso2020-jali:${password}@cluster0.wkmcw.mongodb.net/phonebook?retryWrites=true&w=majority`
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const printEntries = condition => {
  console.log('Phonebook:')
  PhoneNumber.find(condition).then(results => {
    results.forEach(result => {
      console.log(`${result.name}   ${result.number}`)
    })
    mongoose.connection.close()
  })
}

const addEntry = (name, number) => {
  const entry = new PhoneNumber({ name, number })

  entry.save().then(result => {
    console.log(`Added ${result.name} number ${result.number} to phonebook.`)
    mongoose.connection.close()
  })
}

switch (process.argv.length) {
case 3:
  printEntries({})
  break
case 4:
  console.log('Enter a name and a number')
  mongoose.connection.close()
  break
case 5:
  addEntry(process.argv[3], process.argv[4])
}
