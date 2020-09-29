'use strict';

const faker = require('faker');

// const genre_list = [
//     'Fiction', 'Non Fiction',
//     'Drama', 'Poetry', 'Science Fiction',
//     'Graphic Novels', 'Manga',
//     'Mystery', 'Fantasy', 'Philosophy'
// ]

// year_list = [
//     1989, 
//     1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999,
//     2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 
//     2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 
//     2020 
// ]

const books = [...Array(33)].map((book) => (
    {
        title: faker.lorem.words(),
        author: faker.name.findName(),
        createdAt: new Date(),
        updatedAt: new Date()
    }
))

module.exports = {
    up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('Books', books, {});
    },
    down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('Books', null, {});
    }
  };