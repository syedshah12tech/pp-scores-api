const storage = require('../storage/storage');
const { v4: uuidv4 } = require('uuid');

let addPlayer = async(name) => {
  let playerID = uuidv4();
  let response = await storage.addOrUpdatePlayer(playerID, {
    name: name
  });
  // TODO: Check for errors here

  return playerID;
}

module.exports.addPlayer = addPlayer;