import * as React from 'react'
import * as ReactDOM from 'react-dom/client'
import init from 'eth-ton-abi-converter'

import { App } from '@/components/App'
import { LocalizationProvider } from '@/context/Localization'
import '@/polyfills'



(async () => {
    await init()
})()


const container = document.getElementById('root')
if (container != null) {
    const root = ReactDOM.createRoot(container)
    root.render(
        <React.StrictMode>
            <LocalizationProvider>
                <App />
            </LocalizationProvider>
        </React.StrictMode>,
    )
}

if (process.env.NODE_ENV === 'development') {
    // @ts-ignore
    if (import.meta.webpackHot) {
        // @ts-ignore
        import.meta.webpackHot.accept()
    }
}
