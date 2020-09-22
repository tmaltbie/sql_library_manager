const express = require('express');
const router = express.Router();
const {Book} = require('../models');

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
router.get('/', asyncHandler(async (req, res) => {
  let books = await Book.findAll()
  console.log(req.body)
  res.render("books/index", { books, title: "The StarField Library" });
}));

/* GET Create a new book form, /books/new */ 
router.get('/new', (req, res) => {
  res.render("books/new", { book: {}, title: "New Book"} )
})

/* POST create book @ /books/new */
// router.post('/', asyncHandler(async (req, res) => {
//   // req body property returns an object containing the key value pairs 
//   const book = await Book.create(req.body) 
//   console.log(req.body)
//   res.redirect("/books/" + book.id);
// }))

/* GET show book detail form, /books/:id */
router.get('/:id', (req, res) => {
  // const book = await Book.findByPk(req.params.id)
  res.render("books/detail", {book: {}, title: "Update Book"})
});

/* POST Updates book info in the database */
// router.post('/', asyncHandler(async(req, res) => {

// }))

/* POST Delete a book, /books/:id/delete */

module.exports = router;