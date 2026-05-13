
export const STICKER_DESIGNS = [
    { id: 1, name: 'Reciclaje', emoji: 'RC' },
    { id: 2, name: 'Hoja Verde', emoji: 'HO' },
    { id: 3, name: 'Agua', emoji: 'AG' },
    { id: 4, name: 'Tierra', emoji: 'TI' },
    { id: 5, name: 'Energía', emoji: 'EN' },
    { id: 6, name: 'Planta', emoji: 'PL' },
    { id: 7, name: 'Foco ECO', emoji: 'FO' },
    { id: 8, name: 'Corazón', emoji: 'CO' },
    { id: 9, name: 'Mar', emoji: 'MA' },
    { id: 10, name: 'Peligro', emoji: 'PE' },
];

export function getStickerById(id) {
    return STICKER_DESIGNS.find(s => s.id === Number(id)) || STICKER_DESIGNS[0];
}

export function getStickerUrl(id) {
    return `/stickers/sticker-${id}.png`;
}

export const getStickerSvg = (id) => {
    const s = STICKER_DESIGNS.find(d => d.id === id) || STICKER_DESIGNS[0];
    const encodedSvg = encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%">
            <circle cx="50" cy="50" r="46" fill="#f3f4f6" stroke="#e5e7eb" stroke-width="8"/>
            <text x="50" y="58" font-family="system-ui, sans-serif" font-size="34" font-weight="bold" fill="#6b7280" text-anchor="middle" dominant-baseline="middle">${s.emoji}</text>
        </svg>
    `.trim());
    return `data:image/svg+xml;utf8,${encodedSvg}`;
}
