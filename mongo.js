const mongoose = require("mongoose");

if (process.argv.length < 3) {
    console.log("Provide password as an argument");
    process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://phonebook:${password}@cluster0.w19ghn8.mongodb.net/phonebookApp?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
    name: String,
    phoneNumber: String,
});

const Person = mongoose.model("Person", personSchema);

if (process.argv.length > 3) {
    const name = process.argv[3];
    const phoneNumber = process.argv[4];

    const person = new Person({
        name: name,
        phoneNumber: phoneNumber,
    });

    person.save().then((result) => {
        console.log(
            `Added ${result.name}\'s number (${result.phoneNumber}) to phonebook!`
        );
        mongoose.connection.close();
    });
} else {
    Person.find({}).then((result) => {
        console.log("Phonebook:");
        result.forEach((person) => {
            console.log(person.name, person.phoneNumber);
        });
        mongoose.connection.close();
    });
}
