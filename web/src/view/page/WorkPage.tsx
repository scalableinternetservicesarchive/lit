import { useQuery } from '@apollo/client'
import { navigate, RouteComponentProps } from '@reach/router'
import * as React from 'react'
import { useState } from 'react'
import { ColorName, Colors } from '../../../../common/src/colors'
import { getApolloClient } from '../../graphql/apolloClient'
import { FetchBookmark, FetchWork } from '../../graphql/query.gen'
import { Button } from '../../style/button'
import { H1, H2, H3, H5 } from '../../style/header'
import { Spacer } from '../../style/spacer'
import { style } from '../../style/styled'
import { BodyText } from '../../style/text'
import { useUserContext } from '../auth/user'
import { fetchBookmark } from '../bookmark/fetchBookmark'
import { createBookmark, delBookmark } from '../bookmark/mutateBookmark'
import { Chapter } from '../chapter/Chapter'
import { delChapter } from '../chapter/deleteChapter'
import { Link } from '../nav/Link'
import { AppRouteParams } from '../nav/route'
import { handleError } from '../toast/error'
import { fetchWork } from '../work/fetchWorks'
import { Page } from './Page'

export enum Mode {
  VIEW,
  EDIT,
  ADDNEW,
}

interface pathParams {
  workID: number
  chID: number
}

interface bookMark {
  work: {
    title: string
    id: number
  }
  user: {
    id: number
  }
  id: number
}
// interface Imode {

//   isEditing: Boolean;
//   isNew: Boolean;
//   // email:  string;
//   // password: string;
// }

interface WorkPageProps extends RouteComponentProps<pathParams>, AppRouteParams {}

