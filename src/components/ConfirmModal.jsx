import { AlertTriangle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useModalBodyClass } from '../hooks/useModalBodyClass';

export default function ConfirmModal({ title, message, confirmText, cancelText, onConfirm, onClose, type = 'danger' }) {
    useModalBodyClass();
    const { t } = useLanguage();

    const isDanger = type === 'danger';

    return (
        <div className="modal-overlay animate-fade" style={{ zIndex: 99999 }} onClick={e => e.target === e.currentTarget && onClose()}>
            <div className="modal animate-scale" style={{ maxWidth: '380px', width: '90%', padding: '0', overflow: 'hidden', borderRadius: 'var(--radius-xl)' }}>
                <div style={{ padding: '32px 24px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                    <div style={{ position: 'relative', width: '64px', height: '64px', marginBottom: '20px' }}>
                        <div style={{ 
                            position: 'absolute', inset: 0, borderRadius: '50%',
                            background: isDanger ? 'var(--danger)' : 'var(--primary)', opacity: 0.1
                        }}></div>
                        <div style={{ 
                            position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: isDanger ? 'var(--danger)' : 'var(--primary)'
                        }}>
                            <AlertTriangle size={32} />
                        </div>
                    </div>
                    
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 10px 0', color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
                        {title}
                    </h3>
                    <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                        {message}
                    </p>
                </div>
                
                <div style={{ padding: '0 24px 24px', display: 'flex', gap: '12px' }}>
                    <button 
                        onClick={onClose} 
                        className="btn" 
                        style={{ flex: 1, padding: '12px 0', justifyContent: 'center', background: 'var(--grey-100)', color: 'var(--text-primary)', border: 'none', boxShadow: 'none' }}
                    >
                        {cancelText || t('cancelBtn') || 'Cancelar'}
                    </button>
                    <button 
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }} 
                        className="btn" 
                        style={{ flex: 1, padding: '12px 0', justifyContent: 'center', background: isDanger ? 'var(--danger)' : 'var(--primary)', boxShadow: isDanger ? '0 8px 16px rgba(239, 68, 68, 0.25)' : 'var(--shadow-green)', border: 'none' }}
                    >
                        {confirmText || t('confirm') || 'Confirmar'}
                    </button>
                </div>
            </div>
        </div>
    );
}
