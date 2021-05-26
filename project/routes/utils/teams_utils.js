const axios = require("axios");
const e = require("express");
const api_domain = "https://soccer.sportmonks.com/api/v2.0";
const players_utils = require("./players_utils");


async function getPlayersByTeam(team_id) {
    let player_ids_list = await getPlayerIdsByTeam(team_id);
    let players_info = await players_utils.getPlayersInfo(player_ids_list);
    return players_utils.extractDetailsForTeamPage(players_info);
  }

async function getPlayerIdsByTeam(team_id) {
    let player_ids_list = [];
    const team = await axios.get(`${api_domain}/teams/${team_id}`, {
      params: {
        include: "squad",
        api_token: process.env.api_token,
      },
    });
    team.data.data.squad.data.map((player) =>
      player_ids_list.push(player.player_id)
    );
    return player_ids_list;
  }

async function getCoachNameByTeam(team_id){
    let coach_name = "";
    const team = await axios.get(`${api_domain}/teams/${team_id}`, {
      params: {
        include: "coach",
        api_token: process.env.api_token,
      },
    });
    coach_name = team.data.data.coach.data.fullname;
    return coach_name;
  }

async function getTeamsInfo(teams_ids_list){
  let promises = [];
  teams_ids_list.map((id) =>
    promises.push(
      axios.get(`${api_domain}/teams/${id}`, {
        params: {
          api_token: process.env.api_token,
        },
      })
    )
  );
  let teams_info = await Promise.all(promises);
  
  return teams_info;
}

function extractTeamDetails(teams_info) {
  return teams_info.map((teams_info) => {
    const { name, logo_path, founded, national_team } = teams_info.data.data;
    const county_name = teams_info.data.data.country.data.name;
    return {
      name: name,
      logo_path: logo_path,
      county_name: county_name,
      founded: founded, 
      national_team: national_team
    };
  });
}

exports.getPlayersByTeam = getPlayersByTeam;
exports.getCoachNameByTeam= getCoachNameByTeam;
exports.getTeamsInfo = getTeamsInfo;
exports.extractTeamDetails = extractTeamDetails;