const axios = require("axios");
const e = require("express");
const { trace } = require("../teams");
const api_domain = "https://soccer.sportmonks.com/api/v2.0";
const players_utils = require("./players_utils");
const DButils = require("./DButils");

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

async function getCoachNameByTeam(team_id) {
  let coach_name = "";
  const team = await axios.get(`${api_domain}/teams/${team_id}`, {
    params: {
      include: "coach",
      api_token: process.env.api_token,
    },
  });
  coach_name = team.data.data.coach.data.fullname;
  coach_id = team.data.data.coach.data.coach_id;
  return {coach_name, coach_id};
}

async function getTeamsInfo(teams_ids_list) {
  let promises = [];
  teams_ids_list.map((row) => {
    try{
      promises.push(
        axios.get(`${api_domain}/teams/${row.teamID}`, {
        params: {
          include: "league, country",
          api_token: process.env.api_token,
        },
      })
      )
    }
    catch{}

  });
  let teams_info;
  try{
    teams_info = await Promise.all(promises);
  }
  catch{return false;}


  return teams_info;

}

function extractTeamDetails(teams_info) {
  const teamData =  teams_info.map((teams_info) => {
    const { name, logo_path, founded, national_team } = teams_info.data.data;
    const county_name = teams_info.data.data.country.data.name;
    const leagueID =teams_info. data.data.league.data.id;
    return {
      name: name,
      logo_path: logo_path,
      county_name: county_name,
      founded: founded,
      national_team: national_team,
      leagueID: leagueID,
    };
  });
  return filterdteamsData =  teamData.filter(team => {
    try{
      if(team.leagueID == 271){
        return true;
      }
      return false;
    }catch{
      return false;
    }
  });
}

async function getTeamGames(team_id) {
  const team = await axios.get(`${api_domain}/teams/${team_id}`, {
    params: {
      api_token: process.env.api_token,
    },
  });
  // const team = await axios.get(`${api_domain}/teams/${team_id}`);

  const { name } = team.data.data;
  const TeamGames =
    await DButils.execQuery(`select game_date, game_hour, home_team, away_team, field \
  from dbo.games WHERE home_team = '${name}' AND away_team = '${name}'  ORDER BY game_date ASC`);
  return TeamGames;
}

async function checkIfTeamExist(team_id){
  try{
    const team = await axios.get(`${api_domain}/teams/${team_id}`, {
      params: {
        include: "league",
        api_token: process.env.api_token,
      },
    });
    if (team.data.data.league.data.id ==271){
      return true;
    }
    return false;
  }
  catch{return false;}
}

async function getTeamByName(teamName) {
  const teams = await axios.get(`${api_domain}/teams/search/${teamName}`, {
    params: {
      include: "league",
      api_token: process.env.api_token,
    },
  });
  try {
    const teamsData = teams.data.data.map((team) => {
      const { name, logo_path, id } = team;
      const leagueID = team.league.data.id;
      return {
        teamName: name,
        teamLogo: logo_path,
        leagueID: leagueID,
        TeamID: id,
      };
    });
    const filterdteamsData = teamsData.filter((team) => {
      try {
        if (team.leagueID == 271) {
          return true;
        }
        return false;
      } catch {
        return false;
      }
    });
    return filterdteamsData;
  } catch {
    return "team not found";
  }
}

// async function checkTeamLeague(teamID) {
//   const team = await axios.get(`${api_domain}/teams/${teamID}`, {
//     params: {
//       include: "league",
//       api_token: process.env.api_token,
//     },
//   });
//   const leagueID = team.data.data.league.data.id;
//   if (leagueID == 271) {
//     return true;
//   }
//   return false;
// }

exports.getPlayersByTeam = getPlayersByTeam;
exports.getCoachNameByTeam = getCoachNameByTeam;
exports.getTeamsInfo = getTeamsInfo;
exports.extractTeamDetails = extractTeamDetails;
exports.getTeamGames = getTeamGames;
exports.getTeamByName = getTeamByName;
// exports.checkTeamLeague = checkTeamLeague;
exports.checkIfTeamExist = checkIfTeamExist;