"use client"
import './globals.css'
import 'animate.css';
import { Provider } from 'react-redux';
import { store } from './redux/store.js'


export default function RootLayout({ children }) {

  return (
    <html lang="en">
      <body >
        <head>
          <link rel="icon" href="/assets/niramyaLogo.png" />
          <title>Workflow</title>
        </head>
        <Provider store={store} data-testid="redux-provider">
          {children}
        </Provider>
      </body>

      <script id="main-script" module type="text/javascript" src="./enketo-offline-fallback.js" charset="utf-8"></script>
      <script module type="text/javascript" src="./enketo-webform-edit.js" charset="utf-8"></script>
      <script module type="text/javascript" src="./enketo-webform-view.js" charset="utf-8"></script>
      <script module type="text/javascript" src="./enketo-webform.js" charset="utf-8"></script>
    </html>
  )
}