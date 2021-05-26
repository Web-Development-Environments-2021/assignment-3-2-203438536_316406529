var express = require("express");
var router = express.Router();
const gamees_utils = require("./utils/games_utils");

router.post("/LeagueManagment/addGame", async (req, res, next) => {
    try{
        data = await req.body;
        await gamees_utils.AddGame(data);
        res.status(201).send("The game have been added successfully");
    }catch(error){
        next(error);
    }
})

module.exports = router;
