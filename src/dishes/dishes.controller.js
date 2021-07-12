const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /dishes handlers needed to make the tests pass

//middleware
const requiredFields =["name", "description", "img_url", "price"] // build array to check if exist for validation
for(const field of requiredFields) // for of loop through each to check
    if(!data[field]){
        return next({ 
        status: 400,
        message: `Dish must include a ${field}`})
    }
const list (req, res, next) => {
res.json({ data: dishes })
}

const post (req, res, next) => {
    const { data { name, description, img_url, price } = {} } = req.body // destructure our req.body getting needed dish input elements
    const data = req.body.data || {}
    const newDish = {
        id: nextId()
        name,
        description,
        img_url,
        price,
    }
    dishes.push(newDish) // push/add new dish to dishes data 
    res
        .status(201)
        .json({ data: newDish })
}

module.exports = {
    list,
    create: [requiredFields, create]

}