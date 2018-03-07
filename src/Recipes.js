'use strict'
let log = require('simple-node-logger').createSimpleFileLogger('project.log')
let request = require('request-promise')
let linkCheck = require('link-check')

let isValidUrl = async (recipe) => {
  return new Promise((resolve, reject) => {
    linkCheck(recipe.href, (err, result) => {
      if (err) {
        resolve(false)
      } else if (result && result.statusCode === 200) {
        resolve(true)
      } else {
        resolve(false)
      }
    })
  })
}

let hasMostIngredients = (recipes) => {
  log.info('hasMostIngredients')
  let selectedRecipe
  let numIngredients = 0
  if (recipes) {
    recipes.forEach(recipe => {
      let length = recipe.ingredients.split(',').length
      if (length > numIngredients) {
        selectedRecipe = recipe
        numIngredients = length
      }
    })
  }
  return {
    recipe: selectedRecipe,
    numIngredients: numIngredients
  }
}

let outputRecipe = ({recipe, numIngredients}) => {
  log.info('outputRecipe')
  console.log(' ')
  if (recipe) {
    console.log('Your Recipe')
    console.log('------------')
    console.log(`Name: ${recipe.title}`)
    console.log(`URL: ${recipe.href}`)
    console.log(`Number of ingredients: ${numIngredients}`)
  } else {
    console.log('No recipes found. Please try again.')
    console.log('-----------------------------------')
  }
  console.log(' ')
  return numIngredients
}

let getRecipes = async (args) => {
  log.info('getRecipes')
  let ingredient = args[0] || 'pesto'
  let query = args[1] || 'lasagna'
  let page = args[2] || 1
  let options = {
    uri: `http://www.recipepuppy.com/api/?i=${ingredient}&q=${query}&p=${page}`,
    json: true
  }

  try {
    let mostingredients = {}
    let response = await request(options)
    let recipes = response.results
    if (recipes && recipes.length > 0) {
      let validRecipes = await recipes.filter(isValidUrl)
      mostingredients = hasMostIngredients(validRecipes)
    }
    outputRecipe(mostingredients)
    return mostingredients
  } catch (err) {
    log.error(`getRecipes: Request returned error code ${err}`)
    return err
  }
}

let initUnitTests = ({logMock, requestMock, linkCheckMock}) => {
  log = logMock
  request = requestMock
  linkCheck = linkCheckMock
}

module.exports = {
  initUnitTests: initUnitTests,
  isValidUrl: isValidUrl,
  hasMostIngredients: hasMostIngredients,
  outputRecipe: outputRecipe,
  getRecipes: getRecipes
}
