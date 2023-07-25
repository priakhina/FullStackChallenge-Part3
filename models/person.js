const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to', url)

/* eslint-disable no-unused-vars */
mongoose
  .connect(url)
  .then((result) => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })
/* eslint-disable no-unused-vars */

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: [3, 'Name has to be at least 3 characters long.'],
    required: [true, 'Name is required.'],
  },
  phoneNumber: {
    type: String,
    minLength: [
      9,
      'Phone number has to have at least 8 digits and consist of two parts separated by a hyphen (e.g., 12-345678).',
    ], // setting minLength to 9 to account for the hyphen character ('-')
    validate: {
      validator: (value) => {
        const pattern_1 = /^\d{2}-\d{6,}$/
        const pattern_2 = /^\d{3}-\d{5,}$/
        return pattern_1.test(value) || pattern_2.test(value)
      },
      message: (props) =>
        `${props.value} is not a valid phone number! Phone number must have one of the following formats: xx-xxxxxx or xxx-xxxxx.`,
    },
    required: [true, 'Phone number is required.'],
  },
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('Person', personSchema)
