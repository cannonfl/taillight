'use strict'
const getRecipes = require('./src/recipes.js').getRecipes

let args = process.argv.slice(2)
getRecipes(args)
