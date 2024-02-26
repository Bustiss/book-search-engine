const { User, Book } = require('../models');

const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

const resolvers = {

  Query: {
    // get single user by either their id or their username
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id })
          .select('-__v -password')
          .populate('savedBooks');

        return userData;
      }

      throw new AuthenticationError('Not logged in');
    },
  },

  Mutation: {
    // login a user with a username and password
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const token = signToken(user);
      return { token, user };
    },

    // add a user to the database
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);

      return { token, user };
    },

    // remove a book from `savedBooks`
    removeBook: async (parent, { bookId }, context) => {
      if (context.user) {
        const updatedBooks = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        );

        return updatedBooks;
      }

      throw new AuthenticationError('You need to be logged in!');
    },

    // add a book to `savedBooks`
    saveBook: async (parent, { bookToSave }, context) => {
      if (context.user) {
        const updatedBooks = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedBooks: bookToSave } },
          { new: true }
        ).populate('savedBooks');

        return updatedBooks;
      }

      throw new AuthenticationError('You need to be logged in!');
    },
  },
};

module.exports = resolvers;