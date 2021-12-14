import { DateTime } from 'luxon'

export function dateFormat(timestamp: number): string {
    return DateTime.fromMillis(timestamp).toFormat('MMM dd, yyyy, HH:mm')
}
