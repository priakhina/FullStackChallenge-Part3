# FullStackChallenge-Part3

This repository is used for submitting exercises for [Part 3](https://fullstackopen.com/en/part3) (Programming a server with NodeJS and Express) of the [Full Stack Open course](https://fullstackopen.com/en). This part focuses on developing a backend for the Phonebook application covered in [Part 2](https://fullstackopen.com/en/part2) of the course. The backend is implemented on top of Node.js with the help of the Express library, and the application's data is stored in a MongoDB database. 

> [!NOTE]  
> This repository contains only a production build of the app's frontend. The full source code of the frontend can be found [here](https://github.com/priakhina/FullStackOpenChallenge/tree/main/part_3/phonebook).

## Project demo

An online version of the Phonebook app can be accessed via [https://full-stack-challenge-phonebook.onrender.com](https://full-stack-challenge-phonebook.onrender.com).

## Functionality

The app provides users with the following functionality:

- Adding new contacts to the phonebook (each entry consists of a name and a phone number)
  - if a number is added to an already existing contact, the new number will replace the old number
- Deleting existing contacts from the phonebook
- Filtering the list of contacts by name

### Input validation

To ensure correctness of the input data, there have been defined specific validation rules for the input fields:

1. A name must be at least three characters long. 
2. A phone number must:
    - have a length of 8 or more
    - be formed of two parts that are separated by -, the first part has two or three numbers and the second part also consists of numbers
        - eg. 09-1234556 and 040-22334455 are valid phone numbers
        - eg. 1234556, 1-22334455 and 10-22-334455 are invalid

When a validation error occurs, the app notifies the user by displaying a corresponding message.
