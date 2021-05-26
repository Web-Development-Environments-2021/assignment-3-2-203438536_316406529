var express = require("express");
var router = express.Router();
const league_utils = require("./utils/league_utils");

router.get("/LeagueData", async (req, res, next) => {
  try {
    const league_details = await league_utils.getLeagueData();
    res.send(league_details);
  } catch (error) {
    next(error);
  }
});

router.get("/leagueGames", async (req, res, next) =>{
  try{
    const user_id = req.session.user_id;
    const games = getAllLeagueGames(user_id);
    res.send(games);
  } catch(error){
      next(error);
  }


});

module.exports = router;
