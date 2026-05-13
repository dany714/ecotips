/**
 * Componente Avatar — muestra el avatar de un usuario.
 */
import React, { useState } from 'react';
import { getAvatarById, getAvatarImageUrl } from '../utils/avatarConfig';

const AvatarIcon = React.memo(({ avatarId = 1, name = '?', size = 36, style = {} }) => {
    const avatar = getAvatarById(avatarId);
    const [imgFailed, setImgFailed] = useState(false);
    const initial = (name || '?')[0].toUpperCase();
    const fontSize = Math.round(size * 0.4);

    const baseStyle = {
        width: size, height: size,
        borderRadius: '50%',
        flexShrink: 0,
        overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: avatar.fallbackColor,
        color: 'white',
        fontWeight: 800,
        fontSize,
        ...style,
    };

    if (!imgFailed) {
        return (
            <div style={baseStyle}>
                <img
                    src={getAvatarImageUrl(avatarId)}
                    alt={name}
                    loading="lazy"
                    onError={() => setImgFailed(true)}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
            </div>
        );
    }

    return (
        <div style={baseStyle}>
            {initial}
        </div>
    );
});

export default AvatarIcon;
