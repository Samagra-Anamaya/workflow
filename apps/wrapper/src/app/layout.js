"use client"
import './globals.css'
import 'animate.css';
import { Provider } from 'react-redux';
import { store } from './redux/store.js'


export default function RootLayout({ children }) {

  return (
    <html lang="en">
      <body >
        <Provider store={store} data-testid="redux-provider">
          {children}
        </Provider>
      </body>

    </html>
  )
}