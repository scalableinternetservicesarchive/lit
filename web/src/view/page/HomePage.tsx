import { useQuery } from '@apollo/client'
import { RouteComponentProps } from '@reach/router'
import * as React from 'react'
import { useState } from 'react'
import { ColorName, Colors } from '../../../../common/src/colors'
import { FetchWorks, FetchWorksSearch } from '../../graphql/query.gen'
import { H1, H2, H3 } from '../../style/header'
import { Input } from '../../style/input'
import { Spacer } from '../../style/spacer'
import { style } from '../../style/styled'
import { BodyText } from '../../style/text'
import { Link } from '../nav/Link'
import { AppRouteParams } from '../nav/route'
import { fetchWorks, fetchWorksSearch } from '../work/fetchWorks'
import { Page } from './Page'
// import {WorkPage} from './WorkPage'

interface HomePageProps extends RouteComponentProps, AppRouteParams { }
// eslint-disable-next-line @typescript-eslint/no-unused-vars

interface Work {
  id: number,
  title: string,
  summary: string,
  user: {
    name: string;
  }
}
export function HomePage(props: HomePageProps) {
  /*
  function displayListWorksByName(workNameSearch) {
    const { loading, data } = useQuery<FetchWorksSearch>(fetchWorksSearch, {
      variables: { workNameSearch },
    })
    if (loading) {
      return <div>loading state</div>
    }
    if (data == null || data.targetWorks == null) {
      return <div>Work not Found</div>
    }
    const searchWorkTitles = [];
    for (let j = 0; j < data.targetWorks.length; j++) {
      const searchWork = data.targetWorks[j];
      searchWorkTitles.push(
        <Link to={'work/' + searchWork.id + '/0'}> {searchWork.title} </Link>
      );
    }
    //return searchWorkTitles;
  }
  */

  //var temp = "gameofthrones";
  const [workNameSearch, setWorkNameSearch] = useState('');
  const [dataList, setDataList] = useState([] as any);
  const { loading, data, refetch } = useQuery<FetchWorks>(fetchWorks)
  const { data: dataSearch, refetch: refetchSearch } = useQuery<FetchWorksSearch>(fetchWorksSearch, {
    variables: { searchTitle: workNameSearch }
  })


  function submitSearchTitle() {
    if (workNameSearch == "") {
      refetch();
      /*
      if (data)
        setDataList(data.works);*/
    } else {
      refetchSearch();
    }
  }

  React.useEffect(() => {

    if (data) {
      setDataList(data.works);
    }
    if (dataSearch && workNameSearch != "") {
      setDataList(dataSearch.targetWorks);
    }



  }, [data, dataSearch])

  if (loading) {
    return <div>loading state</div>
  }
  if (data == null || data.works == null) {
    return <div>Works not Found</div>
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


  // TODO: FUTURE OPTIMIZATION
  // let numOfFrontPageTitles = 10
  // if (data.works.length < numOfFrontPageTitles) {
  //   numOfFrontPageTitles = data.works.length
  // }
  // for (let i = numOfFrontPageTitles - 1; i >= 0; i--) {

  return (
    <Page>
      <Hero>
        <H1>THE LIT ARCHIVES WORKS</H1>
        <H3>Delve Into A World Of Imagination</H3>
      </Hero>
      <Input $onChange={setWorkNameSearch} $onSubmit={submitSearchTitle}></Input>
      <Content>
        {dataList.slice(0).reverse().map((work: Work) => (
          <Section key={work.id}>
            <H2>
              {' '}
              <Link to={'work/' + work.id + '/0'}> {work.title} </Link>{' '}
            </H2>
            <Spacer $h4 />
            <H3> by {work.user.name} </H3>
            <Spacer $h4 />
            <BodyText>{work.summary}</BodyText>
          </Section>
        ))}
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

const Content = style('div', 'mb4 w-100 ba b--mid-gray br2 pa3 tc', {
  marginTop: '20px',
})

// const LContent = style('div', 'flex-grow-0 w-70-l mr4-l')

// const RContent = style('div', 'flex-grow-0  w-30-l')

const Section = style('div', 'mb4 mid-gray ba b--mid-gray br2 pa3', (p: { $color?: ColorName }) => ({
  borderLeftColor: Colors[p.$color || 'lemon'] + '!important',
  borderLeftWidth: '3px',
}))

// const TD = style('td', 'pa1', p => ({
//   color: p.$theme.textColor(),
// }))
