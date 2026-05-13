import { useState } from 'react';
import { X, Leaf, UserCircle, CheckCircle2, ChevronLeft, Send, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import { POSTIT_DESIGNS, getPostitImageUrl, getPostitSvgUrl } from '../utils/postitConfig';
import { STICKER_DESIGNS, getStickerSvg } from '../utils/stickerConfig';
import StickerCanvas from './StickerCanvas';
import { useModalBodyClass } from '../hooks/useModalBodyClass';



export default function CreateTipModal({ isOpen, onClose }) {
    const { user } = useAuth();
    const { addTip } = useData();
    const { t } = useLanguage();
    useModalBodyClass();
    const [form, setForm] = useState({
        title: '', description: '', category: 'Reciclaje',
        authorName: '', designId: 1, stickers: []
    });
    const [confirmed, setConfirmed] = useState(false);
    const [step, setStep] = useState(1); // 1=formulario, 2=confirmar-invitado
    const [imgFailed, setImgFailed] = useState({});

    const categories = [
        { id: 'Residuos', label: t('catWaste') },
        { id: 'Reciclaje', label: t('catRecycling') },
        { id: 'Energía', label: t('catEnergy') },
        { id: 'Naturaleza', label: t('catNature') }
    ];

    if (!isOpen) return null;

    const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));
    const selectedDesign = POSTIT_DESIGNS.find(d => d.id === form.designId) || POSTIT_DESIGNS[0];

    const addSticker = (design) => {
        if (form.stickers.length >= 5) return;
        setForm(f => ({
            ...f,
            stickers: [...f.stickers, {
                id: Date.now() + Math.random(),
                designId: design.id,
                x: 10 + Math.random() * 60,
                y: 10 + Math.random() * 60,
                rotation: -15 + Math.random() * 30
            }]
        }));
    };

    const updateSticker = (index, newSticker) => {
        setForm(f => {
            const arr = [...f.stickers];
            arr[index] = newSticker;
            return { ...f, stickers: arr };
        });
    };

    const removeSticker = (index) => {
        setForm(f => ({ ...f, stickers: f.stickers.filter((_, i) => i !== index) }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.title.trim() || !form.description.trim()) return;
        if (!user && !confirmed) {
            setStep(2);
            return;
        }
        submitTip();
    };

    const submitTip = () => {
        addTip({
            ...form,
            // Almacenar designId para que la tarjeta siempre muestre el diseño elegido
            color: selectedDesign.fallbackColor,     // se mantiene como respaldo por legado
            authorName: user ? user.name : (form.authorName.trim() || 'Anónimo')
        });
        setForm({ title: '', description: '', category: 'Reciclaje', authorName: '', designId: 1, stickers: [] });
        setStep(1);
        setConfirmed(false);
        onClose();
    };

    return (
        <div className="modal-overlay animate-fade" onClick={e => e.target === e.currentTarget && onClose()}>
            <div className="modal animate-scale">
                <div className="modal-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Leaf size={18} style={{ color: 'var(--primary)' }} />
                        <h2 className="modal-title">{step === 2 ? t('confirmation') : t('publishTipTitle')}</h2>
                    </div>
                    <button className="modal-close-btn" onClick={onClose}><X size={20} /></button>
                </div>

                {step === 2 ? (
                    <div className="modal-body">
                        <div style={{ textAlign: 'center', padding: '12px 0 24px' }}>
                            <div style={{ marginBottom: '16px', color: 'var(--text-muted)' }}>
                                <UserCircle size={44} strokeWidth={1.2} />
                            </div>
                            <h3 style={{ marginBottom: '8px', color: 'var(--text-primary)' }}>{t('guestConfirmTitle')}</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '24px', lineHeight: 1.6 }}>
                                {t('guestConfirmText')}
                            </p>
                            <div style={{ background: 'var(--green-50)', border: '1px solid var(--green-200)', borderRadius: 'var(--radius-sm)', padding: '14px', marginBottom: '20px', textAlign: 'left' }}>
                                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{form.title}</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>{form.description.slice(0, 80)}{form.description.length > 80 ? '...' : ''}</div>
                            </div>
                            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                                <button className="btn btn-outline" onClick={() => setStep(1)} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <ChevronLeft size={15} /> {t('editBack')}
                                </button>
                                <button className="btn" onClick={submitTip} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <CheckCircle2 size={16} /> {t('publishAnyway')}
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <form id="create-tip-form" onSubmit={handleSubmit} className="modal-body">
                        <div className="form-group">
                            <label className="form-label">{t('titleLabel')}</label>
                            <input className="form-input" value={form.title} onChange={set('title')} placeholder={t('titlePlaceholder')} maxLength={60} autoFocus required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">{t('descLabel')}</label>
                            <textarea className="form-input" value={form.description} onChange={set('description')} placeholder={t('descriptionPlaceholder')} rows={4} maxLength={280} required />
                            <div style={{ textAlign: 'right', fontSize: '0.72rem', color: '#9ca3af', marginTop: '-8px', marginBottom: '4px' }}>{form.description.length}/280</div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Categoría</label>
                            <select className="form-input" value={form.category} onChange={set('category')}>
                                {categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                            </select>
                        </div>
                        {!user && (
                            <div className="form-group">
                                <label className="form-label">{t('authorNameOptional')}</label>
                                <input className="form-input" value={form.authorName} onChange={set('authorName')} placeholder={t('anonymous')} />
                            </div>
                        )}

                        {/* Selector de Diseño — reemplaza al selector de color */}
                        <div className="form-group">
                            <label className="form-label">Diseño del post-it</label>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 48px)', gap: '8px' }}>
                                {POSTIT_DESIGNS.map(design => (
                                    <button
                                        key={design.id}
                                        type="button"
                                        onClick={() => setForm(f => ({ ...f, designId: design.id }))}
                                        style={{
                                            width: '48px', height: '48px',
                                            borderRadius: '10px',
                                            border: form.designId === design.id
                                                ? '3px solid #111'
                                                : '2px solid rgba(0,0,0,0.12)',
                                            transform: form.designId === design.id ? 'scale(1.15)' : 'scale(1)',
                                            transition: 'all 0.15s',
                                            cursor: 'pointer',
                                            overflow: 'hidden',
                                            padding: 0,
                                            background: design.fallbackColor,
                                            boxShadow: form.designId === design.id ? '0 2px 10px rgba(0,0,0,0.25)' : '0 1px 4px rgba(0,0,0,0.1)',
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
                            <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '6px' }}>
                                {t('selectedDesign')} <strong>{selectedDesign.name}</strong>
                            </div>
                        </div>

                        {/* Sticker Picker */}
                        <div className="form-group" style={{ marginTop: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                <label className="form-label" style={{ margin: 0 }}>{t('stickerLabel')}</label>
                                <span style={{ fontSize: '0.75rem', color: form.stickers.length >= 5 ? 'var(--danger)' : 'var(--text-muted)', fontWeight: 600 }}>
                                    {form.stickers.length}/5
                                </span>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 36px)', gap: '8px', marginBottom: '16px' }}>
                                {STICKER_DESIGNS.map(st => (
                                    <button
                                        key={st.id}
                                        type="button"
                                        disabled={form.stickers.length >= 5}
                                        onClick={() => addSticker(st)}
                                        title={st.name}
                                        style={{
                                            width: '36px', height: '36px',
                                            borderRadius: 'var(--radius-sm)',
                                            border: '1.5px solid var(--border)',
                                            background: 'var(--grey-50)',
                                            cursor: form.stickers.length >= 5 ? 'not-allowed' : 'pointer',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            opacity: form.stickers.length >= 5 ? 0.3 : 1,
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
                                            {form.title || t('previewTitleFallback')}
                                        </h3>
                                        <p style={{ margin: 0, fontSize: '0.85rem', color: '#333', lineHeight: 1.4, wordBreak: 'break-word', whiteSpace: 'pre-wrap', textShadow: '0 1px 2px rgba(255,255,255,0.5)', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 8, WebkitBoxOrient: 'vertical' }}>
                                            {form.description || t('previewDescFallback')}
                                        </p>
                                    </div>
                                    <div style={{ position: 'absolute', inset: 0, zIndex: 10 }}>
                                        <StickerCanvas
                                            stickers={form.stickers}
                                            readOnly={false}
                                            onUpdate={updateSticker}
                                            onRemove={removeSticker}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '12px', textAlign: 'center' }}>
                                {form.stickers.length > 0 ? t('stickerDragHint') : t('stickerHint')}
                            </div>
                        </div>

                    </form>
                )}
                {/* Footer always sits outside modal-body as a flex sibling */}
                <div className="modal-footer">
                    <button type="button" className="btn btn-ghost" onClick={onClose}>{t('cancelBtn')}</button>
                    {step === 1 ? (
                        <button type="submit" form="create-tip-form" className="btn" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            {user ? (
                                <><Send size={16} /> {t('publishTipBtn')}</>
                            ) : (
                                <>{t('next')} <ChevronRight size={16} /></>
                            )}
                        </button>
                    ) : (
                        <></>
                    )}
                </div>
            </div>
        </div>
    );
}
