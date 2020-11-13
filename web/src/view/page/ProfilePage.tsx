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
import { Link } from '../nav/Link'
import { AppRouteParams } from '../nav/route'
import { fetchWorksWritten } from '../work/fetchWorksWritten'
import { CreateWork } from './CreateWork'
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
  if (data == null || data.user == null || data.user.works == null) {
    return <div>no data!</div>
  }
  // console.log(data.user)
  return (
    <Page>
      <Headline>
        <img src="/app/assets/user.jpeg" height="100" width="100"></img>
        <Spacer $h4 />
        <H1>{userName}</H1>
        <H3>{userEmail}</H3>
        <Spacer $h4 />
        <div className="mt3">
          <Button onClick={routeCreate}>Create Work</Button>
        </div>
        <Spacer $h4 />
      </Headline>
      <H1> Your Works </H1>
      <Spacer $h4 />
      <BodyText>
        <table>
          <tbody>
            {data.user.works?.map((work, i) => (
              <tr key={i}>
                <TD>
                  <Link to={'work/' + work.id + '/0'}> {work.title} </Link>
                </TD>
              </tr>
            ))}
          </tbody>
        </table>
      </BodyText>
    </Page>
  )
}

function routeCreate() {
  return <CreateWork />
}
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
