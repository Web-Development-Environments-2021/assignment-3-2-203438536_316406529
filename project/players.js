var express = require("express");
var router = express.Router();
const players_utils = require("./utils/players_utils.js");

router.get("/playerDetails/:playerId", async (req, res, next) => {
    let player_details = [];
    try {
      const playerDetails = await players_utils.get();
      res.send(league_details);
    } catch (error) {
      next(error);
    }
  });

  router.get("/teamFullDetails/:teamId", async (req, res, next) => {
    let team_details = [];
    try {
      const team_details = await players_utils.getPlayersByTeam(
        req.params.teamId
      );
      //we should keep implementing team page.....
      res.send(team_details);
    } catch (error) {
      next(error);
    }
  });