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
import { Mode } from '../page/WorkPage';
import { fetchChapter } from './fetchChapter';
import { postChapter, updateChapter } from './mutateChapter';

interface ChapterPropParams {
  // using `interface` is also ok
  workID: number;
  chID: number;
  mode: Mode;
  switchMode: (mode: Mode) => void;
  setChID: (id: number) => void;
};

// interface IChapterDraft {
//   title: string;
//   text: string;
//   // password: string;
// }
// interface ChapterProps extends RouteComponentProps<ChapterPropParams>, AppRouteParams { }

export function Chapter(props: ChapterPropParams) {
  const chID = props.chID;
  const workID = props.workID;
  const mode = props.mode;

  // const [chID, setChID] = useState(props.chID)
  const [title, setTitle] = useState('')
  const [text, setText] = useState('')

  const { loading, data } = useQuery<FetchChapter>
    (fetchChapter, {
      variables: { chID },
    })

  React.useEffect(() => {
    if (data && mode != Mode.ADDNEW) {
      setTitle(data.chapter?.title || '')
      setText(data.chapter?.text || '')
      //console.log(data)
      //console.log(chID) //DEBUG
    }
    if (mode == Mode.ADDNEW) {
      setTitle('')
      setText('')
    }
  }, [data])//set only when data is available

  function postNewChapter() {
    postChapter(getApolloClient(), {
      workID: workID,
      chapterTitle: title,
      chapterText: text
    }).then((res) => {
      console.log(res.data?.addChapter)
      props.setChID(Number(res.data?.addChapter))
      props.switchMode(Mode.VIEW)
    })
  }

  function saveDraft() {
    updateChapter(getApolloClient(), {
      chapterID: chID,
      title: title,
      text: text
    }).then(() => {
      props.switchMode(Mode.VIEW)
    })
  }

  if (loading || data == null) {
    return <div>loading...</div>
  }
  // if (chID == 0 && mode != Mode.ADDNEW) {//will introduce bug
  if (chID == 0) {//TODO: Enable adding new chapter for a new book (w/o any chapter)
    return (
      <Section>
        <H2>Use the "+" button to add a new chapter to this work.</H2>
      </Section>
    )
  }
  if (data.chapter == null) {
    //TODO(checking for window object):alert("Invalid Chapter. Redirecting to the first chapter (if there exist one).");
    props.setChID(0)
    return <div>Invalid Chapter</div>
  }

  if (mode == Mode.ADDNEW) {
    return (
      <Section>
        <Input
          type="text"
          name="title"
          value={title}
          $onChange={setTitle}
          $onSubmit={postNewChapter}
        >
        </Input>
        <Spacer $h4 />
        <textarea
          name="text"
          value={text}
          onChange={(
            ev: React.ChangeEvent<HTMLTextAreaElement>,
          ): void => setText(ev.target.value)}
          onSubmit={postNewChapter}
        ></textarea>
        <Spacer $h4 />
        <Button onClick={postNewChapter}>Post</Button>
      </Section>
    );
  }

  if (mode == Mode.EDIT) {
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
  //mode == Mode.VIEW
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
