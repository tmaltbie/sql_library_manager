const express = require('express');
const router = express.Router();
const Book = require('../models').Book;

/* Handler function wrap each route. */
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
// middleware async abstraction: https://teamtreehouse.com/library/create-entries

/* GET all books */
router.get('/', asyncHandler(async (req, res, next) => {
    const books = await Book.findAll()
    res.render("books/index", { books, title: "Books" });
}));

/* Renders the create new book form */
router.get('/new', (req, res, next) => {
    res.render("books/new", { book: {}, title: "Add New Book" })
});

/*  POST new created book */
router.post('/new', asyncHandler(async (req, res, next) => {
    let book;
    try {
        book = await Book.create(req.body);
        res.redirect('/books');
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            book = await Book.build(req.body);
            res.render('books/new', { book, errors: error.errors, title: 'New Book' })
        } else {
            next(error)
            // throw error // ??
        }
    }
}));

/* ??? Update book ??? */
router.get('/:id', asyncHandler(async (req, res, next) => {
    const book = await Book.findByPk(req.params.id)
    if (book) {
        res.render("books/update", { book, title: "Update Book" })
    } else {
        const error = new Error('500 error')
        error.status = 500;
        next(error)
    }
}));

/* POST updated book => database */
router.post('/:id', asyncHandler(async (req, res) => {
    let book;
    try {
        book = await Book.findByPk(req.params.id);
        console.log("FOUND BOOK:", book)
        if(book){
            await book.update(req.body);
            res.redirect('/books');
        } else {
            res.sendStatus(404);
        }
    } catch (error) {
        console.error(error)
    }
}));

/* POST Delete a book, /books/:id/delete */
// router.post('/:id', asyncHandler(async (req, res) => {
//   const book = await Book.findByPk(req.params.id);
//   await book.destroy();
//   res.redirect("/books" + book.id);
// }))

module.exports = router;

/* GET sorts book by ascending title  */
// router.get('/title/asc', asyncHandler(async (req, res) => {
//   let books = await Book.findAll({
//     order: [['title', 'ASC']]
//   })
//   res.render("books/index", { books })
// }))