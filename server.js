'use strict'

// 1. require the package
const express = require('express');
const moviData = require("./data.json");
const axios = require('axios').default;
require('dotenv').config();
const apiKey = process.env.API_KEY;
const cors = require("cors");


// 2. create an Express app
const app = express();
const port = 3000;
app.use(cors());


// 3. the server is listening on port 3000
app.listen(port, handleListen);
function handleListen() {
    console.log(`Example app listening on port ${port}`)

}

// 4. creating a route
app.get("/", handleHomePage);
app.get("/FavoritePage", handelFavoritePage)
// app.use(Err500);
app.get('/trending', handleTrending);
app.get('/search', handleSearch);


//5.Functions for home page
function handleHomePage (req ,res){
    

        let newMovi = new Movi (moviData.id,moviData.title, moviData.poster_path,moviData.release_date ,moviData.overview);
        
    res.json(newMovi);
}


function handelFavoritePage (req ,res){
res.send("Welcome to Favorite Page");
}



//Function of handeling error 500
function Err500 (req,res){
    let error={
        "status":500,
        "responsetext": "Sorry something went wrong"
    
    }
    res.status(500).json(error);
}


// axios.get().then().catch()
function handleTrending(req, res) {
    // waiting to get data from 3rd API
    const url = `https://api.themoviedb.org/3/trending/all/week?api_key=37ddc7081e348bf246a42f3be2b3dfd0&language=en-US`;
    axios.get(url)
        .then(result => {
            let moves = result.data.results.map(element => {
                return new Movi(element.id, element.title, element.poster_path ,element.release_date , element.overview);
            })
            res.json(moves);
        })
        .catch((error) => {
            console.log(error);
            res.send("Inside catch")
        })

    }

    function handleSearch(req, res) {
        console.log(req.query);
        
        let moviname = req.query.moviname; // I chose to call it name
        let url = `https://api.themoviedb.org/3/search/movie?api_key=668baa4bb128a32b82fe0c15b21dd699&language=en-US&query=${moviname}`

        axios.get(url)
            .then(result => {
                // console.log(result)
                console.log(result.data.results);
                res.json(result.data.results);

            })
            .catch();
        // waiting to get data from 3rd API
        res.send("Searching for recipes");
    }


    function Movi( id ,title, poster_path ,release_date , overview) {
        this.id = id;
        this.title = title;
        this.poster_path = poster_path;
        this.release_date = release_date;
        this.overview = overview;
    }
