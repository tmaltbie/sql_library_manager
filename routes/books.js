var express = require('express');
var router = express.Router();
const Book = require('../models').Book;

/* Handler function wrap each route. */
// middleware async abstraction code: https://teamtreehouse.com/library/create-entries
function asyncHandler(cb){
  return async(req, res, nest) => {
    try {
      await cb(req, res, next)
    } catch(error){
      res.status(500).send(error)
    }
  }
}

/* GET books listing. */
router.get('/', function(req, res, next) {
  res.render('index', { title: "Starfield Library" });
});

/* GET Create a new book form, /books/new */ 
router.get('/new', (req, res) => {
  res.render("books/new", { book: {}, title: "New Book"} )
})

/* POST Add new book to the database, /books/new */

/* GET Show book detail form, /books/:id */

/* POST Updates book info in the database */

/* POST Delete a book, /books/:id/delete */

module.exports = router;