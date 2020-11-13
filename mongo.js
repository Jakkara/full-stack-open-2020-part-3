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
const url = `mongodb+srv://fso2020-jali:${password}@cluster0.wkmcw.mongodb.net/note-app?retryWrites=true&w=majority`
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const printEntries = condition => {
  console.log("Phonebook:");
  PhoneNumber.find(condition).then(results => {
    results.forEach(result => {
      console.log(`${result.name}   ${result.number}`);
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
    break;
  case 4:
    console.log("Enter a name and a number")
    mongoose.connection.close()
    break;
  case 5:
    addEntry(process.argv[3], process.argv[4])
}


/* const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean
})

const Note = mongoose.model('Note', noteSchema)

const note = new Note({
  content: 'HTML is Easy',
  date: new Date(),
  important: true,
})

note.save().then(result => {
  console.log('note saved!')
  mongoose.connection.close()
})

Note.find({}).then(result => {
  result.forEach(note => {
    console.log(note)
  })
  mongoose.connection.close()
})
 */
