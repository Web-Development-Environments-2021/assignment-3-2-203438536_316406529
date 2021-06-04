var express = require("express");
var router = express.Router();
const games_utils = require("./utils/games_utils");

// router.use(async function (req, res, next) {
//   if (req.session.user_id === "admin") {
//     next();
//   } else {
//     res.sendStatus(400).send("Only admin can change games in league");
//   }
//   if (req.session && req.session.username) {//clieant verification
//     DButils.execQuery("SELECT username FROM Users")
//       .then((users) => {
//         if (users.find((x) => x.username === req.session.username)) {
//           req.username = req.session.username;
//           next();
//         }
//       })
//       .catch((err) => next(err));
//   } else {
//     res.sendStatus(401);
//   }
// });

router.get(`/GameDocumentation/:gameID`, async (req, res, next) => {
  try {
    const game_info = await games_utils.getGameDetaildByID(req.params.gameID);
    if (!game_info) {
      //game not exist in DB
      res.send("There is no game with ID " + req.params.gameID);
    } else {
      res.send(game_info);
    }
  } catch (error) {
    next(error);
  }
});

router.post("/LeagueManagment/addGame", async (req, res, next) => {
  if (req.session.username === "admin") {
    try {
      data = await req.body;
      const currentDate = new Date().toISOString();
      const gameDateString = new Date(data.date).toISOString();
      if (currentDate > gameDateString) {
        res.status(400).send("Invalid game date.Please add future games only!");
      } else {
        await games_utils.AddGame(data);
        // res.status(201).send("The game have been added successfully");
      }
    } catch (error) {
      next(error);
    }
  } else {
    res.status(400).send("Only admin can add games in league");
  }
});

router.post("/LeagueManagment/addScore", async (req, res, next) => {
  if (req.session.username === "admin") {
    try {
      const { game_id, home_team_goal, away_team_goal } = await req.body;
      const checkIfGameOccur = await games_utils.checkIfGameOccur(game_id); //if game occur return true, otherwise false;
      if (checkIfGameOccur) {
        await games_utils.AddScoresToGame(
          game_id,
          home_team_goal,
          away_team_goal
        );
        res.status(200).send("Score update to game with id " + game_id);
      } else {
        res.status(400).send("Invalid game ID");
      }
    } catch (error) {
      next(error);
    }
  }
});

router.post("/LeagueManagment/addEvent", async (req, res, next) => {
  if (req.session.username === "admin") {
    try {
      const data = await req.body;
      const game_id = data.game_id;
      const checkIfGameOccur = await games_utils.checkIfGameOccur(game_id);
      if (checkIfGameOccur) {
        await games_utils.AddEventToGame(
          game_id,
          data.date,
          data.hour,
          data.game_minute,
          data.event_description
        );
        res
          .status(201)
          .send("The event has been added to game with id " + game_id);
      } else {
        res.status(401).send("Can't add event to game that hasn't occur");
      }
    } catch (error) {
      next(error);
    }
  }
});

// router.post("/games/LeagueManagment/addScore", async (req, res, next) =>{
//     try{
//     }catch(error){
//         next(error);
//     }
// })

module.exports = router;
