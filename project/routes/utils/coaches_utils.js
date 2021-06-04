const axios = require("axios");
const e = require("express");
const api_domain = "https://soccer.sportmonks.com/api/v2.0";

async function getCoachDetailsById(coach_id){
    //get coach data from Football-API
    const coach = await axios.get(`${api_domain}/coaches/${coach_id}`, {
      params: {
        api_token: process.env.api_token,
      },
    });
    const {fullname, image_path, common_name, nationality, birthcountry,  birthdate } = coach.data.data;
    // get team data 
    const coach_team = await getCoachTeam(coach.data.data.team_id);
    let {name} = coach_team.data.data;
    if (coach_team.data.data.league.data.id != 271){
      name =  'coach have no team in your league';
    }
    return{
      fullname: fullname,
      image_path: image_path,
      common_name: common_name,
      nationality: nationality,
      birthcountry: birthcountry,
      birthdate: birthdate,
      team_name: name,
    };
}

async function getCoachTeam(team_id){
    const coach_team = await axios.get(`${api_domain}/teams/${team_id}`,{
        params:{
            include: "league",
            api_token: process.env.api_token,
        },
    });
    return coach_team;
}

exports.getCoachDetailsById = getCoachDetailsById;