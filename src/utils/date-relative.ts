import { DateTime } from 'luxon'

export function dateRelative(timestamp: number): string | null {
    return DateTime.fromMillis(timestamp).toRelative()
}