export function WorkPage(props: WorkPageProps) {
  const workID = Number(props.workID)
  // const [state, setState] = useState<Istate>({ isEditing: false, isNew: false });
  const [chID, setChID] = useState(Number(props.chID))
  const [isAuthor, setIsAuthor] = useState(false)
  const [bookmarkID, setBookmarkID] = useState(0)
  const [mode, setMode] = useState(Mode.VIEW)

  const user = useUserContext().user //get the current user info
  const { loading, data, refetch } = useQuery<FetchWork>(fetchWork, {
    variables: { workID },
  })
  const { data: dataBookmarks, loading: loadingB, refetch: refetchBookMark } = useQuery<FetchBookmark>(fetchBookmark)
  // function targetBookmark(element, index, array) {
  function targetBookmark(element: bookMark) {
    return element.user.id == user?.id && element.work.id == workID
  }

  React.useEffect(() => {
    if (data) {
      if (user?.id === data.work?.user.id) {
        setIsAuthor(true)
      }
      // console.log(data.work?.chapters)//DEBUG
      // if (chID == 0 && data.work?.chapters.length != 0) {
      //   setChID(Number(data.work?.chapters[0].id))
      // }
    }
    let passed: bookMark[] = []
    if (dataBookmarks?.bookmarks) {
      // console.log(dataBookmarks)
      passed = dataBookmarks.bookmarks.filter(targetBookmark)
    }
    if (passed.length > 0) {
      setBookmarkID(passed[0].id)
    } else {
      //reset the id back to 0 (default) in case of deleting
      setBookmarkID(0)
    }
  }, [data, dataBookmarks])

  function switchMode(mode: Mode) {
    setMode(mode)
    //When mode gets switched back to VIEW -> refetch data
    if (mode == Mode.VIEW) {
      refetch()
    }
  }
  function changeChapter(chID: number) {
    setChID(chID)
  }
  function addBookmark() {
    createBookmark(getApolloClient(), {
      userID: Number(user?.id),
      workID: workID,
    })
      .then(() => refetchBookMark())
      .catch(err => handleError(err))
  }
  function deleteBookmark() {
    // console.log("Deleting the bookmark" + bookmarkID)//DEBUG
    delBookmark(getApolloClient(), {
      bookmarkID: bookmarkID,
    })
      .then(() => refetchBookMark())
      .catch(err => handleError(err))
  }
  // function editNewChapter() {
  //   setState({ ...state, isNew: !state.isNew })
  // }
  function eraseChapter(id: any) {
    delChapter(getApolloClient(), {
      chapterID: id,
    })
      .then(() => window.location.reload())
      .catch(err => handleError(err))
  }

  if (loading || loadingB) {
    return <div>loading state</div>
  }
  if (data == null || data.work == null || data.work.user == null) {
    return <div>Work not Found</div>
  }
  if (chID == 0) {
    //If there's any chapter, set the chID to be the id of the first chapter
    if (data.work?.chapters.length != 0) {
      setChID(Number(data.work?.chapters[0].id))
      // navigate(String(chID), { replace: true }) //won't work, not sure why
      // return (<Redirect to={String(chID)} replace={true} />)
    }
  }

  return (
    <Page>
      <Hero>
        <H1>{data.work.title}</H1>
        <H3>{data.work.user.name}</H3>
        <Spacer $h4 />
        {mode == Mode.VIEW && bookmarkID == 0 && user && (
          <Button $small onClick={addBookmark}>
            Bookmark This Work
          </Button>
        )}
        {mode == Mode.VIEW && bookmarkID != 0 && (
          <Button $small $color="silver" onClick={deleteBookmark}>
            Delete Bookmark
          </Button>
        )}
        <H5>{data.work.summary}</H5>
      </Hero>
      <Content>
        <LContent>
          {chID == 0 && !isAuthor ? (
            <Section>
              <H2>There's no content yet.</H2>
            </Section>
          ) : (
            <Chapter workID={workID} chID={chID} mode={mode} switchMode={switchMode} setChID={changeChapter} />
          )}
          {/* <Chapter chID={chID} isEditing={state.isEditing} /> */}
          {isAuthor && mode == Mode.VIEW && data.work?.chapters.length != 0 && (
            <Button onClick={() => switchMode(Mode.EDIT)}>Edit</Button>
          )}
        </LContent>
        <RContent>
          <Section>
            <H2>Menu</H2>
            <Spacer $h4 />
            {isAuthor && mode == Mode.VIEW && <Button onClick={() => switchMode(Mode.ADDNEW)}>+</Button>}
            <BodyText>
              <table>
                <tbody>
                  {data.work?.chapters?.map((chapter, i) => (
                    <tr key={i}>
                      <TD>
                        <Link
                          onClick={async () => {
                            setChID(chapter.id)
                            switchMode(Mode.VIEW)
                            navigate(String(chapter.id), { replace: false })
                          }}
                        >
                          {/* <Link to={String(chapter.id)} onClick={() => setChID(chapter.id)}> */}
                          Chapter {i + 1}: {chapter.title}
                        </Link>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <Button onClick={() => eraseChapter(chapter.id)}> - </Button>
                      </TD>
                    </tr>
                  ))}
                </tbody>
              </table>
            </BodyText>
          </Section>
        </RContent>
      </Content>
    </Page>
  )
  // return (
  //   <Page>
  //     <Hero>
  //       <H1>{data.work !== null ? data.work.title : ""}</H1>
  //       <H3>{workID}</H3>
  //       <H3>{chID}</H3>
  //     </Hero>
  //     <Content>
  //       <LContent>
  //         <Section>
  //           <H2>About CS 188</H2>
  //           <Spacer $h4 />
  //           <BodyText>
  //             ☝️ This course explores advanced topics in highly scalable internet services and their underlying
  //             architecture.
  //           </BodyText>
  //           <Spacer $h4 />
  //           <BodyText>
  //             Software today is increasingly delivered as a service: accessible globally via web browsers and mobile
  //             applications and backed by millions of servers. Modern technologies and platforms are making it easier to
  //             build and deploy these systems. Yet despite these advances, some concerns just don't go away. Building
  //             scalable services today still requires an understanding of topics like concurrency, caching, load
  //             balancing, and observability. In this course we will examine the state of the art.
  //           </BodyText>
  //         </Section>
  //         <Section>
  //           <H2>Getting Started</H2>
  //           <Spacer $h4 />
  //           <BodyText>In the first week of class, please complete the following:</BodyText>
  //           <Spacer $h4 />
  //           <BodyText>
  //             <ul className="pl4">
  //               <li>
  //                 Follow the <Link href="https://github.com/rothfels/bespin#quickstart">project Quickstart</Link> to
  //                 configure your dev environment.
  //               </li>
  //               <li>
  //                 Find a project team. See <Link to={getPath(Route.PROJECTS)}>Projects</Link> for details.
  //               </li>
  //               <li>
  //                 Join the <Link href="https://piazza.com/ucla/fall2020/cs188">CS188 Piazza</Link>.
  //               </li>
  //             </ul>
  //           </BodyText>
  //         </Section>
  //       </LContent>
  //       <RContent>
  //         <Section>
  //           <H2>Course Information</H2>
  //           <Spacer $h4 />
  //           <BodyText>
  //             <table>
  //               <tbody>
  //                 <tr>
  //                   <TD>👨‍🏫</TD>
  //                   <TD>John Rothfels</TD>
  //                 </tr>
  //                 <tr>
  //                   <TD>✉️</TD>
  //                   <TD>
  //                     <Link href="mailto://rothfels@cs.ucla.edu">rothfels@cs.ucla.edu</Link>
  //                   </TD>
  //                 </tr>
  //                 <tr>
  //                   <TD>⏯</TD>
  //                   <TD>
  //                     <Link href="https://ucla.zoom.us/j/92470409406?pwd=eFpyYWFQZGRtcVUzWC9HYlhSakRxZz09">Zoom</Link>
  //                   </TD>
  //                 </tr>
  //                 <tr>
  //                   <TD>🕒</TD>
  //                   <TD>
  //                     <div>
  //                       <b>Tue, Thu</b> · 8:00 - 9:50am
  //                     </div>
  //                   </TD>
  //                 </tr>
  //                 <tr>
  //                   <TD></TD>
  //                   <TD>
  //                     <div>
  //                       <b>Fri</b> · 12:00 - 1:50pm
  //                     </div>
  //                     <div>
  //                       <b>Fri</b> · 2:00 - 3:50pm
  //                     </div>
  //                   </TD>
  //                 </tr>
  //               </tbody>
  //             </table>
  //           </BodyText>
  //         </Section>
  //         <Section>
  //           <H2>Resources</H2>
  //           <Spacer $h4 />
  //           <BodyText>
  //             <ul className="ml4">
  //               <li>
  //                 <Link block href="https://www.typescriptlang.org/docs/handbook/intro.html">
  //                   TypeScript handbook
  //                 </Link>
  //                 <Link block href="https://basarat.gitbook.io/typescript/">
  //                   TypeScript deep-dive
  //                 </Link>
  //               </li>
  //               <li>
  //                 <Link block href="https://www.typescriptlang.org/play">
  //                   TypeScript playground
  //                 </Link>
  //               </li>
  //               <li>
  //                 <Link block href="https://reactjs.org/tutorial/tutorial.html">
  //                   React tutorial
  //                 </Link>
  //               </li>
  //               <li>
  //                 <Link block href="https://reactjs.org/docs/hello-world.html">
  //                   React docs
  //                 </Link>
  //               </li>
  //               <li>
  //                 <Link block href="https://www.apollographql.com/docs/react/data/queries/">
  //                   Apollo client docs
  //                 </Link>
  //               </li>
  //               <li>
  //                 <Link block href="https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch">
  //                   <code>fetch</code> docs
  //                 </Link>
  //               </li>
  //               <li>
  //                 <Link block href="#">
  //                   Project troubleshooting
  //                 </Link>
  //               </li>
  //             </ul>
  //           </BodyText>
  //         </Section>
  //       </RContent>
  //     </Content>
  //   </Page>
  // )
}

const Hero = style('div', 'mb4 w-100 ba b--mid-gray br2 pa3 tc', {
  borderLeftColor: Colors.lemon + '!important',
  borderRightColor: Colors.lemon + '!important',
  borderLeftWidth: '4px',
  borderRightWidth: '4px',
})

const Content = style('div', 'flex-l')

const LContent = style('div', 'flex-grow-0 w-70-l mr4-l')

const RContent = style('div', 'flex-grow-0  w-30-l')

const Section = style('div', 'mb4 mid-gray ba b--mid-gray br2 pa3', (p: { $color?: ColorName }) => ({
  borderLeftColor: Colors[p.$color || 'lemon'] + '!important',
  borderLeftWidth: '3px',
}))

const TD = style('td', 'pa1', p => ({
  color: p.$theme.textColor(),
}))
