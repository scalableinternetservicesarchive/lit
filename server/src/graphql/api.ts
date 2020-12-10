
import { readFileSync } from 'fs'
import { PubSub } from 'graphql-yoga'
import Redis from 'ioredis'
import path from 'path'
import { check } from '../../../common/src/util'
import { Survey } from '../entities/Survey'
import { SurveyAnswer } from '../entities/SurveyAnswer'
import { SurveyQuestion } from '../entities/SurveyQuestion'
import { User } from '../entities/User'
import { Work } from '../entities/Work'
import { Bookmark, Chapter, Resolvers, UserType } from './schema.types'

export const pubsub = new PubSub()
export const my_redis = new Redis()

export function getSchema() {
  const schema = readFileSync(path.join(__dirname, 'schema.graphql'))
  return schema.toString()
}

interface Context {
  user: User | null
  request: Request
  response: Response
  pubsub: PubSub,
  redis: Redis.Redis
}

export const graphqlRoot: Resolvers<Context> = {
  /*
  Work: {
    chapters: (parent, args, {redis}) => {
      var result = new Array()
      redis.smembers("")
    }
  },*/
  User: {
    works: async (parent, args, { redis }) => {
      var result = await redis.smembers(`user:${parent.id}:works`)
      let list: Work[] = []
      for (let id in result) {
        const item = await redis.hgetall(`work:${result[id]}`)
        list.push(item as any)
      }
      return list
    },
    bookmarks: async (parent, args, { redis }) => {
      var result = await redis.smembers(`user:${parent.id}:bookmarks`)
      let list: Bookmark[] = []
      for (let id in result) {
        const item = await redis.hgetall(`bookmark:${result[id]}`)
        list.push(item as any)
      }
      return list
    },
    userType: async (parent, args, { redis }) => {
      var result = await redis.hget(`user:${parent.id}`, "userType");
      return result as UserType
    }
  },
  Chapter: {
    work: async (parent, args, { redis }) => {
      var workID = await redis.hget(`chapter:${parent.id}`, "workID")
      return await redis.hgetall(`work:${workID}`) as any
    }
  },

  Work: {
    chapters: async (parent, args, { redis }) => {
      var result = await redis.smembers(`work:${parent.id}:chapters`)
      console.log(result)
      let list: Chapter[] = []
      for (let id in result) {
        const chap = await redis.hgetall(`chapter:${result[id]}`)
        list.push(chap as any)
      }
      return list
    },
    user: async (parent, args, { redis }) => {
      var userID = await redis.hget(`work:${parent.id}`, "userID")
      return await redis.hgetall(`user:${userID}`) as any
    },
    bookmarks: async (parent, args, { redis }) => {
      var result = await redis.smembers(`work:${parent.id}:bookmarks`)
      console.log(result)
      let list: Bookmark[] = []
      for (let id in result) {
        const item = await redis.hgetall(`bookmark:${result[id]}`)
        list.push(item as any)
      }
      return list
    }
  },
  Bookmark: {
    user: async (parent, args, { redis }) => {
      var userID = await redis.hget(`bookmark:${parent.id}`, "userID")
      return await redis.hgetall(`user:${userID}`) as any
    },
    work: async (parent, args, { redis }) => {
      var workID = await redis.hget(`bookmark:${parent.id}`, "workID")
      return await redis.hgetall(`work:${workID}`) as any
    }
  },
  Query: {
    self: (_, args, ctx) => ctx.user,
    survey: async (_, { surveyId }) => (await Survey.findOne({ where: { id: surveyId } })) || null,
    surveys: () => Survey.find(),
    user: async (_, { userID }, { redis }) => {
      const ur = await redis.hgetall(`user:${userID}`)
      await redis.set(`email:${ur.email}`, ur.id)
      return ur as any
      /*
      const u = await redis.hgetall(`user:${userID}`) as any
      if (u == null) {
        return await User.findOne({ where: { id: userID } }).then(async (result) => {
          if (result) {
            await redis.hmset(`user:${result.id}`, "id", result.id, "name", result.name, "email", result.email, "userType", String(result.userType))
            await redis.sadd("users", result.id)
          }
        }) || null
      } else {
        return u
      }
      */
    },
    users: async (_, args, { redis }) => {
      const result = await redis.smembers("users")

      console.log(result)

      let list: User[] = []
      for (let id in result) {
        const item = await redis.hgetall(`user:${result[id]}`)
        await redis.set(`email:${item.email}`, item.id)
        console.log(item.name)
        /*
        const result = {
          id: Number(work.id),
          title: work.title,
          summary: work.summary
        }
        list.push(result as any)
        */

        list.push(item as any)


      }
      return list
    }
    /*
    {
      var fetch = (callback: Function) => {
        var results = new Array()
        redis.smembers("users", function(err: any, users: any) {
          if(users.length == 0) {
            return User.find();
          }
          users.forEach(function(id) {
            redis.hgetall(`user:${id}`, function(err: any, items: any) {
            });
          });
        });
      };
      return fetch((results: any) => { return results; });
    }*/,
    // the {workID} is specific to the parameter set within query type of schema.graphql. id is specific to the column name within the database created by Work.ts
    // TODO: ask why the following is the case? --> the following does not work anymore once I put the many-to-one relation inside the work.ts file
    // answer: you didn't run "npm run gen" after modifying the schema.graphql file. And usually the schema in the schema.graphql doesn't match the schema specified in the files of the entities folder if the schema.graphql doesn't seem to be the problem.
    work: async (_, { workID }, { redis }) => {
      return await redis.hgetall(`work:${workID}`) as any
    }
    /*
    {
    }
    */
    ,
    // used to get the works for the search bar
    targetWorks: async (_, { targetWork }) => (await Work.find({
      where: { title: targetWork },
      relations: ['user']
    })) || null,
    // used to get all the works
    works: async (_, args, { redis }) => {
      const allWorks = await redis.smembers("works")
      console.log(allWorks)

      let list: Work[] = []
      for (let id in allWorks) {
        const work = await redis.hgetall(`work:${allWorks[id]}`)
        console.log(work.title)
        /*
        const result = {
          id: Number(work.id),
          title: work.title,
          summary: work.summary
        }
        list.push(result as any)
        */
        list.push(work as any)
      }
      return list

    },
    bookmark: async (_, { bookmarkID }, { redis }) => {
      return await redis.hgetall(`bookmark:${bookmarkID}`) as any
    },
    bookmarks: async (_, args, { redis }) => {
      const result = await redis.smembers("bookmarks")
      let list: Bookmark[] = []
      for (let id in result) {
        const bookmark = await redis.hgetall(`bookmark:${result[id]}`)
        list.push(bookmark as any)
      }
      return list
    }
    ,

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
    chapter: async (_, { chID }, { redis }) => //(await Chapter.findOne({ where: { id: chID } })) || null,
    {
      return await redis.hgetall(`chapter:${chID}`) as any
      /*
      if (ch != null) {
        const wk = await redis.hgetall(`work:${Number(ch.work)}`);
        const parentWork = {
          id: Number(wk.id)
        };
        const result = {
          id: Number(ch.id),
          title: String(ch.title),
          text: String(ch.text),
          work: parentWork as Work
        };
        return result as Chapter;
      }
      */
    },

    // if you want to query work info within a chapter query, then you need to add in ", relations: ['work']"
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
    updateSummary: async (_, { input }, { redis }) => {
      const { summary, workID } = input
      await redis.hset(`work:${workID}`, "summary", summary)
      return true
    },
    updateChapter: async (_, { input }, { redis }) => {
      const { title, text, chapterID } = input
      await redis.hmset(`chapter:${chapterID}`, "title", title, "text", text)
      return true
    },
    createWork: async (_, { workUserID, workTitle, workSummary }, { redis }) => {
      const authorID = await redis.hget(`user:${workUserID}`, "id")
      if (authorID) {
        const prevWorkID = await redis.scard("works")
        await redis.set("prevWork", prevWorkID)
        await redis.incrby("prevWork", 1)
        const newWID = await redis.get("prevWork") as string
        const outcome = await redis.sadd("works", newWID)
        let newWorkID = newWID
        let fail = outcome
        while (fail == 0) {
          await redis.incrby("prevWork", 1)
          const newWork = await redis.get("prevWork") as string
          newWorkID = newWork
          const out = await redis.sadd("works", newWork)
          fail = out
        }
        await redis.hmset(`work:${newWorkID}`, "id", newWorkID, "title", workTitle, "summary", workSummary, "userID", workUserID)
        await redis.sadd(`user:${workUserID}:works`, newWorkID)
        return Number(newWorkID)
      } else {
        return 0
      }
    },
    createUser: async (_, { email, name }, { redis }) => {
      const prevUserID = await redis.scard("users")
      await redis.set("prevUser", prevUserID)
      await redis.incrby("prevUser", 1)
      const newUserID = await redis.get("prevUser") as string
      const outcome = await redis.sadd("users", newUserID)
      let UserID = newUserID
      let fail = outcome
      while (fail == 0) {
        await redis.incrby("prevUser", 1)
        const newUser = await redis.get("prevUser") as string
        UserID = newUser
        const out = await redis.sadd("users", newUser)
        fail = out
      }
      await redis.set(`email:${email}`, UserID)
      await redis.hmset(`user:${UserID}`, "id", UserID, "name", name, "email", email, "userType", "USER")
      return Number(UserID)
    },
    addChapter: async (_, { workID, chapterTitle, chapterText }, { redis }) => {
      const pworkID = await redis.hget(`work:${workID}`, "id")
      if (pworkID) {
        const prevchID = await redis.scard("chapters")
        await redis.set("prevChapter", prevchID)
        await redis.incrby("prevChapter", 1)
        const newCHID = await redis.get("prevChapter") as string
        const outcome = await redis.sadd("chapters", newCHID)
        let chID = newCHID
        let fail = outcome
        while (fail == 0) {
          await redis.incrby("prevChapter", 1)
          const newCh = await redis.get("prevChapter") as string
          chID = newCh
          const out = await redis.sadd("chapters", newCh)
          fail = out
        }
        await redis.hmset(`chapter:${chID}`, "id", String(chID), "title", chapterTitle, "text", chapterText, "workID", workID);
        await redis.sadd(`work:${workID}:chapters`, String(chID))
        return Number(chID)
      } else {
        return 0
      }
    },
    createBookmark: async (_, { userID, workID }, { redis }) => {
      // const bookmarkCheck  = await Bookmark.findOne ({where: { userId: userID, workId: workID }, relations: ['user', 'work']}) || null
      // get the possible owner of bookmark
      // const bookmarkOwnerCheck = await User.findOne({ where: { id: userID }, relations: ['works'] }) || null
      // if (bookmarkOwnerCheck != null) {
      //   const workBookmarkedCheck = await Work.findOne({ where: { id: workID } }) || null
      //   if (workBookmarkedCheck != null ) {
      //     // // if we're not able to find a bookmark using work_id, then continue with creating the boookmark
      //     const bookmarks = bookmarkOwnerCheck.bookmarks
      //     console.log ("BOOKMARKS")
      //     console.log (bookmarks)
      //     // // loop through all the bookmarks of the user
      //     for (let i = 0; i < bookmarks.length; i++) {
      //       console.log ("bookmarks.length")
      //       console.log (bookmarks.length)
      //       console.log ("bookmarks[i]")
      //       console.log (bookmarks[i])
      //       const bookmark = bookmarks[i]
      //       // check if there are any bookmarks related to the work we are trying to make a bookmark for
      //       if (bookmark.work == workBookmarkedCheck) {
      //         console.log ("gets in here")
      //         return bookmark.id
      //       }
      //       console.log ("BOOKMARK WORK")
      //       console.log (bookmark.work)
      //       console.log ("WORK BOOKMARKED CHECK")
      //       console.log (workBookmarkedCheck)
      //     }
      //   }
      // }
      // console.log (bookmarkOwnerCheck)
      // console.log (bookmarks)





      const pworkID = await redis.hget(`work:${workID}`, "id")
      const user_ID = await redis.hget(`user:${userID}`, "id")
      if (pworkID && user_ID) {
        const prevbID = await redis.scard("bookmarks")
        await redis.set("prevBookmark", prevbID)
        await redis.incrby("prevBookmark", 1)
        const newBookID = await redis.get("prevBookmark") as string
        const outcome = await redis.sadd("bookmarks", newBookID)
        let newbID = newBookID
        let fail = outcome
        while (fail == 0) {
          await redis.incrby("prevBookmark", 1)
          const newBookmark = await redis.get("prevBookmark") as string
          newbID = newBookmark
          const out = await redis.sadd("bookmarks", newBookmark)
          fail = out
        }

        await redis.hmset(`bookmark:${newbID}`, "id", newbID, "userID", userID, "workID", workID)
        await redis.sadd(`user:${userID}:bookmarks`, newbID)
        await redis.sadd(`work:${workID}:bookmarks`, newbID)
        return Number(newbID)
      } else {
        return 0
      }
    },
    deleteBookmark: async (_, { bookmarkID }, { redis }) => {
      const userID = await redis.hget(`bookmark:${bookmarkID}`, "userID")
      const workID = await redis.hget(`bookmark:${bookmarkID}`, "workID")
      await redis.del(`bookmark:${bookmarkID}`)
      await redis.srem(`user:${userID}:bookmarks`, bookmarkID)
      await redis.srem(`work:${workID}:bookmarks`, bookmarkID)
      await redis.srem("bookmarks", bookmarkID)
      return true
    },
    deleteWork: async (_, { workID }, { redis }) => {

      const userID = await redis.hget(`work:${workID}`, "userID")
      var result = await redis.smembers(`work:${workID}:chapters`)
      result.forEach(async chapId => {
        await redis.srem("chapters", chapId)
      })
      var res = await redis.smembers(`work:${workID}:bookmarks`)
      res.forEach(async bId => {
        const userID = await redis.hget(`bookmark:${bId}`, "userID")
        await redis.srem(`user:${userID}:bookmarks`, bId)
        await redis.srem("bookmarks", bId)
        await redis.del(`bookmark:${bId}`)
      })
      await redis.srem(`user:${userID}:works`, workID)
      await redis.del(`work:${workID}:chapters`)
      await redis.del(`work:${workID}`)
      await redis.srem("works", workID)
      return true
    },
    deleteChapter: async (_, { chID }, { redis }) => {
      const workID = await redis.hget(`chapter:${chID}`, "workID")
      await redis.srem(`work:${workID}:chapters`, chID)
      await redis.del(`chapter:${chID}`)
      await redis.srem("chapters", chID)
      return true
    },
  },
  Subscription: {
    surveyUpdates: {
      subscribe: (_, { surveyId }, context) => context.pubsub.asyncIterator('SURVEY_UPDATE_' + surveyId),
      resolve: (payload: any) => payload,
    },
  },
}



