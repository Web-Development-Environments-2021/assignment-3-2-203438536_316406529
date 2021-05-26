var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const players_utils = require("./utils/players_utils");

router.get("/playerDetails/:playerID", async (req, res, next) =>{
  let player_details = [];
  try{
    const player_details = await players_utils.getPlayerDetailsById(
      req.params.playerID
    );
    res.send(player_details);
  }catch(error){
    next(error);
  }
});

module.exports = router;


