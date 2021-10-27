export function debounce<T>(
    fn: (...args: any[]) => T,
    wait: number,
    immediate?: boolean,
): (...args: any[]) => void {
    let timeout: ReturnType<typeof setTimeout>

    return (...args: any[]) => {
        const later = () => {
            clearTimeout(timeout)

            if (!immediate) {
                fn(...args)
            }
        }

        const now = immediate && !timeout

        clearTimeout(timeout)

        timeout = setTimeout(later, wait)

        if (now) {
            fn(...args)
        }
    }
}
