'use strict'

const Sequelize = require('sequelize');
// const moment = require('moment');

module.exports = sequelize => {
    class Book extends Sequelize.Model {
    // define associations here
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
        year: {
            type: Sequelize.INTEGER,
            allowNull: true,
            validate: {
                isInt: {
                    
                    msg: '"Year" must be an integer number'
                }
            }
        }
    }, { sequelize });
  
    return Book;
}