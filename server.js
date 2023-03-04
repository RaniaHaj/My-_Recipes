const express = require("express");
const path = require("path");
const app = express();
const axios = require("axios");
//const { data } = require("jquery");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "dist")));
app.use(express.static(path.join(__dirname, "node_modules")));

dairyIngredients = [
  "Cream",
  "Cheese",
  "Milk",
  "Butter",
  "Creme",
  "Ricotta",
  "Mozzarella",
  "Custard",
  "Cream Cheese",
];
glutenIngredients = ["Flour", "Bread", "spaghetti", "Biscuits", "Beer"];

const filterRecipe = function (recipes, intolerance) {
  let flag = 1;
  let filteredRecepice = [];
  recipes.forEach((element) => {
    flag = 1;
    intolerance.forEach((i) => {
      if (element.ingredients.includes(i)) {
        flag = 0;
      }
    });
    if (flag == 1) {
      filteredRecepice.push(element);
    }
  });
  return filteredRecepice;
};

app.get("/");
const URL =
  "https://recipes-goodness-elevation.herokuapp.com/recipes/ingredient";
let allOfingredients = [];
let filteredRecepice = [];

app.get(`/recipe/:YOUR_INGREDIENT`, function (req, res) {
  filteredRecepice = [];
  allOfingredients = [];
  let ingredient = req.params.YOUR_INGREDIENT;
  let dairy = req.query.dairy;
  let gluten = req.query.gluten;
  console.log(dairy);
  console.log(gluten);
  axios.get(`${URL}/${ingredient}`).then((recipes) => {
    recipes.data.results.map((e) => {
      let recipe = {
        idMeal: e.idMeal,
        ingredients: e.ingredients,
        title: e.title,
        thumbnail: e.thumbnail,
        href: e.href,
      };
      allOfingredients.push(recipe);
    });
    if (dairy == 0 && gluten == 1) {
      filteredRecepice = filterRecipe(allOfingredients, glutenIngredients);
      res.send(filteredRecepice);
      return;
    }
    if (dairy == 1 && gluten == 0) {
      filteredRecepice = filterRecipe(allOfingredients, dairyIngredients);
      res.send(filteredRecepice);
      return;
    }
    if (dairy == 1 && gluten == 1) {
      filteredRecepice = filterRecipe(allOfingredients, glutenIngredients);
      let extraFilteredRecepice = filterRecipe(
        filteredRecepice,
        dairyIngredients
      );
      res.send(extraFilteredRecepice);
      return;
    } else {
      res.send(allOfingredients);
      return;
    }
  });
});

const port = 3000;
app.listen(port, function () {
  console.log(`Server running on http://localhost:${port}`);
});
