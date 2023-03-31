const express = require('express');
const uuid = require('uuid');

const router = express.Router();

const resData = require('../util/restaurant-data');

router.get('/restaurants', function (req, res) {
    // const htmlFilePath = path.join(__dirname, 'views', 'restaurants.html');
    // res.sendFile(htmlFilePath);
    let order = req.query.order;
    let nextOrder = 'desc';
    if(order !== 'asc' && order !== 'desc'){
        order = 'asc';
    }

    if(order === 'desc'){
        nextOrder = 'asc';
    }
    const storedResaturants = resData.getStoredRestaurants();
    storedResaturants.sort(function(resA, resB) {
        if((order === 'asc' && resA.name > resB.name) || (order === 'desc' && resB.name > resA.name)){
            return 1;
        }
        return -1;
    });

    res.render('restaurants', { numberOfRestaurants: storedResaturants.length, restaurants: storedResaturants, nextOrder: nextOrder });
});

router.get('/restaurants/:id', function(req, res){
    const restaurantId = req.params.id;

    const storedResaturants = resData.getStoredRestaurants();

    for(const restaurant of storedResaturants){
        if(restaurant.id == restaurantId){
            return res.render('restaurant-detail', {rid: restaurantId, restaurant: restaurant} );
        }
    }

    res.status(404).render('404'); 
    
});

router.get('/recommend', function (req, res) {
    // const htmlFilePath = path.join(__dirname, 'views', 'recommend.html');
    // res.sendFile(htmlFilePath);
    res.render('recommend');
});

router.post('/recommend', function (req, res) {
    const restaurant = req.body;
    restaurant.id = uuid.v4();
    const restaurants = resData.getStoredRestaurants();

    restaurants.push(restaurant);

    resData.storeRestaurants(restaurants);

    res.redirect('/confirm');
});

router.get('/confirm', function (req, res) {
    // const htmlFilePath = path.join(__dirname, 'views', 'confirm.html');
    // res.sendFile(htmlFilePath);
    res.render('confirm');
});

module.exports = router;