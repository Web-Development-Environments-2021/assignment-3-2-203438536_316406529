
const axios = require("axios");
const e = require("express");
const api_domain = "https://soccer.sportmonks.com/api/v2.0";
const teams_utils = require("./teams_utils");

// const TEAM_ID = "85";



async function getPlayersInfo(players_ids_list) {
  let promises = [];
  players_ids_list.map((id) =>
    promises.push(
      axios.get(`${api_domain}/players/${id}`, {
        params: {
          api_token: process.env.api_token,
          include: "team.league",
        },
      })
    )
  );
  let players_info = await Promise.all(promises);
  
  return players_info;
  // return extractRelevantPlayerData(players_info);
}

function extractDetailsForTeamPage(players_info) {
  return players_info.map((player_info) => {
    const { fullname, image_path ,common_name, nationality, birthdate } = player_info.data.data;
    return {
      name: fullname,
      image: image_path,
      common_name: common_name,
      nationality: nationality, 
      birthdate: birthdate
    };
  });
}

function extractRelevantPlayerData(players_info){

  return players_info.map((player_info) => {
    try{
      const { common_name , nationality, birthdate, birthplace, height, weight } = player_info.data.data;
      // const playerPosition = player_info.position.data.name;
      const leagueID = player_info.data.data.team.data.league.data.id;
      return {
        common_name: common_name,
        nationality: nationality,
        birthdate: birthdate,
        birthplace: birthplace,
        height: height,
        weight: weight,
        leagueID: leagueID,
        // playerPosition: playerPosition,
        // team: team,
      }
    }
    catch{
      return "player not found";
    }
  });
}

function extractRelevantPlayerDataLocation(players_info){

  return players_info.map((player_info) => {
    try{
      const { common_name , nationality, birthdate, birthplace, height, weight } = player_info;
      const playerPosition = player_info.position.data.name;
      const leagueID = player_info.team.data.league.data.id;

      return {
        common_name: common_name,
        nationality: nationality,
        birthdate: birthdate,
        birthplace: birthplace,
        height: height,
        weight: weight,
        playerPosition: playerPosition,
        leagueID: leagueID,
        // team: team,
      }
    }
    catch{
      return "player not found";
    }
  });
}

function extractRelevantPlayerDataTeam(players_info){

  return players_info.map((player_info) => {
    try{
      const { common_name , nationality, birthdate, birthplace, height, weight } = player_info;
      const team = player_info.team.data.name;
      const leagueID = player_info.team.data.league.data.id;

      return {
        common_name: common_name,
        nationality: nationality,
        birthdate: birthdate,
        birthplace: birthplace,
        height: height,
        weight: weight,
        team: team,
        leagueID: leagueID,
      }
    }
    catch{
      return "player not found";
    }
  });
}

function extractRelevantPlayerDataTeamLocation(players_info){

  return players_info.map((player_info) => {
    try{
      const { common_name , nationality, birthdate, birthplace, height, weight } = player_info;
      const team = player_info.team.data.name;
      const playerPosition = player_info.position.data.name;
      const leagueID = player_info.team.data.league.data.id;

      return {
        common_name: common_name,
        nationality: nationality,
        birthdate: birthdate,
        birthplace: birthplace,
        height: height,
        weight: weight,
        team: team,
        playerPosition: playerPosition,
        leagueID: leagueID,
      }
    }
    catch{
      return "player not found";
    }
  });
}

async function getPlayerDetailsById(player_id){
  //get player data from Football-API
  const player = await axios.get(`${api_domain}/players/${player_id}`, {
    params: {
      include: "team.league",
      api_token: process.env.api_token,
    },
  });
  const {fullname, image_path, common_name, position_id, nationality, height, 
    weight, birthcountry,  birthdate, id } = player.data.data;
  const { name } = player.data.data.team.data;
  const leagueID = player.data.data.team.data.league.data.id;
  if(leagueID != 271){
    return "The Player is not in league 271";
  }
  return{
    id: id,
    fullname: fullname,
    image_path: image_path,
    common_name: common_name,
    position_id: position_id,
    nationality: nationality,
    height: height,
    birthcountry: birthcountry,
    birthdate: birthdate,
    team_name: name,
    weight: weight
  };
}

async function getPlayerByName(playerName){
  const players = await axios.get(`${api_domain}/players/search/${playerName}`, {
    params: {
      include: "team.league",
      api_token: process.env.api_token,
    },
  });
  try{
    // const playersData = extractRelevantPlayerData(players.data.data);
    // // if(PlayerPosition != "{location}"){
    // //   playersData =  playersData.filter(player => player.playerPosition == PlayerPosition);
    // // }
    // return playersData;
    const playersData = extractRelevantPlayerData([players]);
    const filterdPlayersData =  playersData.filter(player => {
      try{
        if(player.leagueID == 271){
          return true;
        }
        return false;
      }catch{
        return false;
      }
    });
    return filterdPlayersData;
  } catch{
    return "players not found";
  }
}

async function getPlayerByNameLocation(playerName,PlayerPosition){
  const players = await axios.get(`${api_domain}/players/search/${playerName}`, {
    params: {
      include: "position, team.league",
      api_token: process.env.api_token,
    },
  });
  try{
    const playersData = extractRelevantPlayerDataLocation(players.data.data);
    if(PlayerPosition != "{location}"){
        const filterdPlayersData =  playersData.filter(player => {
          try{
            if(player.playerPosition == PlayerPosition && player.leagueID == 271){
              return true;
            }
            return false;
          }catch{
            return false;
          }
        });
        return filterdPlayersData;
    }
    return playersData;
  } catch{
    return "players not found";
  }
}

async function getPlayerByNameTeam(playerName,team){
  const players = await axios.get(`${api_domain}/players/search/${playerName}`, {
    params: {
      include: "team, team.league",
      api_token: process.env.api_token,
    },
  });
  try{
    const playersData = extractRelevantPlayerDataTeam(players.data.data);
    if(team != "{team}"){
        const filterdPlayersData =  playersData.filter(player => {
          try{
            if(player.team == team  && player.leagueID == 271){
              return true;
            }
            return false;
          }catch{
            return false;
          }
        });
        return filterdPlayersData;
    }
    return playersData;
  } catch{
    return "players not found";
  }
}

async function getPlayerByNameLocationTeam(playerName,location,team){
  const players = await axios.get(`${api_domain}/players/search/${playerName}`, {
    params: {
      include: "team, position, team.league",
      api_token: process.env.api_token,
    },
  });
  try{
    const playersData = extractRelevantPlayerDataTeamLocation(players.data.data);
    if(team != "{team}" && location != "{location}"){
        const filterdPlayersData =  playersData.filter(player => {
          try{
            if(player.team == team && player.playerPosition == location && player.leagueID == 271){
              return true;
            }
            return false;
          }catch{
            return false;
          }
        });
        return filterdPlayersData;
    }
    return playersData;
  } catch{
    return "players not found";
  }
}



exports.getPlayersInfo = getPlayersInfo;
exports.extractDetailsForTeamPage = extractDetailsForTeamPage;
exports.extractRelevantPlayerData = extractRelevantPlayerData;
exports.getPlayerDetailsById = getPlayerDetailsById;
exports.getPlayerByName = getPlayerByName;
exports.getPlayerByNameLocation = getPlayerByNameLocation;
exports.getPlayerByNameTeam = getPlayerByNameTeam;
exports.getPlayerByNameLocationTeam = getPlayerByNameLocationTeam;