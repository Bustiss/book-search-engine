import { gql } from '@apollo/client'

// Will hold the query GET_ME, which will execute the me query set up using Apollo Server
export const QUERY_ME = gql`
    query me {
        me {
            _id
            username
            email
            savedBooks {
                bookId
                author
                description
                title
                image
                link
            }
        }
    }
`;