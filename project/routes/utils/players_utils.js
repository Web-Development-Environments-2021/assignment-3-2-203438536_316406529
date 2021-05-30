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
          include: "team",
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
      const { common_name , nationality, birthdate, birthplace, height, weight } = player_info;
      return {
        common_name: common_name,
        nationality: nationality,
        birthdate: birthdate,
        birthplace: birthplace,
        height: height,
        weight: weight,
      };
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
      include: "team",
      api_token: process.env.api_token,
    },
  });
  const {fullname, image_path, common_name, position_id, nationality, height, 
    weight, birthcountry,  birthdate } = player.data.data;
  const { name } = player.data.data.team.data;
  return{
    fullname: fullname,
    image_path: image_path,
    common_name: common_name,
    position_id: position_id,
    nationality: nationality,
    height: height,
    birthcountry: birthcountry,
    birthdate: birthdate,
    team_name: name,
    weight: weight//check how to hundle undefine weight for player(client side or player.js)
  };
}

async function getPlayerByName(playerName){
  const players = await axios.get(`${api_domain}/players/search/${playerName}`, {
    params: {
      api_token: process.env.api_token,
    },
  });
  try{
    return extractRelevantPlayerData(players.data.data);
  } catch{
    return "players not found";
  }
}

async function getPlayersByPosition(positionId){
  const players = await axios.get(`${api_domain}/players`)
}

exports.getPlayersInfo = getPlayersInfo;
exports.extractDetailsForTeamPage = extractDetailsForTeamPage;
exports.extractRelevantPlayerData = extractRelevantPlayerData;
exports.getPlayerDetailsById = getPlayerDetailsById;
exports.getPlayerByName = getPlayerByName;