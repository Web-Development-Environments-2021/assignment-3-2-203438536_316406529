var express = require("express");
var router = express.Router();
const league_utils = require("./utils/league_utils");

router.get("/LeagueData", async (req, res, next) => {
  let leaguePageDetails = [];
  try {
    const league_details = await league_utils.getLeagueData();
    leaguePageDetails.push(league_details);
    if ( req.user_id){//there is a user in the system
      let currentDate= new Date().toISOString();
      const userFavoriteGames = await DButils.execQuery(`select top 3 * from dbo.userFavoriteGames
        where game_date >= ${currentDate}`);
      if(userFavoriteGames) {leaguePageDetails.push(userFavoriteGames);}
    }
    // leaguePageDetails.push(userFavoriteGames);
    res.send(leaguePageDetails);
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
