import * as React from 'react'
import classNames from 'classnames'

type Item = {
    key: string;
    value: React.ReactNode | string;
}

type Props = {
    items: Item[];
    compact?: boolean;
    space?: 'sm';
    adaptive?: boolean;
    className?: string;
}

export function Summary({
    items,
    compact,
    space,
    adaptive,
    className,
}: Props): JSX.Element {
    return (
        <ul
            className={classNames('summary', className, {
                summary_compact: compact,
                summary_adaptive: adaptive,
                [`summary_space_${space}`]: space !== undefined,
                [`summary_space_${space}`]: space !== undefined,
            })}
        >
            {items.map(({ key, value }) => (
                <li key={key}>
                    <span className="text-muted summary__key">
                        {key}
                    </span>

                    {value}
                </li>
            ))}
        </ul>
    )
}
