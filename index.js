require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const Person = require("./models/person");

const app = express();

// json-parser (https://expressjs.com/en/api.html) is a so-called middleware (http://expressjs.com/en/guide/using-middleware.html).
// It transforms the JSON data of a request into a JavaScript object;
// the parsed data is accessed via the body property of the request object (i.e., req.body).
app.use(express.json());

// morgan (https://github.com/expressjs/morgan) is an HTTP request logger middleware for node.js
morgan.token("data", (req, res) => JSON.stringify(req.body));

app.use(
    morgan(
        ":method :url :status :res[content-length] - :response-time ms :data"
    )
);

// cors (https://github.com/expressjs/cors) is a middleware that enables CORS (Cross-Origin Resource Sharing) mechanism
app.use(cors());

// static (http://expressjs.com/en/starter/static-files.html) is a built-in middleware from express that allows to show static content
app.use(express.static("build"));

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (error, req, res, next) => {
    console.error(error.message);

    if (error.name === "CastError") {
        return res.status(400).send({ error: "malformed id" });
    } else if (error.name === "ValidationError") {
        const errors = [];

        // collecting all error messages; source: https://stackoverflow.com/a/61056403
        Object.keys(error.errors).forEach((key) => {
            errors.push(error.errors[key].message);
        });

        return res.status(400).json({ error: errors.join(" ") });
    }

    next(error); // passes the error forward to the default Express error handler
};

app.get("/", (req, res) => {
    res.send("<h1>Welcome to the phonebook app!</h1>");
});

app.get("/api/persons", (req, res) => {
    Person.find({}).then((persons) => {
        res.json(persons);
    });
});

app.get("/api/persons/:id", (req, res, next) => {
    Person.findById(req.params.id)
        .then((person) => {
            if (person) {
                res.json(person);
            } else {
                res.statusMessage = `No person found with the specified id (${req.params.id})`;
                res.status(404).end();
            }
        })
        .catch((error) => next(error));
});

app.delete("/api/persons/:id", (req, res, next) => {
    Person.findByIdAndRemove(req.params.id)
        .then((result) => {
            res.status(204).end();
        })
        .catch((error) => next(error));
});

app.post("/api/persons", (req, res, next) => {
    const body = req.body;

    const person = new Person({
        name: body.name,
        phoneNumber: body.phoneNumber,
    });

    person
        .save()
        .then((savedPerson) => {
            res.json(savedPerson);
        })
        .catch((error) => next(error));
});

app.put("/api/persons/:id", (req, res, next) => {
    const { name, phoneNumber } = req.body;

    // The optional { new: true } parameter causes the event handler to be called with the new modified person instead of the original.
    // Update validators are off by default, need to specify the runValidators option.
    Person.findByIdAndUpdate(
        req.params.id,
        { name, phoneNumber },
        { new: true, runValidators: true, context: "query" }
    )
        .then((updatedPerson) => {
            res.json(updatedPerson);
        })
        .catch((error) => next(error));
});

app.get("/info", async (req, res, next) => {
    try {
        const count = await Person.estimatedDocumentCount();
        const message =
            `<p>Phonebook has info for ${count} people</p>` +
            `<p>${new Date()}</p>`;
        res.send(message);
    } catch (error) {
        next(error);
    }
});

// handler of requests with unknown endpoint (the unknown endpoint middleware)
app.use(unknownEndpoint);
// handler of requests with result to errors (the error-handling middleware);
// has to be the last loaded middleware
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
