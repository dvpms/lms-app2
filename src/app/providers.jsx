'use client'

import { Provider } from 'react-redux'
import { SessionProvider } from 'next-auth/react'
import { store } from '@/lib/redux/store'

export default function Providers({ children, session = null }) {
  return (
    <SessionProvider session={session} refetchInterval={0}>
      <Provider store={store}>
        {children}
      </Provider>
    </SessionProvider>
  )
}
