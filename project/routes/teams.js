var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const players_utils = require("./utils/players_utils");
const teams_utils = require("./utils/teams_utils");

router.get("/teamFullDetails/:teamId", async (req, res, next) => {
  let team_players = [];
  let team_coach = "";
  try {
    const checkTeamLeague = await teams_utils.checkTeamLeague(
      req.params.teamId
    );
    if (!checkTeamLeague) {
      res.send("Team not in league 271");
    }
    let promises = [];
    promises.push(teams_utils.getPlayersByTeam(req.params.teamId));
    promises.push(teams_utils.getCoachNameByTeam(req.params.teamId));
    promises.push(teams_utils.getTeamGames(req.params.teamId));
    
    let fulfill = await Promise.all(promises);
    res.send({
      team_players: fulfill[0],
      team_coach: fulfill[1],
      team_games: fulfill[2],
    });

  } catch (error) {
    next(error);
  }
});

router.get("/search/:searchKey", async (req, res, next) => {
  try {
    const search_key = req.params.searchKey;
    const team_details = await teams_utils.getTeamByName(search_key);
    res.send(team_details);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
