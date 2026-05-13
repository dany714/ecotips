import { Leaf, Heart, MessageSquare, Shield, Users } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useModalBodyClass } from '../hooks/useModalBodyClass';

const FEATURES = [
    { Icon: Leaf, labelKey: 'welcomeCreate', bg: 'var(--green-50)', color: 'var(--green-800)' },
    { Icon: Heart, labelKey: 'welcomeSupport', bg: '#fef2f2', color: '#991b1b' },
    { Icon: MessageSquare, labelKey: 'welcomeShare', bg: 'var(--grey-50)', color: 'var(--grey-700)' },
    { Icon: Shield, labelKey: 'welcomeQuality', bg: 'var(--green-100)', color: 'var(--green-800)' },
];

function WelcomeModalInner({ onClose }) {
    const { t } = useLanguage();
    useModalBodyClass();

    return (
        <div className="modal-overlay animate-fade">
            <div className="animate-scale" style={{ width: '100%', maxWidth: '400px', borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-xl)', border: '1px solid var(--border)' }}>
                {/* Header */}
                <div style={{
                    background: 'var(--grey-900)',
                    padding: '36px 28px 46px', textAlign: 'center', position: 'relative',
                    overflow: 'hidden',
                }}>
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                            <div style={{
                                background: 'linear-gradient(135deg, var(--green-600), var(--green-800))',
                                padding: '14px', borderRadius: '16px', display: 'flex',
                                boxShadow: 'var(--shadow-green)',
                            }}>
                                <Leaf size={36} color="white" />
                            </div>
                        </div>
                        <h2 style={{ color: 'white', fontSize: '1.5rem', fontWeight: 800, margin: '0 0 6px', fontStyle: 'italic', fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.02em' }}>Eco Tips</h2>
                        <p style={{ color: 'rgba(255,255,255,0.5)', margin: 0, fontSize: '0.88rem', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                            {t('welcomeSubtitle')}
                        </p>
                    </div>
                    {/* Decorative circles */}
                    <div style={{ position: 'absolute', top: '-24px', right: '-24px', width: '100px', height: '100px', background: 'rgba(255,255,255,0.04)', borderRadius: '50%' }} />
                    <div style={{ position: 'absolute', bottom: '-30px', left: '-15px', width: '80px', height: '80px', background: 'rgba(255,255,255,0.03)', borderRadius: '50%' }} />
                </div>

                {/* Body */}
                <div style={{ background: 'var(--surface)', padding: '28px', borderRadius: '0 0 var(--radius-xl) var(--radius-xl)', marginTop: '-20px', position: 'relative', borderTop: '1px solid var(--border)' }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', textAlign: 'center', marginBottom: '20px', lineHeight: 1.6, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        {t('welcomeBody')}
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
                        {FEATURES.map(({ Icon, labelKey, bg, color }) => (
                            <div key={labelKey} style={{ background: bg, padding: '12px', borderRadius: 'var(--radius-md)', display: 'flex', gap: '8px', alignItems: 'flex-start', border: '1px solid rgba(0,0,0,0.04)' }}>
                                <Icon size={15} color={color} style={{ flexShrink: 0, marginTop: '2px' }} />
                                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: color, lineHeight: 1.4, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{t(labelKey)}</span>
                            </div>
                        ))}
                    </div>

                    <div style={{ background: 'var(--grey-50)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '12px 14px', marginBottom: '20px', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                        <Users size={15} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.8rem', lineHeight: 1.5, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                            <strong style={{ color: 'var(--text-primary)' }}>{t('communityNote').split(':')[0]}:</strong> {t('communityNote').split(':').slice(1).join(':').trim()}
                        </p>
                    </div>

                    <button
                        className="btn"
                        style={{ width: '100%', justifyContent: 'center', padding: '13px', fontSize: '0.95rem', gap: '8px' }}
                        onClick={onClose}
                    >
                        <Leaf size={17} /> {t('welcomeStart')}
                    </button>
                </div>
            </div>
        </div>
    );
}

// Outer wrapper: only mounts the inner component (and its hooks) when open
export default function WelcomeModal({ isOpen, onClose }) {
    if (!isOpen) return null;
    return <WelcomeModalInner onClose={onClose} />;
}
