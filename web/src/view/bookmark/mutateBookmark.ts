import { ApolloClient, gql } from '@apollo/client'
import { BookmarkCreate, BookmarkCreateVariables, BookmarkDel, BookmarkDelVariables } from '../../graphql/query.gen'

const bookmarkDel = gql`
  mutation BookmarkDel($bookmarkID: Int!) {
    deleteBookmark(bookmarkID: $bookmarkID)
  }
`

const bookmarkCreate = gql`
  mutation BookmarkCreate($userID: Int!, $workID: Int!) {
    createBookmark(userID: $userID, workID: $workID)
  }
`

export function delBookmark(client: ApolloClient<any>, input: { bookmarkID: number }) {
  return client.mutate<BookmarkDel, BookmarkDelVariables>({
    mutation: bookmarkDel,
    variables: input,
  })
}

export function createBookmark(
  client: ApolloClient<any>,
  input: { userID: number; workID: number }) {
  return client.mutate<BookmarkCreate, BookmarkCreateVariables>({
    mutation: bookmarkCreate,
    variables: input,
  })
}