import { DateTime } from 'luxon'

export function dateFormat(timestamp: number, format: string = 'MMM dd, yyyy, HH:mm'): string {
    return DateTime.fromMillis(timestamp).toFormat(format)
}
