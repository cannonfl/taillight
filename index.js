'use strict'

const Recipes = require('./src/Recipes.js')
const recipes = new Recipes()

let args = process.argv.slice(2)
recipes.getRecipes(args)
