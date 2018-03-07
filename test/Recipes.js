'use strict'
const chai = require('chai')
const recipes = require('../src/recipes')
const should = chai.should()

const goodRecipes = [{
  'title': 'Good Recipe One',
  'href': 'good.url.com',
  'ingredients': 'one, two, three, four',
  'thumbnail': 'thumbnail'
},
{
  'title': 'Good Recipe Two',
  'href': 'good.url.com',
  'ingredients': 'one, two',
  'thumbnail': 'thumbnail'
}]
const badRecipeUrl = {
  'title': 'Bad Recipe One',
  'href': 'bad.url.com',
  'ingredients': 'one, two, three, four',
  'thumbnail': 'thumbnail'
}
const goodRecipeUrl = {
  'title': 'Good Recipe Two',
  'href': 'good.url.com',
  'ingredients': 'one, two',
  'thumbnail': 'thumbnail'
}

const logMock = {
  info: () => {},
  error: () => {},
  warn: () => {}
}

function requestMock () {
  return Promise.resolve({
    'results': goodRecipes
  })
}

function linkCheckMock (url, callback) {
  if (url.indexOf('good') === 0) {
    callback(null, {
      statusCode: 200
    })
  } else if (url.indexOf('bad') === 0) {
    callback(null, {
      statusCode: 404
    })
  }
}

recipes.initUnitTests({logMock, requestMock, linkCheckMock})

describe('Recipes', () => {
  describe('isValidUrl', () => {
    it('it should return true on valid URL', async () => {
      try {
        let res = await recipes.isValidUrl(goodRecipeUrl)
        res.should.equal(true)
      } catch (err) {
        should.not.exist(err)
      }
    })

    it('it should return false on invalid URL', async () => {
      try {
        let res = await recipes.isValidUrl(badRecipeUrl)
        res.should.equal(false)
      } catch (err) {
        should.not.exist(err)
      }
    })
  })

  describe('hasMostIngredients', () => {
    it('it should return four ingredients', async () => {
      try {
        let res = recipes.hasMostIngredients(goodRecipes)
        res.numIngredients.should.equal(4)
      } catch (err) {
        should.not.exist(err)
      }
    })

    it('it should return no ingredients', async () => {
      try {
        let res = recipes.hasMostIngredients(null)
        res.numIngredients.should.equal(0)
      } catch (err) {
        should.not.exist(err)
      }
    })
  })

  describe('outputRecipe', () => {
    it('it should return no ingredients', async () => {
      try {
        let res = recipes.outputRecipe({recipe: null, numIngredients: 0})
        res.should.equal(0)
      } catch (err) {
        should.not.exist(err)
      }
    })

    it('it should return four ingredients', async () => {
      try {
        let res = recipes.outputRecipe({recipe: goodRecipeUrl, numIngredients: goodRecipeUrl.ingredients.split(',').length})
        res.should.equal(2)
      } catch (err) {
        should.not.exist(err)
      }
    })
  })
  describe('getRecipes', () => {
    it('it should return four ingredients', async () => {
      try {
        let res = await recipes.getRecipes([])
        res.numIngredients.should.equal(4)
      } catch (err) {
        should.not.exist(err)
      }
    })
  })
})
