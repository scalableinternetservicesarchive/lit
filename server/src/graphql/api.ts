import { readFileSync } from 'fs'
import { PubSub } from 'graphql-yoga'
import path from 'path'
import { check } from '../../../common/src/util'
import { Chapter } from '../entities/Chapter'
import { Survey } from '../entities/Survey'
import { SurveyAnswer } from '../entities/SurveyAnswer'
import { SurveyQuestion } from '../entities/SurveyQuestion'
import { User } from '../entities/User'
import { Work } from '../entities/Work'
import { Resolvers } from './schema.types'

export const pubsub = new PubSub()

export function getSchema() {
  const schema = readFileSync(path.join(__dirname, 'schema.graphql'))
  return schema.toString()
}

interface Context {
  user: User | null
  request: Request
  response: Response
  pubsub: PubSub
}

export const graphqlRoot: Resolvers<Context> = {
  Query: {
    self: (_, args, ctx) => ctx.user,
    survey: async (_, { surveyId }) => (await Survey.findOne({ where: { id: surveyId } })) || null,
    surveys: () => Survey.find(),
    user: async (_, { userID }) => (await User.findOne({ where: { id: userID } })) || null,
    users: () => User.find(),
    // the {workID} is specific to the parameter set within query type of schema.graphql. id is specific to the column name within the database created by Work.ts
    // TODO: ask why the following is the case? --> the following does not work anymore once I put the many-to-one relation inside the work.ts file
    // answer: you didn't run "npm run gen" after modifying the schema.graphql file. And usually the schema in the schema.graphql doesn't match the schema specified in the files of the entities folder if the schema.graphql doesn't seem to be the problem.
    work: async (_, { workID }) => (await Work.findOne({ where: { id: workID } })) || null,
    // TODO: tried executing the following, but it wouldn't work. It would work if I took out the "user {...},". How can we query user from work?
    // This is important because we need to learn how to access the user from the work
    // {
    //   work(workID: 1) {
    //     id,
    //     title,
    //     user {
    //       name
    //     },
    //   }
    // }

    // The "chapter..." query below works, but I don't think we'd ever need it for a get request since we would just access it via the "work" endpoint by doing something like.
      // TODO: but also we need to find a way to access a chapter directly without having to route through work first. basically you need to find a way to access the id of the work as well when doing a chapter request
    // {
    //   work(workID: 1) {
    //     id,
    //     title,
    //     chapters {
    //       id,
    //       ...
    //     },
    //   }
    // }
    chapter: async (_, { chID }) => (await Chapter.findOne({ where: { chapterID: chID } })) || null,
  }, // select * from chapter where chapterID = <user input>
  Mutation: {
    answerSurvey: async (_, { input }, ctx) => {
      const { answer, questionId } = input
      const question = check(await SurveyQuestion.findOne({ where: { id: questionId }, relations: ['survey'] }))

      const surveyAnswer = new SurveyAnswer()
      surveyAnswer.question = question
      surveyAnswer.answer = answer
      await surveyAnswer.save()

      question.survey.currentQuestion?.answers.push(surveyAnswer)
      ctx.pubsub.publish('SURVEY_UPDATE_' + question.survey.id, question.survey)

      return true
    },
    nextSurveyQuestion: async (_, { surveyId }, ctx) => {
      // check(ctx.user?.userType === UserType.Admin)
      const survey = check(await Survey.findOne({ where: { id: surveyId } }))
      survey.currQuestion = survey.currQuestion == null ? 0 : survey.currQuestion + 1
      await survey.save()
      ctx.pubsub.publish('SURVEY_UPDATE_' + surveyId, survey)
      return survey
    },
  },
  Subscription: {
    surveyUpdates: {
      subscribe: (_, { surveyId }, context) => context.pubsub.asyncIterator('SURVEY_UPDATE_' + surveyId),
      resolve: (payload: any) => payload,
    },
  },
}
