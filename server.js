'use strict'

const url="postgres://sozan:0000@localhost:5432/movi";


// 1. require the package
require('dotenv').config();
const express = require('express');
const moviData = require("./data.json");
const axios = require('axios').default;
const apiKey = process.env.API_KEY;
const cors = require("cors");

const bodyParser = require('body-parser');
require('dotenv').config();


// 2. create an Express app
const app = express();
const port = 3000;
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const { Client } = require('pg');
const client = new Client(url);

//3. the server is listening after connected with DB
client.connect().then(() => {

    app.listen(port, () => {
        console.log(`Server is listening ${port}`);
    });
})

// 3. the server is listening on port 3000
// app.listen(port, handleListen);
// function handleListen() {
//     console.log(`Example app listening on port ${port}`)

// }



// 4. creating a route
app.get("/", handleHomePage);
app.get("/favorite", handelFavoritePage)

app.get('/trending', handleTrending);
app.get('/search', handleSearch);
app.get('/upcoming', handelComing);
app.get('/rated', handelRate);
app.post("/addMovi", handleAdd);
app.get("/getMovi", handleGet);

// app.use( "*",handelNotfound);
app.use(handleError);



//5.Functions for home page
function handleHomePage (req ,res){
    

        let newMovi = new Movi (moviData.id,moviData.title, moviData.poster_path,moviData.release_date ,moviData.overview);
        
    res.json(newMovi);
}


function handelFavoritePage (req ,res){
res.send("Welcome to favorite Page");
}






// axios.get().then().catch()
function handleTrending(req, res) {
    // waiting to get data from 3rd API
    const url =` https://api.themoviedb.org/3/trending/all/week?api_key=${apiKey}&language=en-US`;
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
  let movieName = req.query.movieName;
  let url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${movieName}&page=2`;
  // axios.get().then().catch() 
  axios.get(url)
    .then(result => {
      // console.log(result.data.results);
      res.json(result.data.results)
    })
    .catch((error) => {
      console.log(error);
      res.send("Searching for data")
    })
}
function handelComing(req, res) {
    // waiting to get data from 3rd API
    const url = `https://api.themoviedb.org/3/movie/upcoming?api_key=${apiKey}&language=en-US&page=1`;
    axios.get(url)
        .then(result => {
            // console.log(result);
            let moves2 = result.data.results.map(element => {
                return new Movi(element.id, element.title, element.poster_path ,element.release_date);
            })
            res.json(moves2);
        })
        .catch((error) => {
            console.log(error);
            res.send("Inside catch")
        })


    }

    function handelRate(req, res) {
        // waiting to get data from 3rd API
        const url = `https://api.themoviedb.org/3/movie/upcoming?api_key=${apiKey}&language=en-US&page=1`;
        axios.get(url)
            .then(result => {
                // console.log(result);
                let movees = result.data.results.map(element => {
                    return new Movi(element.id, element.title, element.poster_path );
                })
                res.json(movees);
            })
            .catch((error) => {
                console.log(error);
                res.send("Inside catch")
            })
    
    
        }


    function Movi( id ,title, poster_path ,release_date , overview) {
        this.id = id;
        this.title = title;
        this.poster_path = poster_path;
        this.release_date = release_date;
        this.overview = overview;
    }


    //Function related to DB 
    function handleAdd(req, res){
        // console.log(req.body);

        const { id, title, poster_path, release_date , overview , myPersonal_Commen} = req.body;

    let sql = 'INSERT INTO moviTable(id, title, poster_path, release_date , overview ,myPersonal_Commen ) VALUES($1, $2, $3, $4 ,$5 ,$6) RETURNING *;'; // sql query
    let values = [id, title, poster_path, release_date , overview ,myPersonal_Commen  ];
    client.query(sql, values).then((result) => {
        console.log(result.rows);
        return res.status(201).json(result.rows[0]);
    }).catch()

    }


   

    function handleGet(req, res) {
        let sql = 'SELECT * from moviTable;'
        client.query(sql).then((result) => {
            console.log(result);
            res.json(result.rows);
            
    }).catch((err) => {
        handleError(err, req, res);
    });

    }




    //Function of handeling error 500
// 
function handleError(error, req, res) {
    res.status(500).send(error)
}


// function handelNotfound(req , res)
// {
//     res.send("page not found")
// }