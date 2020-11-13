import { useQuery } from '@apollo/client'
import { RouteComponentProps } from '@reach/router'
import * as React from 'react'
import { ColorName, Colors } from '../../../../common/src/colors'
import { FetchWorks } from '../../graphql/query.gen'
import { H1, H2, H3 } from '../../style/header'
import { Spacer } from '../../style/spacer'
import { style } from '../../style/styled'
import { BodyText } from '../../style/text'
import { Link } from '../nav/Link'
import { AppRouteParams } from '../nav/route'
import { fetchWorks } from '../work/fetchWorks'
import { Page } from './Page'
// import {WorkPage} from './WorkPage'

interface HomePageProps extends RouteComponentProps, AppRouteParams { }
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function HomePage(props: HomePageProps) {
  const { loading, data } = useQuery<FetchWorks>(fetchWorks)
  if (loading) {
    return <div>loading state</div>
  }
  if (data == null || data.works == null) {
    return <div>Work not Found</div>
  }

  // DEBUG PURPOSES

  // const work = data.works[0]
  // const work_id = work.id
  // const work_title = work.title
  // const work_summary = work.summary
  // const work_user_name = work.user.name

  // console.log(work_id);
  // console.log(work_title);
  // console.log(work_summary);
  // console.log(work_user_name);

  // console.log(data.works);

  const workList = []
  for (let i = 0; i < data.works.length; i++) {
    const work = data.works[i]
    const work_id = work.id
    const work_title = work.title
    const work_summary = work.summary
    const work_user_name = work.user.name
    workList.push(
      <Section key={work_id}>
        <H2> <Link to={'work/' + work_id + '/0'}> {work_title} </Link> </H2> 
        <Spacer $h4 />
        <H3> by {work_user_name} </H3>
        <Spacer $h4 />
        <BodyText>
          {work_summary}
        </BodyText>
      </Section >
    )
    // console.log(work_id);
    // console.log(work_title);
    // console.log(work_summary);
    // console.log(work_user_name);
  }

  return (
    <Page>
      <Hero>
        <H1>THE LIT ARCHIVES WORKS</H1>
        <H3>Delve Into A World Of Imagination</H3>
      </Hero>
      <Content>
        {workList}
      </Content>
    </Page>
  )
}

const Hero = style('div', 'mb4 w-100 ba b--mid-gray br2 pa3 tc', {
  borderLeftColor: Colors.lemon + '!important',
  borderRightColor: Colors.lemon + '!important',
  borderLeftWidth: '4px',
  borderRightWidth: '4px',
})

const Content = style('div', 'mb4 w-100 ba b--mid-gray br2 pa3 tc')

// const LContent = style('div', 'flex-grow-0 w-70-l mr4-l')

// const RContent = style('div', 'flex-grow-0  w-30-l')

const Section = style('div', 'mb4 mid-gray ba b--mid-gray br2 pa3', (p: { $color?: ColorName }) => ({
  borderLeftColor: Colors[p.$color || 'lemon'] + '!important',
  borderLeftWidth: '3px',
}))

// const TD = style('td', 'pa1', p => ({
//   color: p.$theme.textColor(),
// }))
