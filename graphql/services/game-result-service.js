const storage = require('../storage/storage');
const { v4: uuidv4 } = require('uuid');

/* TODO: Multiple calls in quick successions would create multiple entries. So this
    So this needs to be handled somehow. Possible approaches are to implement some
    sort of a time limit for example 5 minutes for same opponents based on date/time.
    Another approach is to introduce a client side game result ID
*/
let newGameResult = async(playerIDs, winnerIDs, resultDate) => {
  let gameResultID = uuidv4();

  let players = await getPlayers(playerIDs);
  validateWinners(playerIDs, winnerIDs, players);

  let gameResult = await storage.addGameResult({
    gameResultID: gameResultID,
    playerIDs: playerIDs,
    winnerIDs: winnerIDs,
    resultDate: resultDate
  });

  let {winners,losers} = getWinnersAndLosers(players, winnerIDs);
  winners.forEach( winner => handleWinner(winner) );
  losers.forEach( loser => handleLoser(loser));

  return gameResultDOToBO(gameResult, {
    players: players
  });
}
module.exports.newGameResult = newGameResult;

let handleWinner = async (winner) => {
  processWinLoss(winner, true);
  await storage.addOrUpdatePlayer(winner);
}
let handleLoser = async (loser) => {
  processWinLoss(loser, false);
  await storage.addOrUpdatePlayer(loser);
}

let processWinLoss = (player, isWin) => {
  // handle initializations if required
  player.wlRatioInterval = "ALL";
  if (!player.wins) {
    player.wins = 0;
  }
  if (!player.losses) {
    player.losses = 0;
  }  
  
  if (isWin) {
    player.wins++;
  }
  else {
    player.losses++;
  }

  // avoid division by zero
  if (player.losses === 0) {
    player.winLossRatio = player.wins;
  } else {
    player.winLossRatio = player.wins / player.losses;
  }
  return player;
}
module.exports.processWinLoss = processWinLoss;

let getPlayers = async (playerIDs) => {
  let promises = [];
  playerIDs.forEach(playerID => {
    promises.push(storage.getPlayer(playerID));
  });

  let players = await Promise.all(promises);
  players.forEach((player,i) => {
    if (!player) {
      throw new Error(`Player ID: ${playerIDs[i]} not found`);
    }
  });
  return players;
}

let validateWinners = (playerIDs, winnerIDs) => {
  if (winnerIDs.length > 2) {
    throw new Error('There can be a maxium of 2 winners in a game');
  }

  winnerIDs.forEach( winnerID => {
    if (!playerIDs.find(playerID => winnerID === playerID)) {
      throw new Error(`WinnerID: ${winnerID} not found in playerIDs list`);
    }
  });
}

let getWinnersAndLosers = (players, winnerIDs) => {
  let winners = [];
  let losers = [];
  for (let i = 0; i < players.length; i++) {
    if (winnerIDs.includes(players[i].playerID)) {
      winners.push(players[i]);
    } else {
      losers.push(players[i]);
    }
  }

  return {
    winners: winners,
    losers: losers
  }
}
module.exports.getWinnersAndLosers = getWinnersAndLosers;

let gameResultDOToBO = (gameResultDO, include) => {
  let gameResultBO = {
    ...gameResultDO,
    ...include
  }
  delete  gameResultBO.playerIDs;
  return gameResultBO;
}
module.exports.gameResultDOToBO = gameResultDOToBO;
