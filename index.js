const PORT = 3001

const express = require('express')
const app = express()
app.use(express.json())

const buildInfoMessage = () => {
  let message = `Phonebook has ${persons.length} entries.`
  message += '<br/>'
  message += new Date()
  return message
}

let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456'
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-54321'
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '33-12-1234'
  },
  {
    id: 4,
    name: 'Mary Poppendick',
    number: '02-02-02'
  }
]

// Fetch
app.get('/api/persons', (req, res) => {
  res.json(persons)
})

// Info
app.get('/info', (req, res) =>  {
  const infoMessage = buildInfoMessage()
  res.send(infoMessage)
})

app.listen(PORT, () => {
  console.log(`Express server listening on ${PORT}.`);
})
