const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3];
const number = process.argv[4];

const url =
  `mongodb+srv://fsophonebook:${password}@fullstackopenphonebook.ivij0.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('person', personSchema)

if (process.argv.length === 3){
	Person.find({}).then((persons) => {
		console.log('phonebook:');
		persons.forEach(person =>{
			console.log(`${person.name} ${person.number}`);
		})
		mongoose.connection.close()
	})
} else {
	const person = new Person({name, number})
	person.save().then((persons) =>{
		console.log(`added ${person.name} number ${person.number} to Phonebook`);
		mongoose.connection.close()
	})
	
}