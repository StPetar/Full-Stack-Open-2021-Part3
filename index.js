require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
const app = express()

app.use(express.static('build'))
app.use(cors())
app.use(express.json())
app.use(morgan((tokens, request, response) => {
	return [
		tokens.method(request, response),
		tokens.url(request, response),
		tokens.status(request, response),
		tokens.res(request, response, 'content-length'),
		'-',
		tokens['response-time'](request, response),
		'ms',
		JSON.stringify(request.body),
	].join(' ')
}))

app.get('/api/persons', (request, response) => {
	Person.find({}).then(persons => {
		response.json(persons)
	  })
})

app.get('/api/persons/:id', (request, response, next) => {
	Person.findById(request.params.id).then((person) =>{
		person ? response.json(person) : response.status(404).end()
	})
	.catch(error => next(error))
})

app.get('/info', (request, response) =>{
	Person.find({}).then(person =>{
		response.send(
			`<p>Phonebook has info for ${person.length} people</p>
			 <p>${new Date()}</p>`
		)
	})
})

app.post('/api/persons', (request, response, next) => {
	const body = request.body

	const newPerson = new Person({
		name: body.name,
		number: body.number
	})

	newPerson.save().then(savedPerson => {
		response.json(savedPerson)
	})
})

app.delete('/api/persons/:id', (request, response, next) => {
	Person.findByIdAndRemove(request.params.id).then( () => {
		response.status(204).end()
	}).catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
	const body = request.body
	const person = {
		name: body.name,
		number: body.number
	}

	Person.findByIdAndUpdate(request.params.id, person).then(updatedPerson => {
		response.json(updatedPerson)
	})
	.catch(error => next(error))
})
const errorHandler = (error, request, response, next) => {
	console.log(error.message)

	if (error.name === 'CastError') {
		return response.status(400).send({ error: 'malformatted id' })
	} else if (error.name === 'ValidationError') {
		return response.status(400).json({ error: error.message })
	}
	next(error);
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
})
