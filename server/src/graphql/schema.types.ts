import { GraphQLResolveInfo } from 'graphql'
export type Maybe<T> = T | null
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] }
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } &
  { [P in K]-?: NonNullable<T[P]> }
/** All built-in and custom scalars, mapped to their actual values */
export interface Scalars {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
}

export interface User {
  __typename?: 'User'
  id: Scalars['Int']
  userType: UserType
  name: Scalars['String']
  email?: Maybe<Scalars['String']>
  works?: Maybe<Array<Work>>
}

export enum UserType {
  Admin = 'ADMIN',
  User = 'USER',
}

export interface Work {
  __typename?: 'Work'
  id: Scalars['Int']
  title: Scalars['String']
  summary: Scalars['String']
  chapterCurrMaxID: Scalars['Int']
  chapters: Array<Chapter>
  user: User
}

export interface WorkInput {
  workID: Scalars['Int']
  summary: Scalars['String']
}

export interface Chapter {
  __typename?: 'Chapter'
  id: Scalars['Int']
  chapterID: Scalars['Int']
  userID: Scalars['Int']
  title: Scalars['String']
  text: Scalars['String']
  work: Work
}

export interface ChapterInput {
  chapterID: Scalars['Int']
  title: Scalars['String']
  text: Scalars['String']
}

export interface Query {
  __typename?: 'Query'
  self?: Maybe<User>
  surveys: Array<Survey>
  survey?: Maybe<Survey>
  user?: Maybe<User>
  users: Array<User>
  work?: Maybe<Work>
  chapter?: Maybe<Chapter>
}

export interface QuerySurveyArgs {
  surveyId: Scalars['Int']
}

export interface QueryUserArgs {
  userID: Scalars['Int']
}

export interface QueryWorkArgs {
  workID: Scalars['Int']
}

export interface QueryChapterArgs {
  chID: Scalars['Int']
}

export interface Mutation {
  __typename?: 'Mutation'
  answerSurvey: Scalars['Boolean']
  nextSurveyQuestion?: Maybe<Survey>
  updateSummary: Scalars['Boolean']
  updateChapter: Scalars['Boolean']
}

export interface MutationAnswerSurveyArgs {
  input: SurveyInput
}

export interface MutationNextSurveyQuestionArgs {
  surveyId: Scalars['Int']
}

export interface MutationUpdateSummaryArgs {
  input: WorkInput
}

export interface MutationUpdateChapterArgs {
  input: ChapterInput
}

export interface Subscription {
  __typename?: 'Subscription'
  surveyUpdates?: Maybe<Survey>
}

export interface SubscriptionSurveyUpdatesArgs {
  surveyId: Scalars['Int']
}

export interface Survey {
  __typename?: 'Survey'
  id: Scalars['Int']
  name: Scalars['String']
  isStarted: Scalars['Boolean']
  isCompleted: Scalars['Boolean']
  currentQuestion?: Maybe<SurveyQuestion>
  questions: Array<Maybe<SurveyQuestion>>
}

export interface SurveyQuestion {
  __typename?: 'SurveyQuestion'
  id: Scalars['Int']
  prompt: Scalars['String']
  choices?: Maybe<Array<Scalars['String']>>
  answers: Array<SurveyAnswer>
  survey: Survey
}

export interface SurveyAnswer {
  __typename?: 'SurveyAnswer'
  id: Scalars['Int']
  answer: Scalars['String']
  question: SurveyQuestion
}

export interface SurveyInput {
  questionId: Scalars['Int']
  answer: Scalars['String']
}

export type ResolverTypeWrapper<T> = Promise<T> | T

export type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>
}

export type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
  selectionSet: string
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>
}
export type StitchingResolver<TResult, TParent, TContext, TArgs> =
  | LegacyStitchingResolver<TResult, TParent, TContext, TArgs>
  | NewStitchingResolver<TResult, TParent, TContext, TArgs>
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>

export type IsTypeOfResolverFn<T = {}> = (obj: T, info: GraphQLResolveInfo) => boolean | Promise<boolean>

