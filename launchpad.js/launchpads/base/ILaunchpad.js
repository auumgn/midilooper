export function isButton(x) {
    return x !== null && typeof x === 'object' && 'nr' in x;
}
