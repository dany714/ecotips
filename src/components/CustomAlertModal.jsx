import { AlertTriangle, CheckCircle2, ShieldAlert, X } from 'lucide-react';
import { useModalBodyClass } from '../hooks/useModalBodyClass';

export default function CustomAlertModal({ 
  isOpen, 
  title, 
  message, 
  type = 'warning', // 'warning' | 'danger' | 'success'
  onConfirm, 
  onCancel,
  confirmText = 'Aceptar',
  cancelText = 'Cancelar'
}) {
    useModalBodyClass(isOpen);

    if (!isOpen) return null;

    const colors = {
        warning: { 
            bg: '#fefce8', 
            border: '#fef08a', 
            icon: '#ca8a04', 
            btn: '#ca8a04', 
            btnHover: '#eab308' 
        },
        danger: { 
            bg: '#fef2f2', 
            border: '#fecaca', 
            icon: '#dc2626', 
            btn: '#dc2626', 
            btnHover: '#ef4444' 
        },
        success: { 
            bg: '#f0fdf4', 
            border: '#bbf7d0', 
            icon: '#16a34a', 
            btn: '#16a34a', 
            btnHover: '#22c55e' 
        }
    };

    const scheme = colors[type];

    const Icon = type === 'danger' ? ShieldAlert : (type === 'success' ? CheckCircle2 : AlertTriangle);

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backgroundColor: 'rgba(3, 7, 18, 0.58)',
            backdropFilter: 'blur(6px)',
            padding: '20px'
        }}>
            <div 
                className="animate-scale"
                style={{
                    background: 'var(--surface)', borderRadius: 'var(--radius-xl)', overflow: 'hidden',
                    maxWidth: '420px', width: '100%',
                    boxShadow: 'var(--shadow-xl)',
                    border: `1px solid ${scheme.border}`,
                    position: 'relative'
                }}
            >
                {/* Header Icon Section */}
                <div style={{ background: scheme.bg, padding: '24px', textAlign: 'center', borderBottom: `1px solid ${scheme.border}` }}>
                    <div style={{ 
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        width: '56px', height: '56px', borderRadius: '50%',
                        background: 'white', color: scheme.icon,
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                    }}>
                        <Icon size={28} />
                    </div>
                </div>

                {/* Content Section */}
                <div style={{ padding: '24px 28px' }}>
                    <h3 style={{ margin: '0 0 10px', fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', textAlign: 'center', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        {title}
                    </h3>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, textAlign: 'center', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        {message}
                    </p>
                </div>

                {/* Actions Section */}
                <div style={{ padding: '8px 28px 28px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
                    {onCancel && (
                        <button 
                            onClick={onCancel}
                            style={{
                                padding: '10px 20px', borderRadius: 'var(--radius-full)', 
                                background: 'var(--grey-100)', border: '1.5px solid var(--border)',
                                color: 'var(--text-primary)', fontSize: '0.88rem', fontWeight: 700,
                                cursor: 'pointer', transition: 'all 0.2s', flex: 1,
                                fontFamily: "'Plus Jakarta Sans', sans-serif",
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = 'var(--grey-200)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'var(--grey-100)'}
                        >
                            {cancelText}
                        </button>
                    )}
                    <button 
                        onClick={onConfirm}
                        style={{
                            padding: '10px 20px', borderRadius: 'var(--radius-full)', 
                            background: scheme.btn, border: 'none',
                            color: 'white', fontSize: '0.88rem', fontWeight: 700,
                            cursor: 'pointer', transition: 'all 0.2s', flex: 1,
                            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = scheme.btnHover}
                        onMouseLeave={e => e.currentTarget.style.background = scheme.btn}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
