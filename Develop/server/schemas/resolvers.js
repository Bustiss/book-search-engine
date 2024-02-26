// import the User model and the signToken function from the auth.js file
const { User } = require ('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    // get a single user by either their id or their username
    me: async (parent, args, context) => {
      if (context.user) {
        const user = await User.findById(context.user._id).populate('savedBooks');

        return user;
      } 

        throw new AuthenticationError('Not logged in');

    }
  },

  Mutation: { 
    // create a new user
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);

      return { token, user };
    },

    // create a user, sign a token, and send it back (to client/src/components/SignUpForm.js)
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if(!user) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw AuthenticationError;
      }

      const token = signToken(user);

      return { token, user };
    }
  },

  // save a book to a user's `savedBooks` field by adding it to the set (to prevent duplicates)
  saveBook: async (parent, { bookData }, context ) => {
    if (context.user) {
      const updatedUser = await User.findByIdAndUpdate(
        { _id: context.user._id },
        { $addToSet: { savedBooks: bookData }},
        { new: true }
      );

      return updatedUser;
    }

      throw new Error('Authentication error');
  },

  // remove a book from `savedBooks`
  removeBook: async (parent, { bookId }, context) => {
    if (context.user) {
      const updatedUser = await User.findByIdAndUpdate(
        { _id: context.user._id },
        { $pull: { savedBooks: { bookId }}},
        { new: true }
      );

      return updatedUser;
    }

      throw new AuthenticationError('You need to be logged in!');
  }
}