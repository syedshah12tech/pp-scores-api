const { ApolloServer, gql } = require('apollo-server-lambda');
const { ApolloServerPluginLandingPageGraphQLPlayground } = require('apollo-server-core');

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type HighScore {
    player: String
    score: Int
  }

  type Player {
    id: String!
    name: String!
  }

  type GameResult {
    id: String!
    players: [Player]
    winners: [Player]
    resultDate: String!
  }

  type Query {
    hello: String,
    highScores: [HighScore]
  }

  type Mutation {
    addPlayer(name: String!): Player
    newGameResult(playerIDs: [String]!): GameResult
  }
`;

const highScores = [
  {
    player: 'player1',
    score: 200
  },
  {
    player: 'player2',
    score: 150
  }
]
// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    hello: () => 'Hello world!',
    highScores: () => highScores
  },
  Mutation: {
    addPlayer: async (root, args, context) => {
      return {
        id: 'id_p1',
        name: args.name
      };
    },
    newGameResult: async (root, args, context) => {
      console.log('Players: ', args.players);
      return {
        id: 'id_gr_1'
      }
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
