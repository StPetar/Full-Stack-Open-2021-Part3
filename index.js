const express = require('express')
const morgan = require('morgan');

const app = express()

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
    ].join(' ');
}))

let persons = [
		{
			"name": "Arto Hellas",
			"number": "040-123456",
			"id": 1
		},
		{
			"name": "Ada Lovelace",
			"number": "39-44-5323523",
			"id": 2
		},
		{
			"name": "Peter",
			"number": "1234",
			"id": 3
		}
	]

app.get('/api/persons', (request, response) => {
    response.json(persons)
})
app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if(person){
        response.json(person)
    }else{
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})

app.get('/info', (request, response) =>{
    response.send(
        `<p>Phonebook has info for ${Math.max(...persons.map(person => person.id))} people</p>
        <p>${new Date()}</p>`
    )
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    if(!body.name || !body.number){
        return response.status(400).json({
            error: 'Name or number is missing'
        })
    }
    
    const person = persons.find(person => person.name === body.name)
    if(person){
        return response.status(400).json({
            error: 'Name must be unique'
        })
    }
    
    const newPerson = {
        name: body.name,
        number: body.number,
        id: generateID()
    }
    persons = persons.concat(newPerson)
    response.json(newPerson)
})
const generateID = () => {
    const maxId = persons.length > 0
      ? Math.max(...persons.map(n => n.id))
      : 0
    return maxId + 1
}

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})
