import { useState } from 'react';
import { X, Check, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { AVATAR_OPTIONS, getAvatarById, getAvatarImageUrl } from '../utils/avatarConfig';
import AvatarIcon from './AvatarIcon';
import { useModalBodyClass } from '../hooks/useModalBodyClass';

export default function EditProfileModal({ onClose }) {
    const { user, updateProfile } = useAuth();
    const { t } = useLanguage();
    useModalBodyClass();
    const [name, setName] = useState(user?.name || '');
    const [selectedAvatar, setSelectedAvatar] = useState(user?.avatarId || 1);
    const [imgFailed, setImgFailed] = useState({});
    const [saving, setSaving] = useState(false);

    const handleSave = async (e) => {
        e.preventDefault();
        if (!name.trim()) return;
        setSaving(true);
        await updateProfile(name.trim(), selectedAvatar);
        setSaving(false);
        onClose();
    };

    return (
        <div className="modal-overlay animate-fade" onClick={e => e.target === e.currentTarget && onClose()}>
            <div className="modal animate-scale" style={{ maxWidth: '420px', maxHeight: '90vh', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
                <div className="modal-header">
                    <h2 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <User size={20} /> {t('editProfileTitle')}
                    </h2>
                    <button className="modal-close-btn" onClick={onClose}><X size={20} /></button>
                </div>

                <form onSubmit={handleSave} className="modal-body">
                    {/* Preview */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px', padding: '16px', background: 'var(--grey-50)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                        <AvatarIcon avatarId={selectedAvatar} name={name || user?.name} size={56} />
                        <div>
                            <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>{name || user?.name}</div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>{t('avatarPreview')}</div>
                        </div>
                    </div>

                    {/* Name field */}
                    <div className="form-group">
                        <label className="form-label">{t('nameField')}</label>
                        <input
                            className="form-input"
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            maxLength={25}
                            required
                        />
                    </div>

                    {/* Avatar picker */}
                    <div className="form-group">
                        <label className="form-label">{t('avatarLabel')}</label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(56px, 1fr))', gap: '10px', padding: '4px 0' }}>
                            {AVATAR_OPTIONS.map(av => {
                                const isSelected = selectedAvatar === av.id;
                                return (
                                    <button
                                        key={av.id}
                                        type="button"
                                        onClick={() => setSelectedAvatar(av.id)}
                                        title={av.label}
                                        style={{
                                            position: 'relative', background: 'transparent', border: 'none', cursor: 'pointer',
                                            padding: '4px', borderRadius: '50%',
                                            outline: isSelected ? `3px solid var(--primary)` : '3px solid transparent',
                                            transition: 'outline 0.15s',
                                        }}
                                    >
                                        <AvatarIcon avatarId={av.id} name={av.label} size={48} />
                                        {isSelected && (
                                            <div style={{
                                                position: 'absolute', bottom: '2px', right: '2px',
                                                background: 'var(--primary)', borderRadius: '50%', width: '18px', height: '18px',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                border: '2px solid white'
                                            }}>
                                                <Check size={11} color="white" />
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </form>

                <div className="modal-footer">
                    <button type="button" className="btn btn-ghost" onClick={onClose}>{t('cancel')}</button>
                    <button className="btn" disabled={!name.trim() || saving} onClick={handleSave} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Check size={16} /> {saving ? '...' : t('saveChanges')}
                    </button>
                </div>
            </div>
        </div>
    );
}
