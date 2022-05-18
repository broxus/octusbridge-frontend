import * as React from 'react'
import { useLocation } from 'react-router-dom'

import { useMounted } from '@/hooks'

type Props = {
    children: React.ReactNode;
}

export function ScrollManager({
    children,
}: Props): JSX.Element {
    const location = useLocation()
    const mounted = useMounted()

    React.useEffect(() => {
        if (mounted) {
            window.scrollTo({
                top: 0,
                behavior: 'instant' as ScrollBehavior,
            })
        }
    }, [location.pathname, mounted])

    return (
        <>
            {children}
        </>
    )
}
