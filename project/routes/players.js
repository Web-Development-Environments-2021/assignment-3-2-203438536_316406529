var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const players_utils = require("./utils/players_utils");

router.get("/playerDetails/:playerID", async (req, res, next) =>{
  let player_details = [];
  try{
    const player_details = await players_utils.getPlayerDetailsById(
      req.params.playerID
    );
    res.send(player_details);
  }catch(error){
    next(error);
  }
});

router.get("/search/locationAndTeam/:searchKey/:teamName/:location", async (req, res, next) => {
  try{
    const search_key = req.params.searchKey;
    const location = req.params.location;
    const teamName = req.params.teamName;
    let player_details = [];
    if(teamName != '{team}' && location !='{location}' && search_key != '{search_key}'){
      player_details = await players_utils.getPlayerByNameLocationTeam(
        search_key, location,teamName
      );
    }
    if(teamName == '{team}' && location !='{location}' && search_key != '{search_key}'){
      player_details = await players_utils.getPlayerByNameLocation(
        search_key, location
      );
    }
    if(teamName != '{team}' && location =='{location}' && search_key != '{search_key}'){
      player_details = await players_utils.getPlayerByNameTeam(
        search_key ,teamName
      );
    }
    if(teamName == '{team}' && location =='{location}' && search_key != '{search_key}'){
      player_details = await players_utils.getPlayerByName(
        search_key
      );
    }
    if(player_details.length==0){res.status(201).send("no players found")}
    else{res.status(200).send(player_details);}
    
  } catch (error) {
    next(error);
  }
});

module.exports = router;

// router.get("/search/name/:searchKey", async (req, res, next) => {
//   try{
//     const search_key = req.params.searchKey;

//     const player_details = await players_utils.getPlayerByName(
//       search_key
//     );
//     res.status(200).send(player_details);
//   } catch (error) {
//     next(error);
//   }
// });

// router.get("/search/locationPlayer/:searchKey/:location", async (req, res, next) => {
//   try{
//     const search_key = req.params.searchKey;
//     const location = req.params.location;
//     // const teamName = req.params.teamName;
//     const player_details = await players_utils.getPlayerByNameLocation(
//       search_key, location
//     );
//     res.send(player_details);
//   } catch (error) {
//     next(error);
//   }
// });

// router.get("/search/PlayerInTeam/:searchKey/:teamName", async (req, res, next) => {
//   try{
//     const search_key = req.params.searchKey;
//     const teamName = req.params.teamName;
//     const player_details = await players_utils.getPlayerByNameTeam(
//       search_key ,teamName
//     );
//     res.send(player_details);
//   } catch (error) {
//     next(error);
//   }
// });





