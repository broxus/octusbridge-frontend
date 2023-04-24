export function getRandomUint(bits: 8 | 16 | 32 | 64 | 128 | 160 | 256 = 32): string {
    // eslint-disable-next-line no-bitwise
    return Math.abs(~~(Math.random() * (2 ** bits)) | 0).toString()
}
