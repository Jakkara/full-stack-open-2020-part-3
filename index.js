require('dotenv').config()

const PORT = process.env.PORT || 3001
const MAX_ID = 5000

const express = require('express')
const PhoneNumber = require('./models/phonenumbers')
const morgan = require('morgan')
const cors = require('cors')
const { response } = require('express')
const app = express()
app.use(express.json())
app.use(express.static('build'))
app.use(cors())

morgan.token('post-data', (req, res) => {
  return req.body ? JSON.stringify(req.body) : ''
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post-data'))

const buildInfoMessage = () => {
  let message = `Phonebook has ${persons.length} entries.`
  message += '<br/>'
  message += new Date()
  return message
}

const generateId = () => {
  return Math.floor(Math.random()*MAX_ID)
}

const nameInPhonebook = name => {
  const person = persons.find(person => person.name === name)
  return !!person
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
  PhoneNumber.find({}).then(results => {
    res.json(results)
  })
})

// Retrieve
app.get('/api/persons/:id', (req, res) => {
  const id = parseInt(req.params.id)
  PhoneNumber.findById(id).then(entry => {
    res.json(entry)
  })
})

// Create
app.post('/api/persons', (req, res) => {
  const body = req.body
  if (!body.number) {
    return res.status(400).json({
      error: 'Missing number'
    })
  }
  if (!body.name) {
    return res.status(400).json({
      error: 'Missing name'
    })
  }

  if (nameInPhonebook(body.name)) {
    return res.status(400).json({
      error: 'Person already exists in phonebook'
    })
  }

  const entry = new PhoneNumber({
    name: body.name,
    number: body.number
  })
  entry.save().then(saved => {
    res.json(saved)
  })
})

// Remove
app.delete('/api/persons/:id', (req, res) => {
  const id = parseInt(req.params.id)
  persons = persons.filter(person => person.id !== id)
  res.status(204).end()
})

// Info
app.get('/info', (req, res) =>  {
  const infoMessage = buildInfoMessage()
  res.send(infoMessage)
})

app.listen(PORT, () => {
  console.log(`Express server listening on ${PORT}.`);
})
