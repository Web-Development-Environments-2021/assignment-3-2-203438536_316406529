var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const players_utils = require("./utils/players_utils");

router.get("/playerDetails/:playerID", async (req, res, next) => {
  let player_details = [];
  try {
    const player_details = await players_utils.getPlayerDetailsById(
      req.params.playerID
    );
    if (!player_details) {
      res.status(400).send("faild to get player data");
      return;
    } else {
      res.status(200).send(player_details);
    }
  } catch (error) {
    next(error);
  }
});

router.get(
  "/search/locationAndTeam/:searchKey/:teamName/:location",
  async (req, res, next) => {
    //seach players
    try {
      const search_key = req.params.searchKey;
      const location = req.params.location;
      const teamName = req.params.teamName;
      let player_details = [];
      if (
        teamName != "{team}" &&
        location != "{location}" &&
        search_key != "{search_key}"
      ) {
        //search by name, team, location
        player_details = await players_utils.getPlayerByNameLocationTeam(
          search_key,
          location,
          teamName
        );
      }
      if (
        teamName == "{team}" &&
        location != "{location}" &&
        search_key != "{search_key}"
      ) {
        //search by name, location
        player_details = await players_utils.getPlayerByNameLocation(
          search_key,
          location
        );
      }
      if (
        teamName != "{team}" &&
        location == "{location}" &&
        search_key != "{search_key}"
      ) {
        //search by name, team
        player_details = await players_utils.getPlayerByNameTeam(
          search_key,
          teamName
        );
      }
      if (
        teamName == "{team}" &&
        location == "{location}" &&
        search_key != "{search_key}"
      ) {
        //search by name
        player_details = await players_utils.getPlayerByName(search_key);
      }
      if (player_details.length == 0) {
        res.status(201).send("no players found");
      } else {
        res.status(200).send(player_details);
      }
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
