export function zip<A, B>(a: Array<A>, b: Array<B>): Array<[A, B]> {
    return a.map((e, i) => [e, b[i]])
}
