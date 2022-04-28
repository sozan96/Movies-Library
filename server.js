// 1. require the package
const express = require('express');
const moviData = require("./data.json");

// 2. create an Express app
const app = express();
const port = 3000;


// 3. the server is listening on port 3000
app.listen(port, handleListen);
function handleListen() {
    console.log(`Example app listening on port ${port}`)

}
// 4. creating a route
app.get("/", handleHomePage);
app.get("/favorite", handelFavoritePage)
app.use( "*",handelNotfound);
app.use(Err500);



//5.Functions for home page
function handleHomePage (req ,res){
    

        let newMovi = new Movi (moviData.title, moviData.poster_path, moviData.overview);
        
    res.json(newMovi);
}

function Movi(title, poster_path, overview) {
    this.title = title;
    this.poster_path = poster_path;
    this.overview = overview;
}

function handelFavoritePage (req ,res){
res.send("Welcome to favorite Page");
}



//Function of handeling error 500
function Err500 (req,res){
    let error={
        "status":500,
        "responsetext": "Sorry something went wrong"
    
    }
    res.status(500).json(error);
}

function handelNotfound(req , res)
{
    res.send("page not found")
}


