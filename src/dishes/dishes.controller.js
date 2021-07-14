const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /dishes handlers needed to make the tests pass

//middleware

//checks if all fields/inputs exist
function fieldCheck(req, res, next) {
  const { data: { name, description, image_url, price } = {} } = req.body; // destructure our req.body getting needed dish input elements
  const requiredFields = ["name", "description", "image_url", "price"]; // build array to check if exist for validation
  const data = req.body.data || {};
  for (const field of requiredFields) {
    // for of loop through each to check
    if (!data[field]) {
      return next({
        status: 400,
        message: `Dish must include a ${field}`,
      });
    }
  }
  next();
}

// checks if dish has a price and its greater than 0
function priceCheck(req, res, next) {
  const { data: { price } = {} } = req.body; // destructuring our req.body getting needed dish input elements
  if (typeof price !== "number" || price < 1) {
    return next({
      status: 400,
      message: "Dish must have a price that is an integer greater than 0",
    });
  }
  next();
}

//finds dish by id
function findDish(req, res, next) {
  const { dishId } = req.params;
  const matchedDish = dishes.find((dish) => dish.id === dishId);
  if (matchedDish) {
    res.locals.dish = matchedDish;
    return next();
  }
  next({ status: 404, message: `No matching dish found` });
}

//checks to see if dish exist
function dishExist(req, res, next) {
  const { dishId } = req.params;
  let foundDish = dishes.find((dish) => dish.id === dishId);
  if (foundDish) {
    res.locals.dish = foundDish;
    return next();
  }
  next({
    status: 404,
    message: `Dish does not exist: ${dishId}.`,
  });
}

//checks if id exist then if it matches
function dishIdCheck(req, res, next) {
  const { dishId } = req.params;
  const { data: { id } = {} } = req.body;

  if (id) {
    if (dishId !== id) {
      next({
        status: 400,
        message: `Dish id does not match route id. Dish: ${id}, Route: ${dishId}`,
      });
    }
  }
  next();
}

// CRUDS

const create = (req, res, next) => {
  const { data: { name, description, image_url, price } = {} } = req.body; // destructure our req.body getting needed dish input elements
  const newDish = {
    id: nextId(),
    name,
    description,
    image_url,
    price,
  };
  dishes.push(newDish); // push/add new dish to dishes data
  res.status(201).json({ data: newDish });
};

const list = (req, res, next) => {
  res.json({ data: dishes });
};

function read(req, res, next) {
  res.json({ data: res.locals.dish });
}
function update(req, res, next) {
  const { data: { name, description, image_url, price } = {} } = req.body; // destructuring our req.body getting needed dish input elements
  const updatedDish = {
    ...res.locals.dish, // grab the res.locals.dish = matchedDish, then replacing with values below
    name,
    description,
    image_url,
    price,
  };
  res.json({ data: updatedDish });
}

// function destroy(res, req, next) {}

module.exports = {
  list,
  create: [fieldCheck, priceCheck, create],
  read: [findDish, read],
  update: [dishExist, dishIdCheck, fieldCheck, priceCheck, update],
};
