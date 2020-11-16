import { gql } from '@apollo/client'

export const fetchBookmark = gql`
  query FetchBookmark {
    bookmarks {
      id
      user {
        id
      }
      work {
        title
        id
      }
    }
  }
`
