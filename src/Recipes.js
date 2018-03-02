'use strict'

class Recipes {
  constructor (logMock, requestMock, linkCheckMock) {
    this.log = logMock || require('simple-node-logger').createSimpleFileLogger('project.log')
    this.request = requestMock || require('request-promise')
    this.linkCheck = linkCheckMock || require('link-check')
  }

  hasValidLink (link) {
    this.log.info(`hasValidLink ${link}`)
    return new Promise((resolve, reject) => {
      this.linkCheck(link, (err, result) => {
        if (result && result.statusCode === 200) {
          resolve(true)
        } else {
          resolve(false)
        }
      })
    })
  }

  async getValidRecipes (results) {
    this.log.info('getValidRecipes')

    let validRecipes = []
    if (results) {
      for (let result of results) {
        if (await this.hasValidLink(result.href)) {
          validRecipes.push(result)
        }
      }
    }
    return Promise.resolve(validRecipes)
  }

  hasMostIngredients (recipes) {
    this.log.info('hasMostIngredients')
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

  outputRecipe ({recipe, numIngredients}) {
    this.log.info('outputRecipe')
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
  }

  async processRecipes ({ results }) {
    this.log.info('processRecipes')
    try {
      let validRecipes = await this.getValidRecipes(results)
      this.outputRecipe(this.hasMostIngredients(validRecipes))
    } catch (err) {
      this.log.error('ERR ' + err)
    }
  }

  async getRecipes (args) {
    this.log.info('getRecipes')
    let ingredient = args[0] || 'pesto'
    let query = args[1] || 'lasagna'
    let page = args[2] || 1
    let options = {
      uri: `http://www.recipepuppy.com/api/?i=${ingredient}&q=${query}&p=${page}`,
      json: true
    }

    try {
      let results = await this.request(options)
      this.processRecipes(results)
      return 'success'
    } catch (err) {
      let errorCode = err.error.code
      this.log.error(`getRecipes: Request returned error code ${errorCode}`)
      console.error(`Request returned error code ${errorCode}`)
      return err
    }
  }
}

module.exports = Recipes
