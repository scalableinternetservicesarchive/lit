import { ApolloClient, gql } from '@apollo/client'
import { ChapterDel, ChapterDelVariables } from '../../graphql/query.gen'

const chapterDel = gql`
  mutation ChapterDel($chapterID: Int!) {
    deleteChapter(chID: $chapterID)
  }
`

export function delChapter(client: ApolloClient<any>, input: { chapterID: number }) {
  return client.mutate<ChapterDel, ChapterDelVariables>({
    mutation: chapterDel,
    variables: input,
  })
}