const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
  //write code to check is the username is valid
  if (username) {
    if (users.filter((user) => user.username === username).length == 0) {
      return true;
    }
  }
  return false;

}

const authenticatedUser = (username, password) => { //returns boolean
  //write code to check if username and password match the one we have in records.
  if (username && password) {
    if (users.filter((user) => user.username === username && user.password === password).length > 0) {
      return true;
    }
  }
  return false;

}

//only registered users can login
regd_users.post("/login", (req, res) => {
  //Write your code here

  let givenU = req.body.username;
  let givenP = req.body.password;

  if (authenticatedUser(givenU, givenP)) {
    let accessToken = jwt.sign(
      { data: givenU },
      'access',
      { expiresIn: 60 * 60 }
    );

    req.session.authorization = {
      accessToken, username: givenU
    };

    return res.status(200).send("User successfully logged in");

  } else{

    return res.status(400).send("User not logged in");

  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here

  let givenISBN = req.params.isbn;

  let unFromS = req.session.authorization.username;

  let existingReview = books[givenISBN].reviews[unFromS];

  if(existingReview){
    books[givenISBN].reviews[unFromS] = req.query.review;
    return res.status(200).json({ message: "Replaced review" });
  } else{
    books[givenISBN].reviews[unFromS] = req.query.review;
    return res.status(200).json({ message: "Posted" });
  }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {

  //Hint: Filter & delete the reviews based on the session username, so that a user can delete only his/her reviews 
  //and not other users’.

  let givenISBN = req.params.isbn;

  let unFromS = req.session.authorization.username;

  let existingReview = books[givenISBN].reviews[unFromS];

  if(existingReview){
    delete books[givenISBN].reviews[unFromS];
    return res.status(204).json({ message: "Deleted" });
  } else{
    return res.status(200).json({ message: "Never existed" });
  }
  
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
