import { gql } from '@apollo/client'

export const fetchWorksWritten = gql`
  query FetchWorksWritten($userID: Int!) {
    user(userID: $userID) {
      works {
        id
        title
        chapters {
          id
        }
      }
    }
  }
`
