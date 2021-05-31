var express = require("express");
var router = express.Router();
const gamees_utils = require("./utils/games_utils");

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

router.post("/LeagueManagment/addGame", async (req, res, next) => {
  if (req.session.username === "admin") {
    try {
      data = await req.body;
      await gamees_utils.AddGame(data);
      res.status(201).send("The game have been added successfully");
    } catch (error) {
      next(error);
    }
  } else {
    res.sendStatus(400).send("Only admin can add games in league");
  }
});

// router.post("/games/LeagueManagment/addScore", async (req, res, next) =>{
//     try{
//     }catch(error){
//         next(error);
//     }
// })

module.exports = router;
