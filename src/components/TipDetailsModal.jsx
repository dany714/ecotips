import { useState, useMemo, useEffect } from 'react';
import { X, Send, Trash2, Flag, MessageSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import { getPostitById, getPostitForTip, getPostitImageUrl, getPostitSvgUrl } from '../utils/postitConfig';
import StickerCanvas from './StickerCanvas';
import AvatarIcon from './AvatarIcon';
import { useModalBodyClass } from '../hooks/useModalBodyClass';

export default function TipDetailsModal({ tip, onClose, onReport, onAuthorClick }) {
    const { user } = useAuth();
    const { comments, addComment, deleteComment } = useData();
    const { lang, t } = useLanguage();
    useModalBodyClass();

    const categoryDict = {
        'Residuos': t('catWaste'),
        'Reciclaje': t('catRecycling'),
        'Energía': t('catEnergy'),
        'Naturaleza': t('catNature')
    };
    const [newComment, setNewComment] = useState('');

    // Lógica de la Interfaz del Post-it — idéntico a TipCard: designId → getPostitById, sino hash → getPostitForTip
    const postit = useMemo(() =>
        tip.designId ? getPostitById(tip.designId) : getPostitForTip(tip.id),
        [tip.designId, tip.id]
    );
    const pngSrc = useMemo(() => getPostitImageUrl(postit), [postit]);
    const svgSrc = useMemo(() => getPostitSvgUrl(postit), [postit]);
    const [imgFailed, setImgFailed] = useState(false);
    useEffect(() => { setImgFailed(false); }, [pngSrc]);

    const tipComments = comments.filter(c => c.tipId === tip.id);

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        await addComment(tip.id, newComment, user?.name);
        setNewComment('');
    };

    return (
        <div className="modal-overlay animate-fade" onClick={e => e.target === e.currentTarget && onClose()}>
            <div className="modal animate-scale" style={{ maxWidth: '620px', display: 'flex', flexDirection: 'column', height: '88vh', maxHeight: '820px', padding: 0, overflow: 'hidden', borderRadius: 'var(--radius-xl)' }}>

                {/* Encabezado incrustado directamente en el Fondo del Postit */}
                <div style={{ position: 'relative', width: '100%', minHeight: '280px', maxHeight: '52vh', display: 'flex', flexDirection: 'column' }}>

                    {/* Renderización del fondo */}
                    <div style={{ position: 'absolute', inset: 0, zIndex: 0, backgroundColor: postit.fallbackColor }}>
                        {!imgFailed ? (
                            <img
                                src={pngSrc}
                                alt=""
                                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                                onError={() => setImgFailed(true)}
                            />
                        ) : (
                            <img
                                src={svgSrc}
                                alt=""
                                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                            />
                        )}
                    </div>

                    {tip.stickers && tip.stickers.length > 0 && (
                        <StickerCanvas stickers={tip.stickers} readOnly={true} />
                    )}

                    {/* Content over postit */}
                    <div style={{ position: 'relative', zIndex: 20, padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                            <span className="badge" style={{ background: 'rgba(0,0,0,0.06)', color: 'inherit' }}>
                                {categoryDict[tip.category] || tip.category}
                            </span>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                {user && user.id !== tip.authorId && (
                                    <button
                                        onClick={() => { if (onReport) onReport(tip); }}
                                        style={{
                                            background: 'rgba(255,255,255,0.25)',
                                            border: 'none',
                                            borderRadius: '50%',
                                            width: '32px',
                                            height: '32px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                            color: 'rgba(0,0,0,0.4)',
                                            transition: 'background 0.15s, color 0.15s',
                                        }}
                                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.15)'; e.currentTarget.style.color = '#ef4444'; }}
                                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.25)'; e.currentTarget.style.color = 'rgba(0,0,0,0.4)'; }}
                                        title={t('reportTip')}
                                    >
                                        <Flag size={14} />
                                    </button>
                                )}
                                <button className="modal-close-btn" onClick={onClose} style={{ background: 'rgba(255,255,255,0.4)' }}>
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        <h2 style={{ fontSize: '1.25rem', fontWeight: 900, margin: '0 0 8px', color: '#000', lineHeight: 1.25, paddingLeft: '8px', paddingTop: '4px', textShadow: '0 0 8px rgba(255,255,255,0.95), 0 1px 4px rgba(255,255,255,0.85), -1px -1px 0 rgba(255,255,255,0.5), 1px 1px 0 rgba(255,255,255,0.5), 0 2px 6px rgba(0,0,0,0.25)' }}>
                            {tip.title}
                        </h2>
                        <div style={{ flex: 1, overflowY: 'auto', minHeight: 0, paddingRight: '8px', paddingLeft: '8px' }}>
                            <p style={{ margin: 0, fontSize: '0.9rem', color: 'rgba(0,0,0,0.85)', fontWeight: 600, lineHeight: 1.4, whiteSpace: 'pre-wrap', textShadow: '0 0 6px rgba(255,255,255,0.9), 0 1px 4px rgba(255,255,255,0.8)' }}>
                                {tip.description}
                            </p>
                        </div>

                        <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.8, paddingLeft: '8px' }}>
                            <AvatarIcon avatarId={tip.authorAvatarId || 1} name={tip.authorName || 'Anónimo'} size={24} />
                            <small
                                onClick={() => {
                                    if (tip.authorId && onAuthorClick) onAuthorClick(tip.authorId, tip.authorName);
                                }}
                                title={tip.authorId ? "Ver tips de este usuario" : ""}
                                style={{ fontWeight: 600, cursor: tip.authorId ? 'pointer' : 'default', textDecoration: tip.authorId ? 'underline' : 'none' }}
                            >
                                {t('by')} {tip.authorName || t('anonymous')}
                            </small>
                        </div>
                    </div>
                </div>

                {/* (Reporting UI moved to parent using ReportModal) */}

                {/* Comments Section */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '24px', background: 'var(--surface)', display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 800, margin: '0 0 18px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        <MessageSquare size={16} color="var(--primary)" /> {t('comments')} <span style={{ background: 'var(--grey-100)', color: 'var(--text-secondary)', borderRadius: '99px', fontSize: '0.72rem', padding: '1px 8px', fontWeight: 700 }}>{tipComments.length}</span>
                    </h3>

                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {tipComments.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '36px 0', color: 'var(--text-muted)' }}>
                                <MessageSquare size={28} style={{ marginBottom: '10px', opacity: 0.25 }} />
                                <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{t('noComments')}</p>
                            </div>
                        ) : (
                            tipComments.map(c => (
                                <div key={c.id} style={{ display: 'flex', gap: '12px' }}>
                                    <AvatarIcon avatarId={c.authorAvatarId || 1} name={c.authorName || 'User'} size={32} />
                                    <div style={{ flex: 1, minWidth: 0, background: 'var(--grey-50)', padding: '12px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', alignItems: 'flex-start', gap: '8px' }}>
                                            <strong style={{
                                                fontSize: '0.82rem', color: 'var(--text-primary)', fontFamily: "'Plus Jakarta Sans', sans-serif",
                                                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%'
                                            }} title={c.authorName}>
                                                {c.authorName}
                                            </strong>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                                                <small style={{ color: 'var(--text-muted)', fontSize: '0.7rem', whiteSpace: 'nowrap' }}>
                                                    {new Date(c.createdAt).toLocaleDateString(lang === 'es' ? 'es-MX' : 'en-US')}
                                                </small>
                                                {(user?.id === c.authorId || user?.role === 'moderator') && (
                                                    <button
                                                        onClick={() => deleteComment(c.id)}
                                                        className="btn btn-ghost btn-sm"
                                                        style={{ padding: '0px', color: 'var(--danger)', height: 'auto', minHeight: 'auto', background: 'transparent', border: 'none' }}
                                                        title={lang === 'es' ? 'Eliminar comentario' : 'Delete comment'}
                                                    >
                                                        <Trash2 size={13} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.55, fontFamily: "'Plus Jakarta Sans', sans-serif", wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>
                                            {c.text}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Comment Input */}
                <div style={{ padding: '16px 24px', background: 'var(--grey-50)', borderTop: '1px solid var(--border)' }}>
                    {user ? (
                        <form onSubmit={handleAddComment} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <input
                                className="form-input"
                                value={newComment}
                                onChange={e => setNewComment(e.target.value)}
                                placeholder={t('addComment')}
                                style={{ margin: 0, flex: 1, borderRadius: 'var(--radius-full)', padding: '10px 16px' }}
                            />
                            <button type="submit" disabled={!newComment.trim()} className="btn" style={{ padding: '10px 18px', flexShrink: 0 }}>
                                <Send size={15} />
                            </button>
                        </form>
                    ) : (
                        <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.88rem', fontWeight: 600, padding: '4px 0' }}>
                            {t('loginToComment')}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
