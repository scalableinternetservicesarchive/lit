import { useQuery } from '@apollo/client';
import * as React from 'react';
import { ColorName, Colors } from '../../../../common/src/colors';
import {
  FetchChapter
} from '../../graphql/query.gen';
import { Button } from '../../style/button';
import { H2 } from '../../style/header';
import { Spacer } from '../../style/spacer';
import { style } from '../../style/styled';
import { BodyText } from '../../style/text';
import { fetchChapter } from './fetchChapter';

interface ChapterPropParams {
  // using `interface` is also ok
  chID: number;
  isEditing: Boolean;
  switchFunc: () => void;
};
// interface ChapterProps extends RouteComponentProps<ChapterPropParams>, AppRouteParams { }

export function Chapter(props: ChapterPropParams) {
  const chID = props.chID;
  const isEditing = props.isEditing;
  console.log(isEditing);
  const { loading, data } = useQuery<FetchChapter>
    (fetchChapter, {
      variables: { chID },
    })
  if (loading) {
    return <div>loading...</div>
  }
  if (data == null) {
    return <div>Invalid Chapter</div>
  }
  if (isEditing) {
    // return <Button>Save</Button>
    return <Button onClick={props.switchFunc}>Save</Button>
  }
  return (
    <Section>
      <H2>{data.chapter?.title}</H2>
      <Spacer $h4 />
      <BodyText>
        {data.chapter?.text}
      </BodyText>
    </Section>
  );
}

const Section = style('div', 'mb4 mid-gray ba b--mid-gray br2 pa3', (p: { $color?: ColorName }) => ({
  borderLeftColor: Colors[p.$color || 'lemon'] + '!important',
  borderLeftWidth: '3px',
}))
