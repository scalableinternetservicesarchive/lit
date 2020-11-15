import { ApolloClient, gql } from '@apollo/client'
// import { getApolloClient } from '../../graphql/apolloClient'
import {
  ChapterInput,
  ChapterPost,
  ChapterPostVariables,
  ChapterUpdate,
  ChapterUpdateVariables
} from '../../graphql/query.gen'

const chapterPost = gql`
  mutation ChapterPost($workID: Int!, $chapterTitle: String!, $chapterText: String!)
  {
    addChapter(workID: $workID, chapterTitle: $chapterTitle, chapterText: $chapterText)
  }
`
const chapterUpdate = gql`
  mutation ChapterUpdate(
    $input: ChapterInput!)
  {
    updateChapter(input: $input)
  }
`

export function postChapter(
  client: ApolloClient<any>,
  input: {
    workID: number;
    chapterTitle: string;
    chapterText: string
  }) {
  return client.mutate<ChapterPost, ChapterPostVariables>({
    mutation: chapterPost,
    variables: input,
  })
}

export function updateChapter(client: ApolloClient<any>, input: ChapterInput) {
  return client.mutate<ChapterUpdate, ChapterUpdateVariables>({
    mutation: chapterUpdate,
    variables: { input },
  })
}