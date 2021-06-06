var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const users_utils = require("./utils/users_utils");
const players_utils = require("./utils/players_utils");
const favorites_utils = require("./utils/favorites_utils");
const { send } = require("process");

/**
 * Authenticate all incoming requests by middleware
 */
router.use(async function (req, res, next) {
  if (req.session && req.session.username) {
    //clieant verification
    DButils.execQuery("SELECT username FROM dbo.Users")
      .then((users) => {
        if (users.find((x) => x.username === req.session.username)) {
          req.username = req.session.username;
          next();
        }
      })
      .catch((err) => next(err));
  } else {
    res.sendStatus(401);
  }
});

/**
 * This path gets return all the players in db
 */
router.get("/allUsersDetails", async (req, res, next) => {
  if (req.session.username != "admin") {
    res.send("user un Aouthorized");
  }
  //return all users in system details
  try {
    let usersDetails = {};
    usersDetails = await users_utils.getAllUsers();
    res.status(200).send(usersDetails);
  } catch (error) {
    next(error);
  }
});

router.get("/userDetails", async (req, res, next) => {
  //return the user details
  try {
    const username = req.session.username;
    // const user_id = "noam"
    let usersDetails = {};
    usersDetails = await users_utils.getUserDetails(username);
    res.status(200).send(usersDetails);
  } catch (error) {
    next(error);
  }
});

router.post("/favoritePlayers", async (req, res, next) => {
  try {
    const username = req.session.username;
    const player_id = req.body.playerId;
    let status = await favorites_utils.markPlayerAsFavorite(
      username,
      player_id
    );
    if (status === true) {
      res.status(200).send("The player successfully saved as favorite");
    }
    if (!status) {
      res
        .status(400)
        .send(`The player id '${player_id}' not exist in DataBase`);
    } else {
      res.status(400).send(status);
    }
  } catch (error) {
    next(error);
  }
});

/**
 * This path returns the favorites players that were saved by the logged-in user
 */
router.get("/favoritePlayers", async (req, res, next) => {
  try {
    const username = req.session.username;
    const favorites_Players = await favorites_utils.getFavoritePlayers(
      username
    );
    res.status(200).send(favorites_Players);
  } catch (error) {
    next(error);
  }
});

router.get("/FavoriteTeams", async (req, res, next) => {
  try {
    const username = req.session.username;
    const favorites_Teams = await favorites_utils.getFavoritesUserTeams(
      username
    );
    if (favorites_Teams === false) {
      res.status(400).send("your fav list contains a team that not exist");
    }
    res.status(200).send(favorites_Teams);
  } catch (error) {
    next(error);
  }
});

router.post("/FavoriteTeams", async (req, res, next) => {
  try {
    const username = req.session.username;
    const team_id = req.body.team_id;
    let status = await favorites_utils.markTeamAsFavorite(username, team_id);
    if (status === true) {
      res.status(200).send("team adding success ");
    }
    if (status == false) {
      res.status(400).send(`no team with in '${team_id}' found in database`);
    } else {
      res.status(400).send(status);
    }
  } catch (error) {
    next(error);
  }
});

router.get("/FavoriteGames", async (req, res, next) => {
  try {
    const username = req.session.username;
    const favorites_Games = await favorites_utils.getFavoritesUserGames(
      username
    );
    res.send(favorites_Games);
  } catch (error) {
    next(error);
  }
});

router.post("/FavoriteGames", async (req, res, next) => {
  try {
    const username = req.session.username;
    const game_id = req.body.game_id;
    let status = await favorites_utils.markGameAsFavorite(username, game_id);
    if (status === false) {
      res.status(400).send(`game id '${game_id}' does not exist in DB`);
    }
    if (status === true) {
      res.status(200).send("The game successfully saved as favorite");
    }
    res.status(400).send(status);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
