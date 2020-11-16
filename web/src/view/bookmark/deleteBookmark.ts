import { ApolloClient, gql } from '@apollo/client'
import { BookmarkDel, BookmarkDelVariables } from '../../graphql/query.gen'

const bookmarkDel = gql`
  mutation BookmarkDel($bookmarkID: Int!) {
    deleteBookmark(bookmarkID: $bookmarkID)
  }
`

export function delBookmark(client: ApolloClient<any>, input: { bookmarkID: number }) {
  return client.mutate<BookmarkDel, BookmarkDelVariables>({
    mutation: bookmarkDel,
    variables: input,
  })
}