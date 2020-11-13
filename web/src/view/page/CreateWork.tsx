import * as React from 'react'
import { useState } from 'react'
import { Button } from '../../style/button'
import { Input } from '../../style/input'

export function CreateWork() {
  const [text, setText] = useState('')

  function postWork() {
    return
  }

  return (
    <>
      <div className="mt3">
        <label className="db fw4 lh-copy f6" htmlFor="text">
          Enter Text
        </label>
        <Input $onChange={setText} $onSubmit={postWork} name="email" type="email" />
      </div>
      <div className="mt3">
        <Button onClick={postWork}>Post</Button>
      </div>
      <div> {text} </div>
    </>
  )
}
