"use strict";
const http = require("http");
const Promise = require("Bluebird");
const rp = require("request-promise");
const linkCheck = Promise.promisify(require("link-check"));
const log = require('simple-node-logger').createSimpleFileLogger('project.log');

const recipes = require("./recipes.js");

async function hasValidLink(link) {
  log.info(`hasValidLink ${link}`);
  try {
    let result = await linkCheck(link);
    if (result.statusCode === 200) {
      return Promise.resolve(true);
    }
  } catch (err) {
    log.warn(`hasValidLink error:${err}`);
  }
  return Promise.resolve(false);
}

async function getValidRecipes(results) {
  log.info('getValidRecipes');
  return await Promise.map(results, async function(result) {
    if (await hasValidLink(result.href)) {
      return result;
    }
  });
}

function hasMostIngredients(recipes) {
  log.info("hasMostIngredients");
  let selectedRecipe;
  let maxLength = 0;
  recipes.forEach(recipe => {
    let length = recipe.ingredients.split(',').length;
    if ( length > maxLength) {
      selectedRecipe = recipe;
      maxLength = length;
    }
  });
  return {
    recipe: selectedRecipe,
    numIngredients: maxLength
  }
}

function outputRecipe({recipe, numIngredients}) {
  log.info("outputRecipe");
  console.log("Your Recipe");
  console.log("------------");
  console.log(`Name: ${recipe.title}`);
  console.log(`URL: ${recipe.href}`);
  console.log(`Number of ingredients: ${numIngredients}`);
}

//Find a way to get all the recipes from the API for lasagnas with pesto.
async function processRecipes({ results }) {
  log.info("processRecipes");
  let validRecipes;
  try {
    validRecipes = await getValidRecipes(results);
    outputRecipe(hasMostIngredients(validRecipes));
  } catch (err) {
    log.error("ERR " + err);
  }
}

//http://www.recipepuppy.com/api/?i=pesto&q=lasagna&p=2
async function getRecipes() {
  log.info("getRecipes");
  let ingredient = args[0] || pesto;
  let query =  args[1] || lasagna;
  let page =  args[2] || 1;
  let options = {
    uri: `http://www.recipepuppys.com/api/?i=${ingredients}&q=${query}&p=${page}`,
    json: true
  };

  try {
    let results = await rp(options);
    processRecipes(results);
  } catch (err) {
    let errorCode = err.error.code
    log.error(`getRecipes: Request returned error code ${errorCode}`);
    console.error(`Request returned error code ${errorCode}`);
  }
}

let args = process.argv.slice(2);
//getRecipes(args);


console.log(args);
processRecipes(recipes());
