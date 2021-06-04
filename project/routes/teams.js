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
    const team_players = await teams_utils.getPlayersByTeam(req.params.teamId);
    const team_coach = await teams_utils.getCoachNameByTeam(req.params.teamId);
    const team_games_upcoming = await teams_utils.getUpcomingTeamGames(
      req.params.teamId
    );
    res.send({
      team_players: team_players,
      team_coach: team_coach,
      team_games_upcoming: team_games_upcoming,
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
