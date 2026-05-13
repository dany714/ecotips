
export function sanitize(text) {
    if (typeof text !== 'string') return text;
    return text.trim();
}
export function truncate(text, maxLength) {
    if (typeof text !== 'string') return text;
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
}
