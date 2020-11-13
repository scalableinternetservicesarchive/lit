import { ApolloClient, gql } from '@apollo/client'
import { WorkPost, WorkPostVariables } from '../../graphql/query.gen'

const workPost = gql`
  mutation WorkPost($workUserIdPost: Int!, $workTitlePost: String!, $workSummaryPost: String!) {
    createWork(workUserID: $workUserIdPost, workTitle: $workTitlePost, workSummary: $workSummaryPost)
  }
`

export function postWork(
  client: ApolloClient<any>,
  input: { workUserIdPost: number; workTitlePost: string; workSummaryPost: string }
) {
  return client.mutate<WorkPost, WorkPostVariables>({
    mutation: workPost,
    variables: input,
  })
}

// export function nextSurveyQuestion(surveyId: number) {
//   return getApolloClient().mutate<NextSurveyQuestion, NextSurveyQuestionVariables>({
//     mutation: nextSurveyQuestionMutation,
//     variables: { surveyId },
//   })
// }
