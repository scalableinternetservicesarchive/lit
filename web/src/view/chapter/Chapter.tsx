import { useQuery } from '@apollo/client';
import * as React from 'react';
import { useState } from 'react';
import { ColorName, Colors } from '../../../../common/src/colors';
import { getApolloClient } from '../../graphql/apolloClient';
import { FetchChapter } from '../../graphql/query.gen';
import { Button } from '../../style/button';
import { H2 } from '../../style/header';
import { Input } from '../../style/input';
import { Spacer } from '../../style/spacer';
import { style } from '../../style/styled';
import { BodyText } from '../../style/text';
import { fetchChapter } from './fetchChapter';
import { updateChapter } from './mutateChapter';

interface ChapterPropParams {
  // using `interface` is also ok
  chID: number;
  isEditing: Boolean;
  switchFunc: () => void;
};

// interface IChapterDraft {
//   title: string;
//   text: string;
//   // password: string;
// }
// interface ChapterProps extends RouteComponentProps<ChapterPropParams>, AppRouteParams { }

export function Chapter(props: ChapterPropParams) {
  const chID = props.chID;
  const isEditing = props.isEditing;
  console.log(isEditing);

  const [title, setTitle] = useState('')
  const [text, setText] = useState('')

  const { loading, data } = useQuery<FetchChapter>
    (fetchChapter, {
      variables: { chID },
    })

  React.useEffect(() => {
    if (data) {
      setTitle(data.chapter?.title || '')
      setText(data.chapter?.text || '')
    }
  }, [data])

  if (loading) {
    return <div>loading...</div>
  }
  if (data == null) {
    return <div>Invalid Chapter</div>
  }



  // const [draft, setDraft] = useState<IChapterDraft>({
  //   title: data?.chapter?.title || "",
  //   text: data?.chapter?.text || ""
  // });
  function saveDraft() {
    updateChapter(getApolloClient(), {
      chapterID: chID,
      title: title,
      text: text
    }).then(() => {
      props.switchFunc()
    })
  }

  if (isEditing) {
    // return <Button>Save</Button>
    return (
      <Section>
        <Input
          type="text"
          name="title"
          value={title}
          $onChange={setTitle}
          $onSubmit={saveDraft}
        >
        </Input>
        <Spacer $h4 />
        <textarea
          name="text"
          value={text}
          onChange={(
            ev: React.ChangeEvent<HTMLTextAreaElement>,
          ): void => setText(ev.target.value)}
          onSubmit={saveDraft}
        ></textarea>
        <Spacer $h4 />
        <Button onClick={saveDraft}>Save</Button>
      </Section>
    );
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
