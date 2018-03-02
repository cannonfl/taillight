'use strict'

const chai = require('chai')
const Recipes = require('../src/Recipes')
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
const badUrlRecipe = [{
  'title': 'Bad Recipe One',
  'href': 'bad.url.com',
  'ingredients': 'one, two, three, four',
  'thumbnail': 'thumbnail'
},
{
  'title': 'Good Recipe Two',
  'href': 'good.url.com',
  'ingredients': 'one, two',
  'thumbnail': 'thumbnail'
}]

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

let recipes = new Recipes(logMock, requestMock, linkCheckMock)

describe('Recipes', () => {
  describe('getRecipes', () => {
    it('it should return success', async () => {
      try {
        let res = await recipes.getRecipes([])
        res.should.equal('success')
      } catch (err) {
        should.not.exist(err)
      }
    })
  })

  describe('getValidRecipes', () => {
    it('it should return two recipes', async () => {
      try {
        let res = await recipes.getValidRecipes(goodRecipes)
        res.length.should.equal(2)
      } catch (err) {
        should.not.exist(err)
      }
    })

    it('it should return one recipes', async () => {
      try {
        let res = await recipes.getValidRecipes(badUrlRecipe)
        res.length.should.equal(1)
      } catch (err) {
        should.not.exist(err)
      }
    })

    it('it should return no recipes', async () => {
      try {
        let res = await recipes.getValidRecipes([])
        res.length.should.equal(0)
      } catch (err) {
        should.not.exist(err)
      }
    })

    it('it should return empty array', async () => {
      try {
        let res = await recipes.getValidRecipes()
        res.length.should.equal(0)
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
})
