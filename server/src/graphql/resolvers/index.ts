import { createRoom, getRooms } from './room.resolver';
const Mutation = {
  // Room Mutations
  createRoom
};

const Query = {
  // Room Queries
  getRooms
};

const resolvers = { Query, Mutation };

export default resolvers;
