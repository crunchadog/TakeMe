const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

export function generateOrgToken(): string {
    let firstPart = ''
    let secondPart = ''

    for (let i = 0; i < 4; i++) {
        firstPart += ALPHABET[Math.floor(Math.random() * ALPHABET.length)]
        secondPart += ALPHABET[Math.floor(Math.random() * ALPHABET.length)]
    }

    return `TakeMe-${firstPart}-${secondPart}`
}