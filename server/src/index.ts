import { ApolloServer, makeExecutableSchema } from 'apollo-server-express';
import express from 'express';
import mongoose from 'mongoose';
import keys from './config/keys';

const app = express();

const schema = makeExecutableSchema({
  typeDefs: [],
  resolvers: null
});

const server = new ApolloServer({
  schema,
  introspection: true,
  playground: true
});

const dbConnectionString =
  process.env.NODE_ENV === 'production'
    ? `mongodb+srv://${keys.dbUser}:${keys.dbPassword}@ravikcluster-aiykj.mongodb.net/chain-reaction?retryWrites=true&w=majority`
    : 'mongodb://localhost/chain-reaction_db';

mongoose.set('useFindAndModify', false);
mongoose
  .connect(dbConnectionString, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('Connected to MongoDB');
    server.applyMiddleware({ app, path: server.graphqlPath });
    app.listen({ port: keys.port }, () => console.log(`Server ready at ${keys.port}`));
  })
  .catch(() => console.log('Error while connecting to MongoDB'));
