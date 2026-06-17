export function getToken() {
    const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let firstPart = '';
    let secondPart = '';
    for (let i
        = 0; i < 4; i++) {
        firstPart += alphabet[Math.floor(Math.random() * alphabet.length)];
        secondPart += alphabet[Math.floor(Math.random() * alphabet.length)];
    }

    return `TakeMe-${firstPart}-${secondPart}`
}