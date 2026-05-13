
export const AVATAR_OPTIONS = [
    { id: 1, fallbackColor: '#16a34a', label: 'Verde' },
    { id: 2, fallbackColor: '#0284c7', label: 'Azul' },
    { id: 3, fallbackColor: '#7c3aed', label: 'Morado' },
    { id: 4, fallbackColor: '#db2777', label: 'Rosa' },
    { id: 5, fallbackColor: '#ea580c', label: 'Naranja' },
    { id: 6, fallbackColor: '#0d9488', label: 'Teal' },
    { id: 7, fallbackColor: '#dc2626', label: 'Rojo' },
    { id: 8, fallbackColor: '#ca8a04', label: 'Dorado' },
    { id: 9, fallbackColor: '#4f46e5', label: 'Índigo' },
    { id: 10, fallbackColor: '#059669', label: 'Esmeralda' },
];

export function getAvatarById(id) {
    return AVATAR_OPTIONS.find(a => a.id === Number(id)) || AVATAR_OPTIONS[0];
}

/** Primary image URL — user-supplied JPG */
export function getAvatarImageUrl(avatarId) {
    return `/avatars/avatar-${avatarId}.jpg`;
}
