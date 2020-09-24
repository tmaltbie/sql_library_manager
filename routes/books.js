const express = require('express');
const router = express.Router();
const {Book} = require('../models');

/* Handler function wrap each route. */
// middleware async abstraction code: https://teamtreehouse.com/library/create-entries
function asyncHandler(cb){
  return async(req, res, next) => {
    try {
      await cb(req, res, next)
    } catch(error){
      console.error(error)
      res.status(500).send(error)
    }
  }
}

/* GET books listing. */
router.get('/', asyncHandler(async (req, res) => {
  let books = await Book.findAll()
  res.render("books/index", { books, title: "The StarField Library" });
}));

/* GET sorts book by ascending title  */
// router.get('/title/asc', asyncHandler(async (req, res) => {
//   let books = await Book.findAll({
//     order: [['title', 'ASC']]
//   })
//   res.render("books/index", { books, title: "The StarField Library" })
// }))

/* GET shows the create new book form */ 
router.get('/new', (req, res) => {
  res.render("books/new", { book: {}, title: "New Book"} )
})

/* POST posts a new book to the database */
router.post('/', asyncHandler(async (req, res) => {
  const book = await Book.create(req.body) 
//   console.log("req.body: ", req.body)
  res.redirect("/");
}));

/* GET shows book detail form */
router.get('/:id', asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id)
  if(book) {
    res.render("books/detail", { book, title: "Update Book" })
  } else {
    res.sendStatus(404)
  }
}));

/* POST Update book info in the database */
router.post('/books/:id', asyncHandler(async(req, res) => {
  let book = await Book.findByPk(req.params.id);
  console.log(book)
  if(book) {
    console.log(book)
    await book.update(req.body);
    console.log(req.body)
  }
  res.redirect("/books/" + book.id)
}));

/* POST Delete a book, /books/:id/delete */
// router.post('/:id', asyncHandler(async (req, res) => {
//   const book = await Book.findByPk(req.params.id);
//   await book.destroy();
//   res.redirect("/books" + book.id);
// }))

module.exports = router;