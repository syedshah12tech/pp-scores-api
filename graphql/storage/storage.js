const { DynamoDB } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocument } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDB({});
const ddbDocClient = DynamoDBDocument.from(client);

let PLAYERS_TABLE = process.env.PLAYERS_TABLE

const addOrUpdatePlayer = async(playerID, data) => {
  let result = await ddbDocClient.put({
    TableName: PLAYERS_TABLE,
    Item: {
      playerID: playerID,
      ...data
    },
  });
  return result;
}
module.exports.addOrUpdatePlayer = addOrUpdatePlayer;