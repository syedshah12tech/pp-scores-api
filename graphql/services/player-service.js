const storage = require('../storage/storage');
const { v4: uuidv4 } = require('uuid');

let addPlayer = async (name) => {
  let playerID = uuidv4();
  let player = await storage.addOrUpdatePlayer({
    playerID: playerID,
    name: name
  });
  return player;
}
module.exports.addPlayer = addPlayer;

let getTopPlayers = async (count = 10) => {
  let topPlayers = await storage.topPlayersByWinLossRatio(count);
  return topPlayers;
}
module.exports.getTopPlayers = getTopPlayers;

let getAllPlayers = async () => {
  let players = await storage.allPlayers();
  return players;
}
module.exports.getAllPlayers = getAllPlayers;