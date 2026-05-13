
export const POSTIT_DESIGNS = [
    { id: 1, name: 'Amarillo', fallbackColor: '#fef08a' },
    { id: 2, name: 'Verde', fallbackColor: '#bbf7d0' },
    { id: 3, name: 'Rosa', fallbackColor: '#fbcfe8' },
    { id: 4, name: 'Azul', fallbackColor: '#bfdbfe' },
    { id: 5, name: 'Durazno', fallbackColor: '#fed7aa' },
    { id: 6, name: 'Lavanda', fallbackColor: '#e9d5ff' },
    { id: 7, name: 'Cian', fallbackColor: '#cffafe' },
    { id: 8, name: 'Salmón', fallbackColor: '#fca5a5' },
    { id: 9, name: 'Lima', fallbackColor: '#d9f99d' },
    { id: 10, name: 'Crema', fallbackColor: '#fef9c3' },
];

export function getPostitForTip(tipId) {
    if (!tipId) return POSTIT_DESIGNS[0];
    let hash = 0;
    for (let i = 0; i < tipId.length; i++) {
        hash = (hash * 31 + tipId.charCodeAt(i)) >>> 0;
    }
    return POSTIT_DESIGNS[hash % POSTIT_DESIGNS.length];
}

export function getPostitById(designId) {
    return POSTIT_DESIGNS.find(d => d.id === Number(designId)) || POSTIT_DESIGNS[0];
}
export function getPostitImageUrl(design) {
    const id = typeof design === 'object' ? design.id : design;
    return `/postits/postit-${id}.png`;
}
export function getPostitSvgUrl(design) {
    const id = typeof design === 'object' ? design.id : design;
    return `/postits/postit-${id}.svg`;
}
