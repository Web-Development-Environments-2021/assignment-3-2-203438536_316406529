var express = require("express");
var router = express.Router();
const league_utils = require("./utils/league_utils");
const game_utils = require("./utils/games_utils");

router.get("/LeagueData", async (req, res, next) => {//all league data
  let leaguePageDetails = [];
  try {
    const league_details = await league_utils.getLeagueData();
    leaguePageDetails.push(league_details);
    if (req.user_id) {
      //there is a user in the system
      let currentDate = new Date().toISOString();
      const userFavoriteGames =
        await DButils.execQuery(`select top 3 game_date, home_team, away_team, field from dbo.userFavoriteGames
        where game_date >= ${currentDate}`);
      //show preview of each game that hasnt occur yet
      let promises = [];
      userFavoriteGames.map((game) => {
        promises.push(game);
      });
      let game_info = await Promise.all(promises);
      if (game_info) {
        leaguePageDetails.push(game_info);
      }
    }
    // leaguePageDetails.push(userFavoriteGames);
    res.send(leaguePageDetails);
  } catch (error) {
    next(error);
  }
});

router.get("/currentStageDetails", async (req, res, next) => {//cur stage data
  try {
    const stageGames = await league_utils.getCurrentStageGames();
    res.send(stageGames);
  } catch (error) {
    next(error);
  }
});

router.get("/leagueGames", async (req, res, next) => {//get all league games
  try {
    if (req.session && req.session.username === "admin") {
      const games = await game_utils.getAllLeagueGames();
      if (games == false) {
        res.statusMessage(400).send("faild to get league games");
      } else {
        res.status(200).send(games);
      }
    } else {
      res.status(400).send("Access denied! Only admin can get this details");
    }
  } catch (error) {
    next(error);
  }
});

router.get("/getSeachOutoCompleteData", async (req, res, next) => {//for seach page, all manes- tams, players, positions- for aouto complate
  let players_names = [];
  try {
    const players_names = await league_utils.getSeachData();
    res.send(players_names);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
