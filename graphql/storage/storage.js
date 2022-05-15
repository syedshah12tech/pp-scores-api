const { DynamoDB } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocument } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDB({});
const ddbDocClient = DynamoDBDocument.from(client);

let PLAYERS_TABLE = process.env.PLAYERS_TABLE;
let GAME_RESULTS_TABLE = process.env.GAME_RESULTS_TABLE;

let DEFAULT_PLAYER_PROJECTION = "playerID, #n, wins, losses, winLossRatio";
let DEFAULT_PLAYER_EXPRESSION_ATTRIBUTE_NAMES = {"#n": "name"};

const addOrUpdatePlayer = async (player) => {
  await ddbDocClient.put({
    TableName: PLAYERS_TABLE,
    Item: player
  });

  return player;
}
module.exports.addOrUpdatePlayer = addOrUpdatePlayer;

const getPlayer = async (playerID) => {
  let response = await ddbDocClient.get({
    TableName: PLAYERS_TABLE,
    Key: {
      playerID: playerID
    },
    ProjectionExpression: DEFAULT_PLAYER_PROJECTION,
    ExpressionAttributeNames: DEFAULT_PLAYER_EXPRESSION_ATTRIBUTE_NAMES
  });
  return response.Item;
}
module.exports.getPlayer = getPlayer;

const addGameResult = async (gameResult) => {
  await ddbDocClient.put({
    TableName: GAME_RESULTS_TABLE,
    Item: gameResult
  });

  return gameResult
}
module.exports.addGameResult = addGameResult;

const topPlayersByWinLossRatio = async (limit = 10) => {
  let response = await ddbDocClient.query({
    KeyConditionExpression: "wlRatioInterval = :v1",
    ExpressionAttributeValues: {
      ":v1": "ALL"
    },
    Limit: limit,
    TableName: PLAYERS_TABLE,
    IndexName: "wlRatioInterval", // FIXME: Get from env
    ScanIndexForward: false,
    ProjectionExpression: DEFAULT_PLAYER_PROJECTION,
    ExpressionAttributeNames: DEFAULT_PLAYER_EXPRESSION_ATTRIBUTE_NAMES 
  });
 
  return response.Items;
}
module.exports.topPlayersByWinLossRatio = topPlayersByWinLossRatio;

const allPlayers = async () => {
  let response = await ddbDocClient.scan({
    TableName: PLAYERS_TABLE,
    ProjectionExpression: DEFAULT_PLAYER_PROJECTION,
    ExpressionAttributeNames: DEFAULT_PLAYER_EXPRESSION_ATTRIBUTE_NAMES
  });
  return response.Items;
}
module.exports.allPlayers = allPlayers;
