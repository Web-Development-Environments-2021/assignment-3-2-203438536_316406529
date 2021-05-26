var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const coaches_utils = require("./utils/coaches_utils");

router.get("/coachDetails/:coachID", async (req, res, next) =>{
    let coach_details = [];
    try{
      const coach_details = await coaches_utils.getCoachDetailsById(
        req.params.coachID
      );
      res.send(coach_details);
    }catch(error){
      next(error);
    }
  });
  
  module.exports = router;