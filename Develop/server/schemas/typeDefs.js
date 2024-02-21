const typeDefs = `
type Query {
    me: User
}

input BookInput {
    title: String
    authors: [String]
    description: String
    image: String
    link: String
}

type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(bookData: BookInput!): User
    removeBook(bookId: String!): User
}

type User {
    _id: ID
    username: String
    email: String
    bootCount: Int
    savedBooks: [Book]
}

type Book {
    bookId: ID
    authors: [String]
    description: String
    title: String
    image: String
    link: String
}

type Auth {
    tokern: ID!
    user: User
}`;

module.exports = typeDefs