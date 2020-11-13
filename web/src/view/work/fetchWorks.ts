import { gql } from '@apollo/client'

export const fetchWork = gql`
  query FetchWork($workID: Int!) {
    work(workID: $workID) {
      title
      user {
        name
      }
      chapters{
        id
      }
    }
  }
`