import * as React from 'react'

import { useMounted } from '@/hooks/useMounted'

export function useScrollTop(): boolean {
    const mounted = useMounted()

    React.useEffect(() => {
        if (mounted) {
            window.scrollTo(0, 0)
        }
    }, [mounted])

    return mounted
}