export type NextResolverFn<T> = () => Promise<T>

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  User: ResolverTypeWrapper<User>
  Int: ResolverTypeWrapper<Scalars['Int']>
  String: ResolverTypeWrapper<Scalars['String']>
  UserType: UserType
  Work: ResolverTypeWrapper<Work>
  WorkInput: WorkInput
  Chapter: ResolverTypeWrapper<Chapter>
  ChapterInput: ChapterInput
  Query: ResolverTypeWrapper<{}>
  Mutation: ResolverTypeWrapper<{}>
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>
  Subscription: ResolverTypeWrapper<{}>
  Survey: ResolverTypeWrapper<Survey>
  SurveyQuestion: ResolverTypeWrapper<SurveyQuestion>
  SurveyAnswer: ResolverTypeWrapper<SurveyAnswer>
  SurveyInput: SurveyInput
}

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  User: User
  Int: Scalars['Int']
  String: Scalars['String']
  Work: Work
  WorkInput: WorkInput
  Chapter: Chapter
  ChapterInput: ChapterInput
  Query: {}
  Mutation: {}
  Boolean: Scalars['Boolean']
  Subscription: {}
  Survey: Survey
  SurveyQuestion: SurveyQuestion
  SurveyAnswer: SurveyAnswer
  SurveyInput: SurveyInput
}

export type UserResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']
> = {
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  userType?: Resolver<ResolversTypes['UserType'], ParentType, ContextType>
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  works?: Resolver<Maybe<Array<ResolversTypes['Work']>>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType>
}

export type WorkResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Work'] = ResolversParentTypes['Work']
> = {
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  summary?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  chapterCurrMaxID?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  chapters?: Resolver<Array<ResolversTypes['Chapter']>, ParentType, ContextType>
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType>
}

export type ChapterResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Chapter'] = ResolversParentTypes['Chapter']
> = {
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  chapterID?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  userID?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  text?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  work?: Resolver<ResolversTypes['Work'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType>
}

export type QueryResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']
> = {
  self?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>
  surveys?: Resolver<Array<ResolversTypes['Survey']>, ParentType, ContextType>
  survey?: Resolver<
    Maybe<ResolversTypes['Survey']>,
    ParentType,
    ContextType,
    RequireFields<QuerySurveyArgs, 'surveyId'>
  >
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryUserArgs, 'userID'>>
  users?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType>
  work?: Resolver<Maybe<ResolversTypes['Work']>, ParentType, ContextType, RequireFields<QueryWorkArgs, 'workID'>>
  chapter?: Resolver<Maybe<ResolversTypes['Chapter']>, ParentType, ContextType, RequireFields<QueryChapterArgs, 'chID'>>
}

export type MutationResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']
> = {
  answerSurvey?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType,
    RequireFields<MutationAnswerSurveyArgs, 'input'>
  >
  nextSurveyQuestion?: Resolver<
    Maybe<ResolversTypes['Survey']>,
    ParentType,
    ContextType,
    RequireFields<MutationNextSurveyQuestionArgs, 'surveyId'>
  >
  updateSummary?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType,
    RequireFields<MutationUpdateSummaryArgs, 'input'>
  >
  updateChapter?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType,
    RequireFields<MutationUpdateChapterArgs, 'input'>
  >
}

export type SubscriptionResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']
> = {
  surveyUpdates?: SubscriptionResolver<
    Maybe<ResolversTypes['Survey']>,
    'surveyUpdates',
    ParentType,
    ContextType,
    RequireFields<SubscriptionSurveyUpdatesArgs, 'surveyId'>
  >
}

export type SurveyResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Survey'] = ResolversParentTypes['Survey']
> = {
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  isStarted?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  isCompleted?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  currentQuestion?: Resolver<Maybe<ResolversTypes['SurveyQuestion']>, ParentType, ContextType>
  questions?: Resolver<Array<Maybe<ResolversTypes['SurveyQuestion']>>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType>
}

export type SurveyQuestionResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['SurveyQuestion'] = ResolversParentTypes['SurveyQuestion']
> = {
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  prompt?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  choices?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>
  answers?: Resolver<Array<ResolversTypes['SurveyAnswer']>, ParentType, ContextType>
  survey?: Resolver<ResolversTypes['Survey'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType>
}

export type SurveyAnswerResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['SurveyAnswer'] = ResolversParentTypes['SurveyAnswer']
> = {
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  answer?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  question?: Resolver<ResolversTypes['SurveyQuestion'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType>
}

export type Resolvers<ContextType = any> = {
  User?: UserResolvers<ContextType>
  Work?: WorkResolvers<ContextType>
  Chapter?: ChapterResolvers<ContextType>
  Query?: QueryResolvers<ContextType>
  Mutation?: MutationResolvers<ContextType>
  Subscription?: SubscriptionResolvers<ContextType>
  Survey?: SurveyResolvers<ContextType>
  SurveyQuestion?: SurveyQuestionResolvers<ContextType>
  SurveyAnswer?: SurveyAnswerResolvers<ContextType>
}

/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = any> = Resolvers<ContextType>
