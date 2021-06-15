var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const players_utils = require("./utils/players_utils");
const teams_utils = require("./utils/teams_utils");

router.get("/teamFullDetails/:teamId", async (req, res, next) => {
  let team_players = [];
  let team_coach = "";
  try {
    const checkTeamLeague = await teams_utils.checkIfTeamExist(
      req.params.teamId
    );
    if (!checkTeamLeague) {
      //team not in our league
      res.status(400).send("Team not in league No. 271");
    }
    let promises = [];
    promises.push(teams_utils.getPlayersByTeam(req.params.teamId));
    promises.push(teams_utils.getCoachNameByTeam(req.params.teamId));
    promises.push(teams_utils.getTeamGames(req.params.teamId));
    // promises.push(teams_utils.getTeamNameById(req.params.teamId));
    promises.push(teams_utils.getTeamsInfo([{ teamID: req.params.teamId }]));

    let fulfill = await Promise.all(promises);
    res.send({
      // team_name: fulfill[3],
      team_players: fulfill[0],
      team_coach: fulfill[1],
      team_games: fulfill[2],
      team_details: teams_utils.extractTeamDetails(fulfill[3]),
    });
  } catch (error) {
    next(error);
  }
});

router.get("/search/:searchKey", async (req, res, next) => {
  try {
    const search_key = req.params.searchKey;
    const team_details = await teams_utils.getTeamByName(search_key);
    if (!team_details[0]) {
      res.status(201).send("no Teams Found");
      return;
    }
    res.send(team_details);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
