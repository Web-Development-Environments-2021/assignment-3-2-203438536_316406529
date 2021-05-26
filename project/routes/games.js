var express = require("express");
var router = express.Router();
const gamees_utils = require("./utils/games_utils");

router.post("/LeagueManagment/Games", async (req, res, next) => {
    try{
        data = req.session;
        await gamees_utils.AddGame(data);
        res.status(201).send("The game have been added successfully");

    }catch(error){
        next(error);
    }
})

module.exports = router;