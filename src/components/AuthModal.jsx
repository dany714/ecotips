import { useState } from 'react';
import { useModalBodyClass } from '../hooks/useModalBodyClass';
import { X, Leaf, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export default function AuthModal({ mode: initialMode, onClose }) {
    useModalBodyClass();
    const { login, register, resetPassword } = useAuth();
    const { t } = useLanguage();
    const [mode, setMode] = useState(initialMode); // 'login' | 'register' | 'recovery'
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);

    const set = (k) => (e) => {
        setForm(f => ({ ...f, [k]: e.target.value }));
        setError('');
        setSuccessMsg('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        let result;
        if (mode === 'recovery') {
            if (!form.email.trim()) { setError(t('recoveryEmailReq')); setLoading(false); return; }
            result = await resetPassword(form.email);
            if (result?.success) {
                setSuccessMsg(t('recoverySuccess'));
                setForm({ ...form, email: '' });
            }
        } else if (mode === 'login') {
            result = await login(form.email, form.password);
        } else {
            if (!form.name.trim()) { setError(t('nameRequired')); setLoading(false); return; }
            if (form.password.length < 6) { setError(t('passwordLength')); setLoading(false); return; }
            result = await register(form.name.trim(), form.email, form.password);
        }

        if (result?.error) {
            setError(t(result.error));
        } else if (result?.success) {
            onClose();
        }
        setLoading(false);
    };

    const switchMode = () => {
        setMode(m => m === 'login' ? 'register' : 'login');
        setError('');
        setForm({ name: '', email: '', password: '' });
    };

    return (
        <div className="modal-overlay animate-fade" onClick={e => e.target === e.currentTarget && onClose()}>
            <div className="modal animate-scale" style={{ maxWidth: '420px', overflow: 'hidden' }}>
                <div style={{
                    background: 'var(--grey-900)',
                    padding: '30px 28px 28px',
                    textAlign: 'center',
                    position: 'relative',
                }}>
                    <button className="modal-close-btn" onClick={onClose} style={{
                        color: 'rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.1)',
                        position: 'absolute', top: '16px', right: '16px',
                    }}>
                        <X size={18} />
                    </button>
                    <div style={{
                        width: '52px', height: '52px', borderRadius: '14px',
                        background: 'linear-gradient(135deg, var(--green-600), var(--green-800))',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 14px',
                        boxShadow: 'var(--shadow-green)',
                    }}>
                        <Leaf size={26} color="white" />
                    </div>
                    <h2 style={{ color: 'white', fontSize: '1.25rem', fontWeight: 800, margin: '0 0 4px', letterSpacing: '-0.01em', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        {mode === 'recovery' ? t('recoveryTitle') : (mode === 'login' ? t('loginTitle') : t('registerTitle'))}
                    </h2>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem', margin: 0, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        {mode === 'recovery' ? t('recoverySubtitle') : (mode === 'login' ? t('appSubtitle') : t('welcomeSubtitle'))}
                    </p>
                </div>

                <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
                    {mode === 'register' && (
                        <div className="form-group">
                            <label className="form-label">{t('nameField')}</label>
                            <input
                                className="form-input"
                                type="text"
                                value={form.name}
                                onChange={set('name')}
                                placeholder={t('namePlaceholderAuth')}
                                autoFocus={mode === 'register'}
                            />
                        </div>
                    )}
                    <div className="form-group">
                        <label className="form-label">{t('emailField')}</label>
                        <input
                            className="form-input"
                            type="email"
                            value={form.email}
                            onChange={set('email')}
                            placeholder="tu@correo.com"
                            autoFocus={mode === 'login'}
                            required
                        />
                    </div>
                    {mode !== 'recovery' && (
                        <div className="form-group">
                            <label className="form-label">{t('passwordField')}</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                className="form-input"
                                type={showPass ? 'text' : 'password'}
                                value={form.password}
                                onChange={set('password')}
                                placeholder={mode === 'register' ? 'Mínimo 6 caracteres' : '••••••••'}
                                style={{ paddingRight: '40px' }}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPass(v => !v)}
                                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', cursor: 'pointer', color: '#9ca3af' }}
                            >
                                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        </div>
                    )}
                    {mode === 'login' && (
                        <div style={{ textAlign: 'right', marginTop: '-8px', marginBottom: '16px' }}>
                            <button type="button" onClick={() => { setMode('recovery'); setError(''); setSuccessMsg(''); }} style={{ background: 'transparent', border: 'none', color: 'var(--primary)', fontWeight: 500, cursor: 'pointer', fontSize: '0.75rem' }}>
                                {t('forgotPasswordBtn')}
                            </button>
                        </div>
                    )}

                    {error && (
                        <div style={{ background: '#fee2e2', color: '#991b1b', padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '16px' }}>
                            {error}
                        </div>
                    )}
                    {successMsg && (
                        <div style={{ background: '#dcfce7', color: '#166534', padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '16px' }}>
                            {successMsg}
                        </div>
                    )}

                    <button type="submit" className="btn" style={{ width: '100%', justifyContent: 'center', padding: '12px' }} disabled={loading}>
                        {loading 
                            ? (mode === 'recovery' ? t('recoverySending') : mode === 'login' ? t('loggingIn') : t('registering')) 
                            : (mode === 'recovery' ? t('recoverySubmitBtn') : mode === 'login' ? t('login') : t('register'))}
                    </button>

                    <div className="divider">o</div>

                    <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        <button type="button" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); setSuccessMsg(''); }} style={{ background: 'transparent', border: 'none', color: 'var(--primary)', fontWeight: 700, cursor: 'pointer', fontSize: '0.875rem', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                            {mode === 'recovery' ? t('backToLogin') : (mode === 'login' ? t('switchToRegister') : t('switchToLogin'))}
                        </button>
                    </p>
                </form>
            </div>
        </div>
    );
}
