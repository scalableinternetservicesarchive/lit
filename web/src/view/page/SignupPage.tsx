import { RouteComponentProps } from '@reach/router'
// import { RouteComponentProps } from '@reach/router'
import * as React from 'react'
import { Signup } from '../auth/Signup'
import { AppRouteParams } from '../nav/route'
// import { AppRouteParams, PlaygroundApp } from '../nav/route'
// import { Surveys } from '../playground/Surveys'
import { Page } from './Page'

// IF NO PROPS, APP.TSX GIVES SOME ERROR ABOUT INTRINSIC TYPE
interface SignupPageProps extends RouteComponentProps, AppRouteParams {}

export function SignupPage(props: SignupPageProps) {
  return <Page>{<Signup />}</Page>
}
