const axios = require("axios");
const e = require("express");
const api_domain = "https://soccer.sportmonks.com/api/v2.0";
const teams_utils = require("./teams_utils");

// const TEAM_ID = "85";

async function getPlayersInfo(players_ids_list) {
  try {
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
  } catch {
    return false;
  }

  // return extractRelevantPlayerData(players_info);
}

function extractDetailsForTeamPage(players_info) {
  //return player data from player info- extract
  return players_info.map((player_info) => {
    const {
      player_id,
      fullname,
      image_path,
      common_name,
      nationality,
      birthdate,
    } = player_info.data.data;
    return {
      PlayerID: player_id,
      name: fullname,
      image: image_path,
      common_name: common_name,
      nationality: nationality,
      birthdate: birthdate,
    };
  });
}

function extractRelevantPlayerData(players_info, player_original_name = null) {
  //extract the relevant data from player api get data
  if (player_original_name) {
    player_original_name = player_original_name.split(" ");
  }
  return players_info.map((player_info) => {
    try {
      let playerPosition, leagueID, team, team_id;
      const {
        player_id,
        fullname,
        common_name,
        position_id,
        nationality,
        birthdate,
        birthplace,
        height,
        weight,
        image_path,
      } = player_info;
      try {
        playerPosition = player_info.position.data.name;
      } catch {
        playerPosition = null;
      }
      try {
        leagueID = player_info.team.data.league.data.id;
      } catch {
        leagueID = null;
      }
      try {
        team = player_info.team.data.name;
        team_id = player_info.team.data.id;
      } catch {
        team = null;
      }
      const hasLastname = player_original_name[1];
      if(hasLastname && !fullname.includes(player_original_name[1])){//full name contains last name
        return false;
      }
      if (!fullname.includes(player_original_name[0])) {
        return false;
      }
      
      return {
        PlayerID: player_id,
        common_name: common_name,
        fullname: fullname,
        nationality: nationality,
        birthdate: birthdate,
        birthplace: birthplace,
        height: height,
        weight: weight,
        playerPosition: playerPosition,
        position_id: position_id,
        team: team,
        team_id: team_id,
        leagueID: leagueID,
        image_path: image_path,
      };
    } catch {
      return "player not found";
    }
  });
}

async function getPlayerDetailsById(player_id) {
  //get player data from Football-API
  try {
    // let playerInfo = await getPlayersInfo([player_id]);
    // const players = [playerInfo[0].data.data];
    // let PlayerDetails = extractRelevantPlayerData(players)[0];
    // const leagueID = PlayerDetails.leagueID;
    // if(leagueID != 271){
    //   return "The Player is not in league 271";
    // }
    // return PlayerData;
    const player = await axios.get(`${api_domain}/players/${player_id}`, {
      params: {
        include: "team.league",
        api_token: process.env.api_token,
      },
    });
    const {
      fullname,
      image_path,
      common_name,
      position_id,
      nationality,
      height,
      weight,
      birthcountry,
      birthdate,
      id,
    } = player.data.data;
    const { name } = player.data.data.team.data;
    const team_id = player.data.data.team.data.id;
    const leagueID = player.data.data.team.data.league.data.id;
    if (leagueID != 271) {
      return "The Player is not in league 271";
    }
    return {
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
      team_id: team_id,
      weight: weight,
    };
  } catch (err) {
    return false;
  }
}

async function getPlayerByName(playerName) {
  //seach by name only
  const query = `${api_domain}/players/search/${playerName}`;
  const players = await axios.get(query,
    {
      params: {
        include: "team.league",
        api_token: process.env.api_token,
      },
    }
  );
  try {
    const playersData = extractRelevantPlayerData(
      players.data.data,
      playerName
    );
    const filterdPlayersData = playersData.filter((player) => {
      try {
        if (player.leagueID == 271) {
          return true;
        }
        return false;
      } catch {
        return false;
      }
    });
    return filterdPlayersData;
  } catch {
    return "players not found";
  }
}

