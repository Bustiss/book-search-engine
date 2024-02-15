// Define the query and mutation functionality to work with the Mongoose models
const { User } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth');

const resolvers = {
    Query: {
        // get all users
        users: async () => {
            return User.find().populate('savedBooks');
        },
        // get a user by username and populate their savedBooks
        user: async (parent, { username }) => {
            return User.findOne({ username }).populate('savedBooks');
        },
        // get all books saved by a specific user (person logged in or by username) 
        me: async (parent,args, context) => {
            if(context.user) {
                return User.findOne({ _id: context.user._id });
            }
            throw AuthenticationError('You need to be logged in!');
        },
    },

    Mutation: {
        addUser: async (parent, { username, email, password }) => {
            const user = await User.create({ username, email, password });
            const token = signToken(user);

            return { token, user };
        },
        // login a user, check to see if the user exists, and then verify their identity
        login: async (parent, { email, password}) => {
            const user = await User.findOne({ email});

            if(!user) {
                throw AuthenticationError('No user found with this email address');
            }

            const correctPw = await user.isCorrectPassword(password);

            if(!correctPw) {
                throw AuthenticationError('Incorrect Password');
            }

            const token = signToken(user);
            return { token, user };
        },

        // save a book to a user's `savedBooks` field by adding it to the set (to prevent duplicates)
        saveBook: async (parent, { bookData }, context) => {
            if(context.user) {
                const updatedUser = await User.findOneAndUpdate({ _id: context.user._id },
                    { $addToSet: { savedBooks: bookData } },
                    { new: true, runValidators: true }
                );
            }
            // if no user is found, return an error
            throw AuthenticationError('You need to be logged in!');
            } 
        },
        // remove a book from `savedBooks`
        removeBook: async (parent, {bookId}, context) => {
            if(context.user) {
                const updatedUser = await User.findOneAndUpdate(
                { _id: context.user._id },
                { $pull: { savedBooks: { bookId } } },
                { new: true });
                return updatedUser;
            }
            // if no user is found, return an error
            throw AuthenticationError('You need to be logged in!');
        },
    }

module.exports = resolvers;