import { ApolloClient, gql } from '@apollo/client'
// import { getApolloClient } from '../../graphql/apolloClient'
import {
  ChapterInput, ChapterUpdate,
  ChapterUpdateVariables
} from '../../graphql/query.gen'

const chapterUpdate = gql`
  mutation ChapterUpdate(
    $input: ChapterInput!)
  {
    updateChapter(input: $input)
  }
`

// const nextSurveyQuestionMutation = gql`
//   mutation NextSurveyQuestion($surveyId: Int!) {
//     nextSurveyQuestion(surveyId: $surveyId) {
//       ...Survey
//     }
//   }
//   ${fragmentSurvey}
//   ${fragmentSurveyQuestion}
// `

export function updateChapter(client: ApolloClient<any>, input: ChapterInput) {
  return client.mutate<ChapterUpdate, ChapterUpdateVariables>({
    mutation: chapterUpdate,
    variables: { input },
  })
}

// export function nextSurveyQuestion(surveyId: number) {
//   return getApolloClient().mutate<NextSurveyQuestion, NextSurveyQuestionVariables>({
//     mutation: nextSurveyQuestionMutation,
//     variables: { surveyId },
//   })
// }
