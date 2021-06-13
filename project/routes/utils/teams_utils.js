const axios = require("axios");
const e = require("express");
const { trace } = require("../teams");
const api_domain = "https://soccer.sportmonks.com/api/v2.0";
const players_utils = require("./players_utils");
const DButils = require("./DButils");

async function getPlayersByTeam(team_id) {
  //get all players data by team ID
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
  // coach_name = team.data.data.coach.data.fullname;
  // coach_id = team.data.data.coach.data.coach_id;
  const { fullname, coach_id, image_path } = team.data.data.coach.data;
  return {
    coach_name: fullname,
    coach_id: coach_id,
    image: image_path,
  };
}

async function getTeamsInfo(teams_ids_list) {
  let promises = [];
  teams_ids_list.map((row) => {
    try {
      promises.push(
        axios.get(`${api_domain}/teams/${row.teamID}`, {
          params: {
            include: "league, country, coach",
            api_token: process.env.api_token,
          },
        })
      );
    } catch {}
  });
  let teams_info;
  try {
    teams_info = await Promise.all(promises);
  } catch {
    return false;
  }

  return teams_info;
}

function extractTeamDetails(teams_info) {
  //get details from team info- filtering relevant data
  const teamData = teams_info.map((teams_info) => {
    const { id, name, logo_path, founded, national_team } =
      teams_info.data.data;
    const county_name = teams_info.data.data.country.data.name;
    const leagueID = teams_info.data.data.league.data.id;
    const coach_name = teams_info.data.data.coach.data.fullname;
    return {
      teamID: id,
      name: name,
      logo_path: logo_path,
      county_name: county_name,
      founded: founded,
      national_team: national_team,
      leagueID: leagueID,
      coach_name: coach_name,
    };
  });
  return (filterdteamsData = teamData.filter((team) => {
    try {
      if (team.leagueID == 271) {
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }));
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
    await DButils.execQuery(`select game_id,game_date, game_hour, home_team, away_team, home_team_id, away_team_id, field \
  from dbo.games WHERE home_team = '${name}' OR away_team = '${name}'  ORDER BY game_date ASC`);
  return TeamGames;
}

async function checkIfTeamExist(team_id) {
  //check if team exist for add game, add fav
  try {
    const team = await axios.get(`${api_domain}/teams/${team_id}`, {
      params: {
        include: "league",
        api_token: process.env.api_token,
      },
    });
    if (team.data.data.league.data.id == 271) {
      return true;
    }
    return false;
  } catch {
    return false;
  }
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

async function getTeamNameById(team_id) {
  const team = await axios.get(`${api_domain}/teams/${team_id}`, {
    params: {
      api_token: process.env.api_token,
    },
  });
  return team.data.data.name;
}

async function checkPlayerInTeam(player_id, home_team_id, away_team_id) {
  //find players in team for game add
  try {
    const squad_team1 = await getPlayerIdsByTeam(home_team_id);
    const squad_team2 = await getPlayerIdsByTeam(away_team_id);
    if (squad_team1.find((x) => x === player_id)) {
      return true;
    }
    if (squad_team2.find((x) => x === player_id)) {
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

exports.getPlayersByTeam = getPlayersByTeam;
exports.getCoachNameByTeam = getCoachNameByTeam;
exports.getTeamsInfo = getTeamsInfo;
exports.extractTeamDetails = extractTeamDetails;
exports.getTeamGames = getTeamGames;
exports.getTeamByName = getTeamByName;
// exports.checkTeamLeague = checkTeamLeague;
exports.checkIfTeamExist = checkIfTeamExist;
exports.getTeamNameById = getTeamNameById;
exports.checkPlayerInTeam = checkPlayerInTeam;
