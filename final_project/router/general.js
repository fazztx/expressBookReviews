const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const axios = require('axios');
const fs = require('fs');

public_users.post("/register", (req, res) => {
  //Write your code here

  let givenU = req.body.username;
  let givenP = req.body.password;

  if (givenU && givenP) {
    if (users.filter((user) => user.username === givenU).length == 0) {
      users.push({
        'username': givenU,
        'password': givenP
      });
      return res.status(201).json({ message: "User registered" });
    } else {
      return res.status(400).json({ message: "Already exists" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
// public_users.get('/', function (req, res) {
//   //Write your code here
//   try {
//     let dataToSend = JSON.stringify(books);
//     res.status(200).send(dataToSend);
//   } catch (error) {
//     res.status(400).send('Data never fetched');
//   }
// });

//Axios implementation
public_users.get('/', async function (req, res) {
  try {
    let data = JSON.stringify(books);
    res.status(200).send(data);
  } catch (error) {
    res.status(400).send('Data never fetched');
  }
});


// Get book details based on ISBN
// public_users.get('/isbn/:isbn', function (req, res) {
//   //Write your code here
//   let givenISBN = req.params.isbn;

//   if (!isNaN(givenISBN)) {
//     return res.status(200).send(books[givenISBN]);
//   }

//   return res.status(400).json({ message: "Not a number" });
// });

//Axios implementation
public_users.get('/isbn/:isbn', async function (req, res) {
  try {
    let givenISBN = req.params.isbn;

    if (!isNaN(givenISBN)) {

      let data = books;
      return res.status(200).send(data[givenISBN]);
    }
  
    return res.status(400).json({ message: "Not a number" });
  } catch (error) {
    return res.status(400).send('Data never fetched');
  }
});

// Get book details based on author
// public_users.get('/author/:author', function (req, res) {
//   //Write your code here

//   let b = [];

//   let k = Object.keys(books);
//   for (let index = 0; index < k.length; index++) {
//     let book = books[Number(k[index])];
//     if (book.author === req.params.author) {
//       b.push(book);
//     }
//   }
//   return res.status(200).send(b);
// });

//Axios implementation
public_users.get('/author/:author', async function (req, res) {

  try {
    let data = books;

    let b = [];

    let k = Object.keys(data);
    for (let index = 0; index < k.length; index++) {
      let book = data[Number(k[index])];
      if (book.author === req.params.author) {
        b.push(book);
      }
    }
    return res.status(200).send(b);

  } catch (error) {
    return res.status(400).send('Data never fetched');
  }

});

// Get all books based on title
// public_users.get('/title/:title', function (req, res) {
//   //Write your code here

//   let k = Object.keys(books);

//   for (let index = 0; index < k.length; index++) {
//     let book = books[Number(k[index])];
//     if (book.title === req.params.title) {
//       return res.status(200).send(book);
//     }
//   }
//   return res.status(400).json({ message: "Not Found" });
// });

//Axios implementation
public_users.get('/title/:title', async function (req, res) {
  try {
    let data = books;

    let k = Object.keys(data);

    for (let index = 0; index < k.length; index++) {
      let book = data[Number(k[index])];
      if (book.title === req.params.title) {
        return res.status(200).send(book);
      }
    }

  } catch (error) {
    return res.status(400).send('Data never fetched');
  }
});


//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  //Write your code here

  let givenISBN = req.params.isbn;

  if (!isNaN(givenISBN) && typeof books[req.params.isbn].reviews != 'undefined') {
    return res.status(200).send(books[req.params.isbn].reviews);
  }

  return res.status(400).json({ message: "ISBN not valid" });

});

module.exports.general = public_users;
