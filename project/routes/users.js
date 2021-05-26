var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const users_utils = require("./utils/users_utils");
const players_utils = require("./utils/players_utils");
const favorites_utils = require("./utils/favorites_utils");

/**
 * Authenticate all incoming requests by middleware
 */
// router.use(async function (req, res, next) {
//   if (req.session && req.session.user_id) {//clieant verification
//     DButils.execQuery("SELECT user_id FROM Users")
//       .then((users) => {
//         if (users.find((x) => x.user_id === req.session.user_id)) {
//           req.user_id = req.session.user_id;
//           next();
//         }
//       })
//       .catch((err) => next(err));
//   } else {
//     res.sendStatus(401);
//   }
// });

/**
 * This path gets return all the players in db
 */
 router.get("/allUsersDetails", async (req, res, next) => {//return all users in system details
  try {
    let usersDetails = {};
    usersDetails = await users_utils.getAllUsers();
    res.status(200).send(usersDetails);
  } catch (error) {
    next(error);
  }
});

router.get("/userDetails", async (req,res,next) => {//return the user details
  try {
    const user_id = req.session.user_id;
    // const user_id = "noam"
    let usersDetails = {};
    usersDetails = await users_utils.getUserDetails(user_id);
    res.status(200).send(usersDetails);
  } catch (error) {
    next(error);
  }
});

router.post("/favoritePlayers", async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const player_id = req.body.playerId;
    await favorites_utils.markPlayerAsFavorite(user_id, player_id);
    res.status(201).send("The player successfully saved as favorite");
  } catch (error) {
    next(error);
  }
});

/**
 * This path returns the favorites players that were saved by the logged-in user
 */
router.get("/favoritePlayers", async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    let favorite_players = {};
    const player_ids = await favorites_utils.getFavoritePlayers(user_id);
    let player_ids_array = [];
    player_ids.map((element) => player_ids_array.push(element.player_id)); //extracting the players ids into array
    const results = await players_utils.getPlayersInfo(player_ids_array);
    res.status(200).send(results);
  } catch (error) {
    next(error);
  }
});

router.get("/FavoriteTeams", async (req, res, next) => {
  try {
      const user_id = req.session.user_id;
      const favorites_Teams = await favorites_utils.getFavoritesUserTeams(
      user_id
    );
    res.send(favorites_Teams);
  } catch (error) {
    next(error);
  }
});

router.post("/FavoriteTeams", async (req, res, next) => {
  try{
    const user_id = req.session.user_id;
    const team_id = req.body.team_id;
    await favorites_utils.markTeamAsFavorite(user_id, team_id);
    res.status(201).send("The team successfully saved as favorite")
  }
  catch (error){
    next(error);
  }
});

router.get("/FavoriteGames", async (req, res, next) => {
  try {
      const user_id = req.session.user_id;
      const favorites_Games = await favorites_utils.getFavoritesUserGames(
      user_id
    );
    res.send(favorites_Games);
  } catch (error) {
    next(error);
  }
});

router.post("/FavoriteGames", async (req, res, next) => {
  try{
    const user_id = req.session.user_id;
    const game_id = req.body.game_id;
    await favorites_utils.markGameAsFavorite(user_id, game_id);
    res.status(201).send("The game successfully saved as favorite")
  }
  catch (error){
    next(error);
  }
});

module.exports = router;
