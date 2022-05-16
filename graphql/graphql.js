const { ApolloServer, gql } = require('apollo-server-lambda');
const { ApolloServerPluginLandingPageGraphQLPlayground } = require('apollo-server-core');

const playerService = require('./services/player-service');
const gameResultService = require('./services/game-result-service');

// Construct a schema, using GraphQL schema language
const typeDefs = gql`

  type Player {
    playerID: String!
    name: String!
    wins: Int
    losses: Int
    winLossRatio: Float
  }

  type GameResult {
    gameResultID: String!
    players: [Player]
    winnerIDs: [String]
    resultDate: String!
  }

  type Query {
    topPlayers(count: Int): [Player]
    allPlayers: [Player]
    allGameResults: [GameResult]
  }

  type Mutation {
    addPlayer(name: String!): Player
    newGameResult(playerIDs: [String]!, winnerIDs: [String], resultDate: String!): GameResult
  }
`;

const resolvers = {
  Query: {
    topPlayers: async (parent, args, context, info) => {
      let players = await playerService.getTopPlayers(args.count);
      return players;
    },
    allPlayers: async () => {
      let players = await playerService.getAllPlayers();
      return players;
    },
    allGameResults: async () => {
      let gameResults = await gameResultService.getAllGameResults();
      return gameResults;
    }
  },
  Mutation: {
    addPlayer: async (root, args, context) => {
      let player = await playerService.addPlayer(args.name);
      return player;
    },
    newGameResult: async (root, args, context) => {
      let gameResult = await gameResultService.newGameResult(args.playerIDs, args.winnerIDs, args.resultDate);
      return gameResult;
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,

  // By default, the GraphQL Playground interface and GraphQL introspection
  // is disabled in "production" (i.e. when `process.env.NODE_ENV` is `production`).
  //
  // If you'd like to have GraphQL Playground and introspection enabled in production,
  // install the Playground plugin and set the `introspection` option explicitly to `true`.
  introspection: true,
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
});

exports.handler = server.createHandler();
