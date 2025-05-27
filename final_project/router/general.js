const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();



// Check if a user with the given username already exists
const doesExist = (username) => {
  // Filter the users array for any user with the same username
  let userswithsamename = users.filter((user) => {
      return user.username === username;
  });
  // Return true if any user with the same username is found, otherwise false
  if (userswithsamename.length > 0) {
      return true;
  } else {
      return false;
  }
}

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if both username and password are provided
  if (username && password) {
    // Check if the user does not already exist
    if (!doesExist(username)) {
      // Add the new user to the users array
      users.push({ username: username, password: password });
      return res
        .status(200)
        .json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  // Return error if username or password is missing
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
/*public_users.get("/", function (req, res) {
  // Send JSON response with formatted friends data
  res.send(JSON.stringify(users, null, 4));
});*/

//================  refact code ==========================
public_users.get("/", function (req, res) {
  new Promise((resolve, reject) => {
    if (books) {
      resolve(books);
    } else {
      reject("No books found");
    }
  })
  .then(data => res.json(data))
  .catch(err => res.status(500).json({ message: err }));
});


// Get book details based on ISBN
/*
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn]);
});
*/

//================  refact code ==========================
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;

  new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject("Book not found");
    }
  })
  .then(book => res.json(book))
  .catch(err => res.status(404).json({ message: err }));
});


/*
// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author.toLowerCase();
  const results = [];

  for (let key in books) {
    if (books[key].author.toLowerCase() === author) {
      results.push(books[key]);
    }
  }

  if (results.length > 0) {
    res.send(results);
  } else {
    res.status(404).json({ message: "Author not found" });
  }
});
*/
//================  refact code ==========================
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author.toLowerCase();

  new Promise((resolve, reject) => {
    const results = [];

    for (let key in books) {
      if (books[key].author.toLowerCase() === author) {
        results.push(books[key]);
      }
    }

    if (results.length > 0) {
      resolve(results);
    } else {
      reject("Author not found");
    }
  })
  .then(results => res.json(results))
  .catch(err => res.status(404).json({ message: err }));
});


/*
// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title.toLowerCase();
  const results = [];

  for (let key in books) {
    if (books[key].title.toLowerCase() === title) {
      results.push(books[key]);
    }
  }

  if (results.length > 0) {
    res.send(results);
  } else {
    res.status(404).json({ message: "Title not found" });
  }
});
*/
//================  refact code ==========================
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title.toLowerCase();

  new Promise((resolve, reject) => {
    const results = [];

    for (let key in books) {
      if (books[key].title.toLowerCase() === title) {
        results.push(books[key]);
      }
    }

    if (results.length > 0) {
      resolve(results);
    } else {
      reject("Title not found");
    }
  })
  .then(results => res.json(results))
  .catch(err => res.status(404).json({ message: err }));
});



//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  res.send(book.reviews);
});


module.exports.general = public_users;
