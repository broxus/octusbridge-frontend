import * as React from 'react'

import { ValidationRoundStore } from '@/modules/Relayers/store'

export function useValidationRoundStore(): ValidationRoundStore {
    const ref = React.useRef<ValidationRoundStore>()
    ref.current = ref.current || new ValidationRoundStore()
    return ref.current
}
