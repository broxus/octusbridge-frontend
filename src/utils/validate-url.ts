export function validateUrl(val: string): boolean {
    return /^(http|https):\/\/[^ "]+$/.test(val)
}
