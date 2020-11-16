import { ApolloClient, gql } from '@apollo/client'
import { WorkDel, WorkDelVariables } from '../../graphql/query.gen'

const workDel = gql`
  mutation WorkDel($workID: Int!) {
    deleteWork(workID: $workID)
  }
`

export function delWork(client: ApolloClient<any>, input: { workID: number }) {
  return client.mutate<WorkDel, WorkDelVariables>({
    mutation: workDel,
    variables: input,
  })
}