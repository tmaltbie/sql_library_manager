const express = require('express');
const router = express.Router();
const Book = require('../models').Book;

const { Sequelize } = require('../models');
const { sequelize } = require('../models'); // ??
const Op = Sequelize.Op;

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
// middleware for async abstraction: https://teamtreehouse.com/library/create-entries

// pagination idea from https://www.youtube.com/watch?v=ZX3qt0UWifc
// router.get('/', asyncHandler(async (req, res, next) => {
//     let allBooks = await Book.findAll() // for total book #
//     let books = await Book.findAll()

//     const page = parseInt(req.query.page)
//     const limit = parseInt(req.query.limit)

//     const startIndex = (page - 1) * limit
//     const endIndex = page * limit

//     const results = {}
    
//     if (endIndex < books.length) {
//         results.next = {
//             page: page + 1,
//             limit: limit
//         }
//     }

//     if (startIndex > 0) {
//         results.prev = {
//             page: page - 1,
//             limit: limit
//         }
//     }

//     // results.results = books.slice(startIndex, endIndex)
//     results.results = await Book.findAll({limit: limit, skip: startIndex})

//     // res.json(results)
//     res.render("books/index", { books: books, allBooks, title: "Books"});
// }));

/* GET all books & paginate */
router.get('/', asyncHandler(async (req, res, next) => {
    let offset = 0
    let limit = 12
    //let page = {offset: 24}
    let books = await Book.findAll({
        offset: offset,
        limit: limit,
    })
    let allBooks = await Book.findAll()
    // res.json(results)
    display = (i, limit, offset) => {
        return offset = i * limit
    }

    res.render("books/index", { books, allBooks, offset, limit, display, title: "Books" });
}));

/* Search for books */
router.post('/search', asyncHandler(async (req, res) => {
    // let where = {[Op.or]: {}};
    let books;
    let {term} = req.body;
    // term = term.toLowerCase();
    if(term) {
        books = await Book.findAll({ 
            where: { 
                [Op.or]:
                    [
                        {title: { [Op.like]: `%${term}%` }},
                        {author: { [Op.like]: `%${term}%` }},
                        {genre: { [Op.like]: `%${term}%` }},
                        {year: { [Op.like]: `%${term}%` }},
                    ]
            }
        }) //.then(books => res.json(books)) // see the results in JSON format 
    } else {
        books = await Book.findAll()
        res.render("books/index", { books, title: "Books" });
    }
    res.render('books/index', { books, title: "Books", search: true })
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
        if (error.name === 'SequelizeValidationError') { // checking the error
            book = await Book.build(req.body);
            res.render('books/new', { book, errors: error.errors, title: "New Book" })
        } else {
            throw error; // error caught in the asyncHandler's catch block 
        }
    }
}));

/* Update book */
router.get('/:id', asyncHandler(async (req, res, next) => {
    const book = await Book.findByPk(req.params.id)
    if (book) {
        res.render("books/update", { book, title: "Update Book" })
    } else {
        const error = new Error("Uh-oh! The book doesn't exist")
        error.status = 404
        next(error)
    }
}));

/* POST updated book to database */
router.post('/:id', asyncHandler(async (req, res) => {
    let book;
    try {
        book = await Book.findByPk(req.params.id);
        if (book) {
            await book.update(req.body);
            res.redirect('/');
        } else {
            res.sendStatus(404)
        }
    } catch (error) {
        if(error.name === 'SequelizeValidationError') {
            book = await Book.build(req.body);
            res.render('books/update', { book, errors: error.errors, title: 'Update Book' })
        } else {
            console.error(error)
            throw error
        }
    }
}));

/* POST Delete a book, /books/:id/delete */
router.post('/:id/delete', asyncHandler(async (req, res) => {
  let book;
  book = await Book.findByPk(req.params.id);
  if (book) {
        await book.destroy();
        res.redirect("/");
  } else {
        res.sendStatus(404)
  }
}))

///////////////////////////
///////////////////////////
///////////////////////////
// // TEST PAGINATION // //
///////////////////////////
///////////////////////////
///////////////////////////
//  const page = parseInt(req.query.page)
//     const limit = parseInt(req.query.limit)

//     const startIndex = (page - 1) * limit
//     const endIndex = page * limit

//     const results = {}
    
//     if (endIndex < books.length) {
//         results.next = {
//             page: page + 1,
//             limit: limit
//         }
//     }

//     if (startIndex > 0) {
//         results.prev = {
//             page: page - 1,
//             limit: limit
//         }
//     }
   
//     results.results = await Book.findAll({limit: limit, skip: startIndex})

// function paginatedResults(model) {
//     return async (req, res, next) => {
//         let model = await Book.findAll()
//         const page = parseInt(req.query.page)
//         const limit = parseInt(req.query.limit)

//         const startIndex = (page - 1) * limit
//         const endIndex = page * limit

//         const results = {}
        
//         if (endIndex < model.length) {
//             results.next = {
//                 page: page + 1,
//                 limit: limit
//             }
//         }

//         if (startIndex > 0) {
//             results.prev = {
//                 page: page - 1,
//                 limit: limit
//             }
//         }
//         try {
//             results.results = await model.findAll({limit: limit, skip: startIndex})
//             next()
//         } catch (error) {
//             res.status(500).render('/books', { error })
//         }

//         res.paginatedResults = results
//         next()
//     }
// }

module.exports = router;

/* GET sorts book by ascending title  */
// router.get('/title/asc', asyncHandler(async (req, res) => {
//   let books = await Book.findAll({
//     order: [['title', 'ASC']]
//   })
//   res.render("books/index", { books })
// }))