async function getPlayerByNameLocation(playerName, PlayerPosition) {
  //seach by name &position
  const players = await axios.get(
    `${api_domain}/players/search/${playerName}`,
    {
      params: {
        include: "position, team.league",
        api_token: process.env.api_token,
      },
    }
  );
  try {
    const playersData = extractRelevantPlayerData(
      players.data.data,
      playerName
    );
    if (PlayerPosition != "{location}") {
      const filterdPlayersData = playersData.filter((player) => {
        try {
          if (
            player.playerPosition == PlayerPosition &&
            player.leagueID == 271
          ) {
            return true;
          }
          return false;
        } catch {
          return false;
        }
      });
      return filterdPlayersData;
    }
    return playersData;
  } catch {
    return "players not found";
  }
}

async function getPlayerByNameTeam(playerName, team) {
  //seach by name & team
  const players = await axios.get(
    `${api_domain}/players/search/${playerName}`,
    {
      params: {
        include: "team, team.league",
        api_token: process.env.api_token,
      },
    }
  );
  try {
    const playersData = extractRelevantPlayerData(
      players.data.data,
      playerName
    );
    if (team != "{team}") {
      const filterdPlayersData = playersData.filter((player) => {
        try {
          if (player.team == team && player.leagueID == 271) {
            return true;
          }
          return false;
        } catch {
          return false;
        }
      });
      return filterdPlayersData;
    }
    return playersData;
  } catch {
    return "players not found";
  }
}

async function getPlayerByNameLocationTeam(playerName, location, team) {
  //seach by name & team & location
  const players = await axios.get(
    `${api_domain}/players/search/${playerName}`,
    {
      params: {
        include: "team, position, team.league",
        api_token: process.env.api_token,
      },
    }
  );
  try {
    const playersData = extractRelevantPlayerData(
      players.data.data,
      playerName
    );
    if (team != "{team}" && location != "{location}") {
      const filterdPlayersData = playersData.filter((player) => {
        try {
          if (
            player.team == team &&
            player.playerPosition == location &&
            player.leagueID == 271
          ) {
            return true;
          }
          return false;
        } catch {
          return false;
        }
      });
      return filterdPlayersData;
    }
    return playersData;
  } catch {
    return "players not found";
  }
}

async function checkIfPlayerExist(playerID) {
  //check if player exist in soccer db by id
  try {
    const player = await axios.get(`${api_domain}/players/${playerID}`, {
      params: {
        api_token: process.env.api_token,
        include: "team.league",
      },
    });
    if (player.data.data.team.data.league.data.id == 271) {
      return true;
    }
    return false;
  } catch {
    return false;
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
exports.checkIfPlayerExist = checkIfPlayerExist;

// function extractRelevantPlayerDataLocation(players_info){

//   return players_info.map((player_info) => {
//     try{
//       const { common_name , nationality, birthdate, birthplace, height, weight } = player_info;
//       const playerPosition = player_info.position.data.name;
//       const leagueID = player_info.team.data.league.data.id;

//       return {
//         common_name: common_name,
//         nationality: nationality,
//         birthdate: birthdate,
//         birthplace: birthplace,
//         height: height,
//         weight: weight,
//         playerPosition: playerPosition,
//         leagueID: leagueID,
//         // team: team,
//       }
//     }
//     catch{
//       return "player not found";
//     }
//   });
// }

// function extractRelevantPlayerDataTeam(players_info){

//   return players_info.map((player_info) => {
//     try{
//       const { common_name , nationality, birthdate, birthplace, height, weight } = player_info;
//       const team = player_info.team.data.name;
//       const leagueID = player_info.team.data.league.data.id;

//       return {
//         common_name: common_name,
//         nationality: nationality,
//         birthdate: birthdate,
//         birthplace: birthplace,
//         height: height,
//         weight: weight,
//         team: team,
//         leagueID: leagueID,
//       }
//     }
//     catch{
//       return "player not found";
//     }
//   });
// }

// function extractRelevantPlayerDataTeamLocation(players_info){

//   return players_info.map((player_info) => {
//     try{
//       const { common_name , nationality, birthdate, birthplace, height, weight } = player_info;
//       const team = player_info.team.data.name;
//       const playerPosition = player_info.position.data.name;
//       const leagueID = player_info.team.data.league.data.id;

//       return {
//         common_name: common_name,
//         nationality: nationality,
//         birthdate: birthdate,
//         birthplace: birthplace,
//         height: height,
//         weight: weight,
//         team: team,
//         playerPosition: playerPosition,
//         leagueID: leagueID,
//       }
//     }
//     catch{
//       return "player not found";
//     }
//   });
// }
