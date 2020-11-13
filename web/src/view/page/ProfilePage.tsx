import { useQuery } from '@apollo/client'
import { RouteComponentProps } from '@reach/router'
import * as React from 'react'
// import { Divider } from 'semantic-ui-react'
import { FetchWorksWritten } from '../../graphql/query.gen'
import { Button } from '../../style/button'
// import { FetchUserName } from '../../graphql/query.gen'
import { H1, H3 } from '../../style/header'
import { Spacer } from '../../style/spacer'
import { style } from '../../style/styled'
import { BodyText } from '../../style/text'
// import { fetchUserName } from '../auth/fetchUserName'
import { useUserContext } from '../auth/user'
import { AppRouteParams } from '../nav/route'
import { fetchWorksWritten } from '../work/fetchWorksWritten'
import { Page } from './Page'

interface ProfilePageProps extends RouteComponentProps, AppRouteParams {}

// const DividerExampleDivider = () => <Divider />

export function ProfilePage(props: ProfilePageProps) {
  const user = useUserContext().user
  // let userName = 'Name'
  // let userEmail = 'Email'
  if (user == null) {
    return <div>Please log in</div>
  }
  const userName = user.name
  const userEmail = user.email
  const userID = user.id
  const { loading, data } = useQuery<FetchWorksWritten>(fetchWorksWritten, {
    variables: { userID },
  })
  if (loading) {
    return <div>loading state</div>
  }
  if (data == null || data.user == null) {
    return <div>no data!</div>
  }
  return (
    <Page>
      <Headline>
        <img src="/app/assets/user.jpeg" height="100" width="100"></img>
        <H1>{userName}</H1>
        <H3>{userEmail}</H3>
        <div className="mt3">
          <Button onClick={createWork}>Create Work</Button>
        </div>
      </Headline>
      <H1> Your Works </H1>
      <Spacer $h4 />
      <BodyText>
        <table>
          <tbody>
            {data.user.works?.map((work, i) => (
              <tr key={i}>
                <TD>{work.title}</TD>
              </tr>
            ))}
          </tbody>
        </table>
      </BodyText>
    </Page>
  )
}

function createWork() {}
// function findWorks() {
//   const user = useUserContext().user
//   if (user == null) {
//     return <div>no user</div>
//   }
//   const userID = user.id
//   const { loading, data } = useQuery<FetchWorksWritten>(fetchWorksWritten, {
//     variables: { userID },
//   })
//   if (loading) {
//     return <div>loading state</div>
//   }
//   if (data == null) {
//     return <div>no data!</div>
//   }
//   return (

//   )
// }

const Headline = style('div', {
  textAlign: 'center',
})

const TD = style('td', 'pa1', p => ({
  color: p.$theme.textColor(),
}))

// const Box = style('div', 'mb4 w-100 b--mid-gray br2 pa3 tc', {
//   backgroundColor: '#ff8c69',
//   height: '300px',
// })

// const Hero = style('div', 'mb4 w-100 ba b--mid-gray br2 pa3 tc', {
//   borderLeftColor: Colors.lemon + '!important',
//   borderRightColor: Colors.lemon + '!important',
//   borderLeftWidth: '4px',
//   borderRightWidth: '4px',
// })

// const Content = style('div', 'flex-l')

// const LContent = style('div', 'flex-grow-0 w-70-l mr4-l')

// const RContent = style('div', 'flex-grow-0  w-30-l')

// const Section = style('div', 'mb4 mid-gray ba b--mid-gray br2 pa3', (p: { $color?: ColorName }) => ({
//   borderLeftColor: Colors[p.$color || 'lemon'] + '!important',
//   borderLeftWidth: '3px',
// }))

// const TD = style('td', 'pa1', p => ({
//   color: p.$theme.textColor(),
// }))