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
/*
query check($title: String) {
  targetWorks(targetWork: $title) {
    id
    title
    summary
    user {
      name
    }
  }
}
*/
export const fetchWorksSearch = gql`
  query FetchWorksSearch($searchTitle: String) {
    targetWorks(targetWork: $searchTitle) {
      id
      title
      summary
      user {
        name
      }
    }
  }
`