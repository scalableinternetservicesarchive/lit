import { RouteComponentProps } from '@reach/router'
// import { RouteComponentProps } from '@reach/router'
import * as React from 'react'
import { Login } from '../auth/Login'
import { AppRouteParams } from '../nav/route'
// import { AppRouteParams, PlaygroundApp } from '../nav/route'
// import { Surveys } from '../playground/Surveys'
import { Page } from './Page'

// IF NO PROPS, APP.TSX GIVES SOME ERROR ABOUT INTRINSIC TYPE
interface LoginPageProps extends RouteComponentProps, AppRouteParams {}

export function LoginPage(props: LoginPageProps) {
  return <Page>{<Login />}</Page>
}
