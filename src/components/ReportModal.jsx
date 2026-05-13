import { useState } from 'react';
import { X, Flag, CheckCircle2 } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import { useModalBodyClass } from '../hooks/useModalBodyClass';

export default function ReportModal({ tip, onClose }) {
    const { reportTip } = useData();
    const { t } = useLanguage();
    useModalBodyClass();
    const [reason, setReason] = useState('');
    const [details, setDetails] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const REASONS = [
        { key: 'spamReason',          es: 'Spam o publicidad' },
        { key: 'fakeReason',          es: 'Información falsa o engañosa' },
        { key: 'inappropriateReason', es: 'Contenido inapropiado' },
        { key: 'otherReason',         es: 'Otro' },
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!reason) return;
        reportTip(tip.id, reason, details);
        setSubmitted(true);
    };

    return (
        <div className="modal-overlay animate-fade" onClick={e => e.target === e.currentTarget && onClose()}>
            <div className="modal animate-scale" style={{ overflow: 'hidden' }}>
                <div className="modal-header" style={{ background: 'var(--grey-900)', margin: 0, padding: '20px 24px', borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0', color: 'white' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ background: 'rgba(255,255,255,0.1)', padding: '7px', borderRadius: '9px', display: 'flex' }}>
                            <Flag size={17} />
                        </div>
                        <h2 className="modal-title" style={{ color: 'white', margin: 0, fontSize: '1rem' }}>{t('reportTip')}</h2>
                    </div>
                    <button className="modal-close-btn" style={{ color: 'rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.08)' }} onClick={onClose}><X size={18} /></button>
                </div>
                <div className="modal-body" style={{ paddingTop: '24px' }}>
                    {submitted ? (
                        <div style={{ textAlign: 'center', padding: '28px 0' }}>
                            <div style={{ width: '56px', height: '56px', background: 'var(--green-100)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                                <CheckCircle2 size={30} color="var(--primary)" />
                            </div>
                            <h3 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>{t('reportSent')}</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{t('reportThanks')}</p>
                            <button className="btn" style={{ marginTop: '20px' }} onClick={onClose}>{t('close')}</button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '16px' }}>
                                {t('reportingTip')} <strong style={{ color: '#111' }}>"{tip.title}"</strong>
                            </p>
                            <div className="form-group">
                                <label className="form-label">{t('reportReason')}</label>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {REASONS.map(r => (
                                        <label key={r.key} style={{
                                            display: 'flex', alignItems: 'center', gap: '10px', padding: '11px 14px',
                                            border: `1.5px solid ${reason === r.key ? 'var(--primary)' : 'var(--border)'}`,
                                            borderRadius: 'var(--radius-sm)', cursor: 'pointer', transition: 'all 0.15s',
                                            background: reason === r.key ? 'var(--green-50)' : 'var(--surface)',
                                            fontSize: '0.875rem', fontWeight: reason === r.key ? 700 : 500,
                                        }}>
                                            <input
                                                type="radio"
                                                value={r.key}
                                                checked={reason === r.key}
                                                onChange={() => setReason(r.key)}
                                                style={{ accentColor: 'var(--primary)' }}
                                            />
                                            {t(r.key)}
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">{t('details')}</label>
                                <textarea className="form-input" value={details} onChange={e => setDetails(e.target.value)} placeholder={t('detailsPlaceholder')} rows={3} />
                            </div>
                            <div className="modal-footer" style={{ margin: '0 -24px -24px' }}>
                                <button type="button" className="btn btn-ghost" onClick={onClose}>{t('cancel')}</button>
                                <button type="submit" className="btn btn-danger" disabled={!reason}>{t('sendReport')}</button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
