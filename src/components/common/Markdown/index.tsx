import * as React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

import './index.scss'

type Props = {
    value: string;
}

export function Markdown({
    value,
}: Props): JSX.Element {
    return (
        <ReactMarkdown className="markdown" plugins={[remarkGfm]}>
            {value}
        </ReactMarkdown>
    )
}
