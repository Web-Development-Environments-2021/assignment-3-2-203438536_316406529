var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const players_utils = require("./utils/players_utils");

router.get("/teamFullDetails/:teamId", async (req, res, next) => {
  let team_players = [];
  let team_coach = "";
  try {
    const team_players = await players_utils.getPlayersByTeam(
      req.params.teamId
    );
    const team_coach = await players_utils.getCoachNameByTeam(
      req.params.teamId
    );
    //we should keep implementing team page.....
    res.send({team_players: team_players,team_coach: team_coach});
  } catch (error) {
    next(error);
  }
});

module.exports = router;
