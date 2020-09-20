'use strict'
const Sequelize = require('sequelize');
const moment = require('moment');

module.exports = sequelize => {
  class Book extends Sequelize.Model {
    // define assocations here
  }
  Book.init({
    title: {
      type: Sequelize.STRING,
      validate: {
        notEmpty: {
          msg: '"Title" is required'
        }
      }
    },
    author: {
      type: Sequelize.STRING,
      validate: {
        notEmpty: {
          msg: '"Author" is required'
        }
      }
    }, 
    genre: Sequelize.STRING,
    year: Sequelize.INTEGER,
  }, { sequelize });
  return Book;
}