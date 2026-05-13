import { useState } from 'react';
import { X, Shield } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import { POSTIT_DESIGNS, getPostitById, getPostitForTip, getPostitImageUrl, getPostitSvgUrl } from '../utils/postitConfig';
import { useModalBodyClass } from '../hooks/useModalBodyClass';
import { STICKER_DESIGNS, getStickerSvg } from '../utils/stickerConfig';
import StickerCanvas from './StickerCanvas';



export default function EditTipModal({ tip, onClose, asModerator }) {
    useModalBodyClass();
    const { editTip, moderatorEditTip } = useData();
    const { t } = useLanguage();
    const [title, setTitle] = useState(tip.title);
    const [description, setDescription] = useState(tip.description);
    const [category, setCategory] = useState(tip.category);
    const [stickers, setStickers] = useState(tip.stickers || []);
    const [imgFailed, setImgFailed] = useState({});

    const categories = [
        { id: 'Residuos', label: t('catWaste') },
        { id: 'Reciclaje', label: t('catRecycling') },
        { id: 'Energía', label: t('catEnergy') },
        { id: 'Naturaleza', label: t('catNature') }
    ];

    const currentDesign = tip.designId
        ? getPostitById(tip.designId)
        : getPostitForTip(tip.id);
    const [designId, setDesignId] = useState(currentDesign.id);
    const selectedDesign = POSTIT_DESIGNS.find(d => d.id === designId) || POSTIT_DESIGNS[0];

    const addSticker = (design) => {
        if (stickers.length >= 5) return;
        setStickers(prev => [
            ...prev, {
                id: Date.now() + Math.random(),
                designId: design.id,
                x: 10 + Math.random() * 60,
                y: 10 + Math.random() * 60,
                rotation: -15 + Math.random() * 30
            }
        ]);
    };

    const updateSticker = (index, newSticker) => {
        setStickers(prev => {
            const arr = [...prev];
            arr[index] = newSticker;
            return arr;
        });
    };

    const removeSticker = (index) => {
        setStickers(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim()) return;
        const updates = { title, description, category, designId, stickers, color: selectedDesign.fallbackColor };
        if (asModerator) {
            const reason = window.prompt(t('editReason'), t('defaultEditReason'));
            if (!reason) return; // Cancelar si no se proporciona ninguna razón
            moderatorEditTip(tip.id, updates, reason);
        } else {
            editTip(tip.id, updates);
        }
        onClose();
    };

    return (
        <div className="modal-overlay animate-fade" onClick={e => e.target === e.currentTarget && onClose()}>
            <div className="modal animate-scale">
                <div className="modal-header">
                    <h2 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                        {asModerator && <Shield size={18} />}
                        {asModerator ? t('editTipMod') : t('editTip')}
                    </h2>
                    <button className="modal-close-btn" onClick={onClose}><X size={20} /></button>
                </div>
                <form id="edit-tip-form" onSubmit={handleSubmit} className="modal-body">
                    <div className="form-group">
                        <label className="form-label">{t('titleLabel')}</label>
                        <input className="form-input" value={title} onChange={e => setTitle(e.target.value)} maxLength={60} required />
                    </div>
                    <div className="form-group">
                        <label className="form-label">{t('descLabel')}</label>
                        <textarea className="form-input" value={description} onChange={e => setDescription(e.target.value)} rows={4} maxLength={280} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">{t('categoryLabel')}</label>
                        <select className="form-input" value={category} onChange={e => setCategory(e.target.value)}>
                            {categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                        </select>
                    </div>

                    {/* Design Picker */}
                    <div className="form-group">
                        <label className="form-label">{t('designLabel')}</label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 44px)', gap: '8px' }}>
                            {POSTIT_DESIGNS.map(design => (
                                <button
                                    key={design.id}
                                    type="button"
                                    onClick={() => setDesignId(design.id)}
                                    style={{
                                        width: '44px', height: '44px',
                                        borderRadius: '10px',
                                        border: designId === design.id
                                            ? '3px solid #111'
                                            : '2px solid rgba(0,0,0,0.12)',
                                        transform: designId === design.id ? 'scale(1.15)' : 'scale(1)',
                                        transition: 'all 0.15s',
                                        cursor: 'pointer',
                                        overflow: 'hidden',
                                        padding: 0,
                                        background: design.fallbackColor,
                                        boxShadow: designId === design.id ? '0 2px 10px rgba(0,0,0,0.25)' : '0 1px 4px rgba(0,0,0,0.1)',
                                        position: 'relative',
                                    }}
                                >
                                    {!imgFailed[design.id] ? (
                                        <img
                                            src={getPostitImageUrl(design.id)}
                                            alt=""
                                            style={{ width: '100%', height: '100%', objectFit: 'fill', display: 'block' }}
                                            onError={() => setImgFailed(prev => ({ ...prev, [design.id]: true }))}
                                        />
                                    ) : (
                                        <img src={getPostitSvgUrl(design.id)} alt="" style={{ width: '100%', height: '100%', objectFit: 'fill', display: 'block' }} />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Sticker Picker */}
                    <div className="form-group" style={{ marginTop: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <label className="form-label" style={{ margin: 0 }}>{t('stickerLabel')}</label>
                            <span style={{ fontSize: '0.75rem', color: stickers.length >= 5 ? '#ef4444' : '#6b7280', fontWeight: 600 }}>
                                {stickers.length}/5
                            </span>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 36px)', gap: '8px', marginBottom: '16px' }}>
                            {STICKER_DESIGNS.map(st => (
                                <button
                                    key={st.id}
                                    type="button"
                                    disabled={stickers.length >= 5}
                                    onClick={() => addSticker(st)}
                                    title={st.name}
                                    style={{
                                        width: '36px', height: '36px',
                                        borderRadius: '8px',
                                        border: '1px solid rgba(0,0,0,0.1)',
                                        background: '#f9fafb',
                                        cursor: stickers.length >= 5 ? 'not-allowed' : 'pointer',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        opacity: stickers.length >= 5 ? 0.3 : 1,
                                        padding: '4px',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <img
                                        src={`/stickers/sticker-${st.id}.png`}
                                        alt={st.name}
                                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                        onError={(e) => { e.target.onerror = null; e.target.src = getStickerSvg(st.id); }}
                                    />
                                </button>
                            ))}
                        </div>

                        {/* Live Preview Area */}
                        <div style={{ marginTop: '24px' }}>
                            <label className="form-label">{t('previewLabel')}</label>
                            <div style={{
                                background: selectedDesign.fallbackColor,
                                borderRadius: '12px',
                                position: 'relative',
                                width: '100%',
                                aspectRatio: '1',
                                maxWidth: '280px',
                                margin: '0 auto',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                overflow: 'hidden'
                            }}>
                                {!imgFailed[selectedDesign.id] ? (
                                    <img src={getPostitImageUrl(selectedDesign.id)} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'fill' }} />
                                ) : (
                                    <img src={getPostitSvgUrl(selectedDesign.id)} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'fill' }} />
                                )}
                                <div style={{ position: 'absolute', inset: '24px 20px 20px 24px', display: 'flex', flexDirection: 'column' }}>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: '0 0 8px', color: '#111', wordBreak: 'break-word', lineHeight: 1.2, textShadow: '0 1px 3px rgba(255,255,255,0.7)' }}>
                                        {title || t('previewTitleFallback')}
                                    </h3>
                                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#333', lineHeight: 1.4, wordBreak: 'break-word', whiteSpace: 'pre-wrap', textShadow: '0 1px 2px rgba(255,255,255,0.5)', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 8, WebkitBoxOrient: 'vertical' }}>
                                        {description || t('previewDescFallback')}
                                    </p>
                                </div>
                                <div style={{ position: 'absolute', inset: 0, zIndex: 10 }}>
                                    <StickerCanvas
                                        stickers={stickers}
                                        readOnly={false}
                                        onUpdate={updateSticker}
                                        onRemove={removeSticker}
                                    />
                                </div>
                            </div>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '12px', textAlign: 'center' }}>
                            {stickers.length > 0 ? t('stickerDragHint') : t('stickerHint')}
                        </div>
                    </div>

                </form>
                <div className="modal-footer">
                    <button type="button" className="btn btn-ghost" onClick={onClose}>{t('cancelBtn')}</button>
                    <button type="submit" form="edit-tip-form" className="btn">{t('saveTipBtn')}</button>
                </div>
            </div>
        </div>
    );
}
