import { RouteComponentProps } from '@reach/router'
import * as React from 'react'
import { useState } from 'react'
import { ColorName, Colors } from '../../../../common/src/colors'
import { getApolloClient } from '../../graphql/apolloClient'
import { Button } from '../../style/button'
import { Input } from '../../style/input'
import { Spacer } from '../../style/spacer'
import { style } from '../../style/styled'
import { useUserContext } from '../auth/user'
import { AppRouteParams } from '../nav/route'
import { handleError } from '../toast/error'
import { postWork } from '../work/createWork'

interface CreateWorksProps extends RouteComponentProps, AppRouteParams {}

export function CreateWork(props: CreateWorksProps) {
  const user = useUserContext().user
  if (user == null) {
    return <div>Please log in</div>
  }
  const userID = user.id
  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')

  function saveWork() {
    postWork(getApolloClient(), {
      workUserIdPost: userID,
      workTitlePost: title,
      workSummaryPost: summary,
    }).catch(err => handleError(err))
  }

  return (
    <Section>
      <div> Title </div>
      <Input type="text" name="title" value={title} $onChange={setTitle} $onSubmit={saveWork}></Input>
      <Spacer $h4 />
      <div> Summary </div>
      <textarea
        name="summary"
        value={summary}
        onChange={(ev: React.ChangeEvent<HTMLTextAreaElement>): void => setSummary(ev.target.value)}
        onSubmit={saveWork}
      ></textarea>
      <Spacer $h4 />
      <Button onClick={saveWork}>Post</Button>
    </Section>
  )

  // return (
  //   <>
  //     <div className="mt3">
  //       <label className="db fw4 lh-copy f6" htmlFor="title">
  //         Enter Title
  //       </label>
  //       <Input $onChange={setTitle} $onSubmit={postWork} name="email" type="email" />
  //     </div>
  //     <div className="mt3">
  //       <label className="db fw4 lh-copy f6" htmlFor="text">
  //         Enter Text
  //       </label>
  //       <Input $onChange={setText} $onSubmit={postWork} name="email" type="email" />
  //     </div>
  //     <div className="mt3">
  //       <label className="db fw4 lh-copy f6" htmlFor="summary">
  //         Enter Text
  //       </label>
  //       <Input $onChange={setSummary} $onSubmit={postWork} name="email" type="email" />
  //     </div>
  //     <div className="mt3">
  //       <Button onClick={postWork}>Post</Button>
  //     </div>
  //     <div> {text} </div>
  //   </>
  // )
}

const Section = style('div', 'mb4 mid-gray ba b--mid-gray br2 pa3', (p: { $color?: ColorName }) => ({
  borderLeftColor: Colors[p.$color || 'lemon'] + '!important',
  borderLeftWidth: '3px',
}))
