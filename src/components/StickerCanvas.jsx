import { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import { getStickerUrl, getStickerSvg } from '../utils/stickerConfig';


export default function StickerCanvas({ stickers = [], readOnly = true, onUpdate, onRemove }) {
    const containerRef = useRef(null);
    const [draggingIdx, setDraggingIdx] = useState(null);
    const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

    const handlePointerDown = (e, idx) => {
        if (readOnly) return;
        e.preventDefault(); // Prevents touch scrolling
        e.stopPropagation();

        const container = containerRef.current;
        if (!container) return;

        const rect = container.getBoundingClientRect();

        const sticker = stickers[idx];
        const startX = e.clientX;
        const startY = e.clientY;
        const startLeft = sticker.x;
        const startTop = sticker.y;

        setDraggingIdx(idx);

        const handlePointerMove = (moveEvent) => {
            const dx = moveEvent.clientX - startX;
            const dy = moveEvent.clientY - startY;

            let newX = startLeft + (dx / rect.width) * 100;
            let newY = startTop + (dy / rect.height) * 100;

            newX = clamp(newX, -10, 90);
            newY = clamp(newY, -10, 90);

            if (onUpdate) {
                onUpdate(idx, { ...sticker, x: newX, y: newY });
            }
        };

        const handlePointerUp = () => {
            setDraggingIdx(null);
            window.removeEventListener('pointermove', handlePointerMove);
            window.removeEventListener('pointerup', handlePointerUp);
        };

        window.addEventListener('pointermove', handlePointerMove);
        window.addEventListener('pointerup', handlePointerUp);
    };

    return (
        <div
            ref={containerRef}
            style={{
                position: 'absolute',
                inset: 0,
                pointerEvents: readOnly ? 'none' : 'auto',
                overflow: 'hidden',
                zIndex: 3
            }}
        >
            {stickers.map((s, i) => (
                <div
                    key={s.id + '-' + i}
                    onPointerDown={(e) => handlePointerDown(e, i)}
                    style={{
                        position: 'absolute',
                        left: `${s.x}%`,
                        top: `${s.y}%`,
                        width: 'auto',
                        height: readOnly ? '42px' : '48px',
                        cursor: readOnly ? 'default' : (draggingIdx === i ? 'grabbing' : 'grab'),
                        transform: s.rotation ? `rotate(${s.rotation}deg)` : 'none',
                        transition: draggingIdx === i ? 'none' : 'opacity 0.2s',
                        zIndex: draggingIdx === i ? 20 : 2,
                        pointerEvents: 'auto',
                        touchAction: 'none' // Required for pointer events on mobile
                    }}
                >
                    <img
                        src={getStickerUrl(s.designId)}
                        alt=""
                        style={{ width: 'auto', height: '100%', maxWidth: '80px', objectFit: 'contain', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))' }}
                        draggable={false}
                        onError={(e) => { e.target.onerror = null; e.target.src = getStickerSvg(s.designId); }}
                    />

                    {!readOnly && (
                        <button
                            type="button"
                            onPointerDown={e => e.stopPropagation()}
                            onClick={() => onRemove && onRemove(i)}
                            style={{
                                position: 'absolute',
                                top: '-6px',
                                right: '-6px',
                                background: '#ef4444',
                                color: 'white',
                                border: 'none',
                                borderRadius: '50%',
                                width: '20px',
                                height: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                            }}
                        >
                            <X size={12} strokeWidth={3} />
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
}
