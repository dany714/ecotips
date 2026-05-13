import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Heart, Flag, Edit2, Trash2, MessageSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import EditTipModal from './EditTipModal';
import { getPostitForTip, getPostitById, getPostitImageUrl, getPostitSvgUrl } from '../utils/postitConfig';
import StickerCanvas from './StickerCanvas';
import ConfirmModal from './ConfirmModal';


function getCardHeightClass(tipId) {
    if (!tipId) return 'card-h-md';
    let hash = 0;
    for (let i = 0; i < tipId.length; i++) {
        hash = (hash * 31 + tipId.charCodeAt(i)) >>> 0;
    }
    // 3 alturas: sm → md → lg
    const classes = ['card-h-sm', 'card-h-md', 'card-h-md', 'card-h-lg'];
    return classes[hash % classes.length];
}

const TipCard = React.memo(({ tip, onClick, onAuthRequired, commentCount = 0 }) => {
    const { user } = useAuth();
    const { t } = useLanguage();
    const { likeTip, hasLiked, deleteTip, moderatorDeleteTip } = useData();
    const [showEdit, setShowEdit] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showModDeleteConfirm, setShowModDeleteConfirm] = useState(false);
    const [modDeleteReason, setModDeleteReason] = useState('Incumplimiento de las normas de la comunidad');
    const [likeBounce, setLikeBounce] = useState(false);
    const [floatingHearts, setFloatingHearts] = useState([]);

    const categoryDict = {
        'Residuos': t('catWaste'),
        'Reciclaje': t('catRecycling'),
        'Energía': t('catEnergy'),
        'Naturaleza': t('catNature')
    };

    const postit = useMemo(() =>
        tip.designId ? getPostitById(tip.designId) : getPostitForTip(tip.id),
        [tip.designId, tip.id]
    );
    const pngSrc = useMemo(() => getPostitImageUrl(postit), [postit]);
    const svgSrc = useMemo(() => getPostitSvgUrl(postit), [postit]);

    const [imgSrc, setImgSrc] = useState(pngSrc);
    const [imgFailed, setImgFailed] = useState(false);

    useEffect(() => {
        setImgSrc(pngSrc);
        setImgFailed(false);
    }, [pngSrc]);

    const clickTimeoutRef = useRef(null);

    const isOwner = user && user.id === tip.authorId;
    const isModerator = user?.role === 'moderator';
    const liked = hasLiked(tip.id);

    // Clase de altura de tarjeta determinista
    const heightClass = useMemo(() => getCardHeightClass(tip.id), [tip.id]);

    const isLikingRef = useRef(false);

    const handleLike = async (e) => {
        if (e && e.stopPropagation) e.stopPropagation();
        if (!user) { onAuthRequired?.(); return; }

        if (isLikingRef.current) return;
        isLikingRef.current = true;

        setLikeBounce(true);
        setTimeout(() => setLikeBounce(false), 280);

        try {
            await likeTip(tip.id);
        } finally {
            isLikingRef.current = false;
        }
    };

    const handleReport = (e) => {
        e.stopPropagation();
        if (!user) { onAuthRequired?.(); return; }
        onClick({ ...tip, _openReport: true });
    };

    const handleDelete = (e) => {
        e.stopPropagation();
        if (isModerator && !isOwner) {
            setModDeleteReason('Incumplimiento de las normas de la comunidad');
            setShowModDeleteConfirm(true);
        } else {
            setShowDeleteConfirm(true);
        }
    };

    const handleEdit = (e) => {
        e.stopPropagation();
        setShowEdit(true);
    };

    const handleDoubleClickAction = (clientX, clientY, currentTarget) => {
        if (!user) { onAuthRequired?.(); return; }
        const rect = currentTarget.getBoundingClientRect();
        const x = clientX - rect.left;
        const y = clientY - rect.top;
        const newHeart = { id: Date.now(), x, y };
        setFloatingHearts(prev => [...prev, newHeart]);
        setTimeout(() => setFloatingHearts(prev => prev.filter(h => h.id !== newHeart.id)), 1000);
        if (!liked) {
            handleLike();
        } else {
            setLikeBounce(true);
            setTimeout(() => setLikeBounce(false), 280);
        }
    };

    const handleCardClick = (e) => {
        // Ignorar si el clic viene de un botón interactivo
        if (e.target.closest('button')) return;

        const clientX = e.clientX;
        const clientY = e.clientY;
        const currentTarget = e.currentTarget;

        if (clickTimeoutRef.current) {
            // Doble clic detectado
            clearTimeout(clickTimeoutRef.current);
            clickTimeoutRef.current = null;
            handleDoubleClickAction(clientX, clientY, currentTarget);
        } else {
            // Clic simple (esperamos a ver si es doble clic)
            clickTimeoutRef.current = setTimeout(() => {
                clickTimeoutRef.current = null;
                onClick(tip);
            }, 275);
        }
    };

    const categoryColors = {
        'Naturaleza': '#14532d',
        'Residuos': '#78350f',
        'Reciclaje': '#065f46',
        'Energía': '#1e3a5f',
    };

    const categoryBg = {
        'Naturaleza': 'rgba(20,83,45,0.9)',
        'Residuos': 'rgba(120,53,15,0.9)',
        'Reciclaje': 'rgba(6,95,70,0.9)',
        'Energía': 'rgba(30,58,95,0.9)',
    };

    return (
        <>
            <article
                className={`pinterest-card ${heightClass} animate-fade`}
                style={{ backgroundColor: postit.fallbackColor }}
                onClick={handleCardClick}
                role="article"
                aria-label={`Tip: ${tip.title}`}
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && onClick(tip)}
            >

                {!imgFailed && (
                    <img
                        src={imgSrc}
                        alt=""
                        aria-hidden="true"
                        className="postit-bg-img"
                        loading="lazy"
                        onError={() => {
                            if (imgSrc !== svgSrc) {
                                setImgSrc(svgSrc);
                            } else {
                                setImgFailed(true);
                            }
                        }}
                    />
                )}
                {imgFailed && <div className="postit-fold" />}

                {tip.stickers && tip.stickers.length > 0 && (
                    <StickerCanvas stickers={tip.stickers} readOnly={true} />
                )}

                {/* Floating hearts on double tap */}
                {floatingHearts.map(h => (
                    <div key={h.id} style={{
                        position: 'absolute', left: h.x, top: h.y,
                        pointerEvents: 'none', zIndex: 10,
                        animation: 'floatUp 1s ease-out forwards', color: '#ef4444'
                    }}>
                        <Heart size={44} fill="currentColor" strokeWidth={0} />
                    </div>
                ))}

                {(isOwner || isModerator) && (
                    <div
                        style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', gap: '4px', zIndex: 20 }}
                        onClick={e => e.stopPropagation()}
                    >
                        <button
                            onClick={handleEdit}
                            aria-label="Editar tip"
                            style={{ background: 'rgba(255,255,255,0.82)', backdropFilter: 'blur(4px)', border: 'none', cursor: 'pointer', color: '#374151', borderRadius: '6px', padding: '5px', display: 'flex' }}
                        >
                            <Edit2 size={13} />
                        </button>
                        <button
                            onClick={handleDelete}
                            aria-label="Eliminar tip"
                            style={{ background: 'rgba(255,255,255,0.82)', backdropFilter: 'blur(4px)', border: 'none', cursor: 'pointer', color: '#ef4444', borderRadius: '6px', padding: '5px', display: 'flex' }}
                        >
                            <Trash2 size={13} />
                        </button>
                    </div>
                )}

                {/* Text content — floats above background image */}
                <div className="postit-content" style={{ position: 'relative', zIndex: 15, paddingRight: (isOwner || isModerator) ? '60px' : '14px' }}>
                    <h3 className="postit-title">{tip.title}</h3>
                    {tip.description && (
                        <p className="postit-desc">{tip.description}</p>
                    )}
                </div>

                {/* Footer */}
                <div className="postit-footer" style={{ position: 'relative', zIndex: 15 }}>
                    <span style={{
                        fontSize: '0.62rem', padding: '2px 8px',
                        background: categoryBg[tip.category] || 'rgba(31,41,55,0.88)',
                        color: 'white', borderRadius: '99px', fontWeight: 700,
                        letterSpacing: '0.06em', textTransform: 'uppercase',
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        backdropFilter: 'blur(4px)',
                    }}>
                        {categoryDict[tip.category] || tip.category}
                    </span>
                    <div style={{ fontSize: '0.68rem', color: '#111', marginTop: '5px', fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, textShadow: '0 0 5px rgba(255,255,255,0.9), 0 1px 3px rgba(255,255,255,0.75)' }}>
                        {t('by')}{' '}<strong
                            onClick={(e) => {
                                if (!tip.authorId) return;
                                e.stopPropagation();
                                onClick({ ...tip, _filterAuthor: { id: tip.authorId, name: tip.authorName } });
                            }}
                            title={tip.authorId ? "Ver tips de este usuario" : ""}
                            style={{
                                cursor: tip.authorId ? 'pointer' : 'default',
                                textDecoration: tip.authorId ? 'underline' : 'none',
                                display: 'inline-block',
                                maxWidth: '120px',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                verticalAlign: 'bottom'
                            }}
                        >
                            {tip.authorName || t('anonymous')}
                        </strong>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '7px', borderTop: '1px solid rgba(0,0,0,0.08)', paddingTop: '7px' }}>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button
                                onClick={handleLike}
                                aria-label={liked ? 'Quitar me gusta' : 'Me gusta'}
                                aria-pressed={liked}
                                style={{
                                    background: 'transparent', border: 'none', cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', gap: '4px',
                                    color: liked ? '#ef4444' : '#111', fontSize: '0.78rem', fontWeight: 700,
                                    transform: likeBounce ? 'scale(1.4)' : 'scale(1)',
                                    transition: 'transform 0.2s cubic-bezier(0.34,1.56,0.64,1), color 0.15s',
                                    fontFamily: "'Inter', sans-serif",
                                    textShadow: '0 0 5px rgba(255,255,255,0.9)',
                                }}
                            >
                                <Heart size={14} fill={liked ? 'currentColor' : 'none'} strokeWidth={liked ? 0 : 1.8} />
                                <span aria-live="polite">{tip.likes}</span>
                            </button>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#111', fontSize: '0.78rem', fontFamily: "'Inter', sans-serif", fontWeight: 700, textShadow: '0 0 5px rgba(255,255,255,0.9)' }}>
                                <MessageSquare size={14} strokeWidth={1.5} />
                                <span>{commentCount}</span>
                            </div>
                        </div>
                        <button
                            onClick={handleReport}
                            aria-label="Reportar este tip"
                            style={{
                                background: 'transparent', border: 'none', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', gap: '4px',
                                color: tip.reportsCount > 0 && isModerator ? '#f59e0b' : '#9ca3af',
                                fontSize: '0.78rem',
                            }}
                        >
                            <Flag size={14} strokeWidth={1.5} />
                            {isModerator && tip.reportsCount > 0 && (
                                <span style={{ fontSize: '0.7rem' }}>{tip.reportsCount}</span>
                            )}
                        </button>
                    </div>
                </div>
            </article>

            {showEdit && (
                <EditTipModal
                    tip={tip}
                    onClose={() => setShowEdit(false)}
                    asModerator={isModerator && !isOwner}
                />
            )}

            {showDeleteConfirm && (
                <ConfirmModal
                    title={t('deleteTip') || 'Eliminar tip'}
                    message={t('confirmDelete') || '¿Seguro que deseas eliminar este tip?'}
                    onConfirm={() => deleteTip(tip.id)}
                    onClose={() => setShowDeleteConfirm(false)}
                />
            )}

            {showModDeleteConfirm && (
                <ConfirmModal
                    title="Eliminar tip (Moderador)"
                    message={
                        <div>
                            <p style={{ marginBottom: '12px' }}>¿Seguro que quieres eliminar este tip? El autor recibirá una notificación.</p>
                            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '6px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Motivo:</label>
                            <input
                                className="form-input"
                                defaultValue={modDeleteReason}
                                onChange={e => setModDeleteReason(e.target.value)}
                                style={{ fontSize: '0.85rem', padding: '8px 12px' }}
                                autoFocus
                            />
                        </div>
                    }
                    confirmText="Eliminar"
                    onConfirm={() => {
                        const reason = modDeleteReason.trim() || 'Incumplimiento de las normas de la comunidad';
                        moderatorDeleteTip(tip.id, reason);
                    }}
                    onClose={() => setShowModDeleteConfirm(false)}
                />
            )}
        </>
    );
});

export default TipCard;
