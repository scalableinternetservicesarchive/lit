import { useQuery } from '@apollo/client'
import { RouteComponentProps } from '@reach/router'
import * as React from 'react'
import { getApolloClient } from '../../graphql/apolloClient'
// import { Divider } from 'semantic-ui-react'
import { FetchBookmark } from '../../graphql/query.gen'
import { Button } from '../../style/button'
import { H1 } from '../../style/header'
import { Spacer } from '../../style/spacer'
import { style } from '../../style/styled'
import { BodyText } from '../../style/text'
import { useUserContext } from '../auth/user'
import { delBookmark } from '../bookmark/deleteBookmark'
import { fetchBookmark } from '../bookmark/fetchBookmark'
import { Link } from '../nav/Link'
import { AppRouteParams } from '../nav/route'
import { handleError } from '../toast/error'
import { Page } from './Page'

interface BookmarkPageProps extends RouteComponentProps, AppRouteParams {}

// const DividerExampleDivider = () => <Divider />

export function BookmarkPage(props: BookmarkPageProps) {
  const user = useUserContext().user
  // let userName = 'Name'
  if (user == null) {
    return <div>Please log in</div>
  }
  // const userName = user.name
  // const userEmail = user.email
  const userID = user.id
  function eraseBookmark(id: any) {
    delBookmark(getApolloClient(), {
      bookmarkID: id,
    })
      .then(() => window.location.reload())
      .catch(err => handleError(err))
  }
  const { loading, data } = useQuery<FetchBookmark>(fetchBookmark)
  if (loading) {
    return <div>loading state</div>
  }
  if (data == null || data.bookmarks == null) {
    return <div>no data!</div>
  }
  const userBookmarks = []
  for (let i = 0; i < data.bookmarks.length; i++) {
    const bookmark = data.bookmarks[i]
    if (bookmark.user.id == userID) {
      userBookmarks.push(
        <div key={i}>
          <tr>
            <TD>
              <Link to={'work/' + bookmark.work.id + '/0'}> {bookmark.work.title}</Link>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <Button onClick={() => eraseBookmark(bookmark.id)}>Delete</Button>
              <Spacer $h4 />
            </TD>
          </tr>
        </div>
      )
    }
  }
  // console.log(data.user)
  return (
    <Page>
      <Headline>
        {/* <H1>{userName}</H1>
        <H3>{userEmail}</H3> */}
        <Spacer $h4 />
      </Headline>
      <H1> Bookmarks </H1>
      <Spacer $h4 />
      <BodyText>
        <table>
          <tbody>{userBookmarks}</tbody>
        </table>
      </BodyText>
    </Page>
  )
}

// function createWork() {
//   return <CreateWork />
// }
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

// import { RouteComponentProps } from '@reach/router'
// // import { RouteComponentProps } from '@reach/router'
// import * as React from 'react'
// import { Login } from '../auth/Login'
// import { AppRouteParams } from '../nav/route'
// // import { AppRouteParams, PlaygroundApp } from '../nav/route'
// // import { Surveys } from '../playground/Surveys'
// import { Page } from './Page'

// // IF NO PROPS, APP.TSX GIVES SOME ERROR ABOUT INTRINSIC TYPE
// interface LoginPageProps extends RouteComponentProps, AppRouteParams {}

// export function BookmarkPage(props: LoginPageProps) {
//   return <Page>{<Login />}</Page>
//
