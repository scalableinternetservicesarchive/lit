import { gql } from '@apollo/client'

export const fetchWork = gql`
  query FetchWork($workID: Int!) {
    work(workID: $workID) {
      title
      summary
      user {
        name
        id
      }
      chapters{
        id
        text
        title
      }
    }
  }
`


export const fetchWorks = gql`
  query FetchWorks {
    works {
      id
      title
      summary
      user {
        name
      }
    }
  }
`
