import * as React from 'react'
import * as ReactDOM from 'react-dom'
import init from 'eth-ton-abi-converter'
import 'polyfills'

import { App } from '@/components/App'


(async () => {
    await init()
})()


ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root'),
)
