require('dotenv').config()

const PORT = process.env.PORT || 3001

const express = require('express')
const PhoneNumber = require('./models/phonenumbers')
const morgan = require('morgan')
const cors = require('cors')

const app = express()
app.use(express.static('build'))
app.use(express.json())
app.use(cors())

// Morgan
morgan.token('post-data', (req) => {
  return req.body ? JSON.stringify(req.body) : ''
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post-data'))

const nameInPhonebook = name => {
  PhoneNumber.find({ name }).then(result => {
    if (result) {
      return true
    } else return false
  })
}

// Fetch
app.get('/api/persons', (req, res) => {
  PhoneNumber.find({}).then(results => {
    res.json(results)
  })
})

// Retrieve
app.get('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  PhoneNumber.findById(id)
    .then(entry => {
      if (entry) {
        res.json(entry)
      } else {
        res.status(404).end()
      }
    })
    .catch(e => next(e))
})

// Create
app.post('/api/persons', (req, res, next) => {
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
  entry.save()
    .then(saved => {
      res.json(saved)
    })
    .catch(e => next(e))
})

// Remove
app.delete('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  console.log(id)
  PhoneNumber.findByIdAndDelete(id)
    .then(() => {
      res.status(204).end()
    })
    .catch(e => next(e))
})

app.put('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  const body = req.body

  const entry = {
    name: body.name,
    number: body.number,
  }

  PhoneNumber.findByIdAndUpdate(id, entry, { new: true })
    .then(updatedEntry => {
      res.json(updatedEntry)
    })
    .catch(error => next(error))
})

// Info
app.get('/info', (req, res) => {
  PhoneNumber.countDocuments({})
    .then(result => {
      let message = `Phonebook has ${result} entries.`
      message += '<br/>'
      message += new Date()
      res.send(message)
    })
})

// Exception middleware
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message })
  }

  next(error)
}
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Express server listening on ${PORT}.`)
})
