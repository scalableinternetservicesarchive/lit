import { gql } from '@apollo/client'

export const fetchChapter = gql`
  query FetchChapter($chID: Int!) {
    chapter(chID: $chID) {
        id
        text,
        title
    }
  }
`