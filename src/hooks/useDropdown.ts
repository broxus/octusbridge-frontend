import * as React from 'react'

type Dropdown<T extends HTMLDivElement> = {
    visible: boolean
    popupRef: React.RefObject<T>
    open: () => void
    hide: () => void
}

export function useDropdown<T extends HTMLDivElement>(
    autoClose: boolean = true,
): Dropdown<T> {
    const [visible, setVisible] = React.useState(false)
    const popupRef = React.useRef<T>(null)

    const open = () => {
        setVisible(true)
    }

    const hide = () => {
        setVisible(false)
    }

    React.useEffect(() => {
        const onClickDocument = (e: MouseEvent) => {
            if (
                e.target
                && document.body.contains(e.target as Node)
                && !popupRef.current?.contains(e.target as Node)
            ) {
                hide()
            }
        }

        if (visible && autoClose) {
            setTimeout(() => {
                document.addEventListener('click', onClickDocument, false)
            }, 0)
        }

        return () => {
            if (visible && autoClose) {
                document.removeEventListener('click', onClickDocument, false)
            }
        }
    }, [
        visible,
        setVisible,
        popupRef.current,
        autoClose,
    ])

    return {
        visible,
        popupRef,
        open,
        hide,
    }
}
