import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
    Leaf, Bell, User, LogOut, Shield, ChevronDown, Check, X,
    CheckCircle2, AlertTriangle, Ban, MessageSquare, Mail, Languages
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import AuthModal from './AuthModal';
import AvatarIcon from './AvatarIcon';

const NotifIcon = ({ type }) => {
    const icons = {
        success: <CheckCircle2 size={15} color="#16a34a" />,
        warning: <AlertTriangle size={15} color="#d97706" />,
        danger:  <Ban size={15} color="#dc2626" />,
        info:    <MessageSquare size={15} color="#2563eb" />,
    };
    return icons[type] || <Mail size={15} color="#6b7280" />;
};

const parseMsg = (lang, msg = '') => {
    if (!msg.includes('|')) return msg;
    const parts = msg.split('|');
    return lang === 'es' ? parts[0] : parts[1] || parts[0];
};

const Navbar = () => {
    const { user, logout } = useAuth();
    const { notifications, markNotificationRead, markAllRead } = useData();
    const { lang, toggleLang, t } = useLanguage();
    const [showDropdown, setShowDropdown] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [authMode, setAuthMode] = useState(null);
    const [langAnimating, setLangAnimating] = useState(false);

    const myNotifications = notifications.filter(n => n.userId === user?.id);
    const unreadCount = myNotifications.filter(n => !n.read).length;

    const openAuth = (mode) => { setShowDropdown(false); setAuthMode(mode); };

    const handleToggleLang = () => {
        setLangAnimating(true);
        setTimeout(() => setLangAnimating(false), 400);
        toggleLang();
    };

    const LangToggle = () => (
        <button
            onClick={handleToggleLang}
            aria-label={`Switch to ${lang === 'es' ? 'English' : 'Español'}`}
            title={lang === 'es' ? 'Switch to English' : 'Cambiar a Español'}
            style={{
                display: 'flex', alignItems: 'center', gap: '5px',
                padding: '7px 10px', borderRadius: '99px',
                border: '1.5px solid var(--border)',
                background: 'var(--surface)',
                cursor: 'pointer', fontSize: '0.78rem', fontWeight: 700,
                color: 'var(--text-secondary)',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                transition: 'all 0.2s',
                boxShadow: 'var(--shadow-xs)',
                transform: langAnimating ? 'scale(0.9)' : 'scale(1)',
                letterSpacing: '0.05em',
                flexShrink: 0,
            }}
            onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--primary)';
                e.currentTarget.style.color = 'var(--primary)';
                e.currentTarget.style.background = 'var(--green-50)';
            }}
            onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--border)';
                e.currentTarget.style.color = 'var(--text-secondary)';
                e.currentTarget.style.background = 'var(--surface)';
            }}
        >
            <Languages size={13} />
            <span className="nav-lang-text">{lang === 'es' ? 'ES' : 'EN'}</span>
        </button>
    );

    return (
        <>
            <header className="app-header">
                {/* Logo */}
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '9px', textDecoration: 'none', minWidth: 0, flexShrink: 0 }}>
                    <div style={{
                        background: 'linear-gradient(135deg, var(--green-600), var(--green-800))',
                        width: '36px', height: '36px', borderRadius: '9px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: 'var(--shadow-green)',
                        flexShrink: 0,
                    }}>
                        <Leaf size={19} color="white" />
                    </div>
                    <div style={{ minWidth: 0 }}>
                        <h1 style={{
                            fontSize: '1.2rem', margin: 0,
                            fontWeight: 800, fontStyle: 'italic',
                            color: 'var(--grey-900)', letterSpacing: '-0.02em',
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                            whiteSpace: 'nowrap',
                        }}>
                            Eco Tips
                        </h1>
                        <p className="nav-subtitle" style={{
                            fontSize: '0.68rem', margin: 0,
                            color: 'var(--primary)', letterSpacing: '0.01em',
                            fontWeight: 600, whiteSpace: 'nowrap',
                        }}>
                            {t('appSubtitle')}
                        </p>
                    </div>
                </Link>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                    <LangToggle />

                    {user ? (
                        <>
                            {/* Notifications */}
                            <div style={{ position: 'relative' }}>
                                <button
                                    onClick={() => { setShowNotifications(v => !v); setShowDropdown(false); }}
                                    style={{
                                        position: 'relative',
                                        background: 'var(--surface)',
                                        border: '1.5px solid var(--border)',
                                        borderRadius: '50%',
                                        width: '38px', height: '38px',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        color: 'var(--grey-500)',
                                        boxShadow: 'var(--shadow-xs)',
                                    }}
                                    onMouseOver={e => {
                                        e.currentTarget.style.borderColor = 'var(--primary)';
                                        e.currentTarget.style.color = 'var(--primary)';
                                        e.currentTarget.style.background = 'var(--green-50)';
                                    }}
                                    onMouseOut={e => {
                                        e.currentTarget.style.borderColor = 'var(--border)';
                                        e.currentTarget.style.color = 'var(--grey-500)';
                                        e.currentTarget.style.background = 'var(--surface)';
                                    }}
                                >
                                    <Bell size={17} />
                                    {unreadCount > 0 && (
                                        <span style={{
                                            position: 'absolute', top: '-3px', right: '-3px',
                                            background: 'var(--danger)', color: 'white',
                                            borderRadius: '50%', width: '17px', height: '17px',
                                            fontSize: '9px', fontWeight: 800,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            border: '2px solid var(--surface)',
                                            animation: 'badgePop 0.3s cubic-bezier(0.34,1.56,0.64,1) both',
                                        }}>
                                            {unreadCount > 9 ? '9+' : unreadCount}
                                        </span>
                                    )}
                                </button>

                                {showNotifications && (
                                    <>
                                        <div
                                            onClick={() => setShowNotifications(false)}
                                            style={{ position: 'fixed', inset: 0, zIndex: 199 }}
                                        />
                                        <div className="animate-scale" style={{
                                            position: 'fixed', top: '72px', right: '12px',
                                            width: 'min(340px, calc(100vw - 24px))',
                                            background: 'var(--surface)',
                                            borderRadius: 'var(--radius-lg)',
                                            boxShadow: 'var(--shadow-xl)',
                                            border: '1px solid var(--border)',
                                            zIndex: 200, overflow: 'hidden',
                                        }}>
                                            <div style={{
                                                padding: '14px 18px',
                                                borderBottom: '1px solid var(--border)',
                                                display: 'flex', justifyContent: 'space-between',
                                                alignItems: 'center', gap: '8px',
                                                background: 'var(--grey-50)',
                                            }}>
                                                <span style={{ fontWeight: 800, fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                                                    {t('notifications')}
                                                </span>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto' }}>
                                                    {unreadCount > 0 && (
                                                        <button onClick={markAllRead} style={{
                                                            background: 'transparent', border: 'none',
                                                            color: 'var(--primary)', fontSize: '0.75rem',
                                                            cursor: 'pointer', fontWeight: 700,
                                                            display: 'flex', alignItems: 'center', gap: '4px',
                                                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                                                        }}>
                                                            <Check size={12} /> {t('markAllRead')}
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => setShowNotifications(false)}
                                                        style={{
                                                            background: 'var(--grey-100)', border: 'none',
                                                            cursor: 'pointer', color: 'var(--grey-500)',
                                                            display: 'flex', padding: '4px', borderRadius: '6px',
                                                            transition: 'all 0.15s',
                                                        }}
                                                        aria-label="Cerrar notificaciones"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                            <div style={{ maxHeight: '340px', overflowY: 'auto' }}>
                                                {myNotifications.length === 0 ? (
                                                    <div style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--text-muted)' }}>
                                                        <Bell size={28} style={{ marginBottom: '10px', opacity: 0.3 }} />
                                                        <p style={{ fontSize: '0.85rem', fontWeight: 600 }}>{t('noNotifications')}</p>
                                                    </div>
                                                ) : (
                                                    myNotifications.map(n => (
                                                        <div
                                                            key={n.id}
                                                            onClick={() => markNotificationRead(n.id)}
                                                            style={{
                                                                padding: '13px 18px',
                                                                borderBottom: '1px solid var(--grey-50)',
                                                                background: n.read ? 'var(--surface)' : 'var(--green-50)',
                                                                cursor: 'pointer',
                                                                display: 'flex', gap: '12px', alignItems: 'flex-start',
                                                                transition: 'background 0.15s',
                                                            }}
                                                            onMouseEnter={e => { if (n.read) e.currentTarget.style.background = 'var(--grey-50)'; }}
                                                            onMouseLeave={e => { e.currentTarget.style.background = n.read ? 'var(--surface)' : 'var(--green-50)'; }}
                                                        >
                                                            <div style={{ marginTop: '2px', flexShrink: 0 }}>
                                                                <NotifIcon type={n.type} />
                                                            </div>
                                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                                <p style={{
                                                                    margin: 0, fontSize: '0.82rem',
                                                                    color: 'var(--text-primary)', lineHeight: 1.5,
                                                                    wordBreak: 'break-word', fontWeight: 500,
                                                                }}>
                                                                    {parseMsg(lang, n.message)}
                                                                </p>
                                                                <small style={{ color: 'var(--text-muted)', fontSize: '0.7rem', marginTop: '3px', display: 'block' }}>
                                                                    {new Date(n.createdAt).toLocaleDateString(
                                                                        lang === 'es' ? 'es-MX' : 'en-US',
                                                                        { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }
                                                                    )}
                                                                </small>
                                                            </div>
                                                            {!n.read && (
                                                                <div style={{
                                                                    width: '7px', height: '7px',
                                                                    background: 'var(--primary)',
                                                                    borderRadius: '50%', flexShrink: 0, marginTop: '5px'
                                                                }} />
                                                            )}
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* User menu */}
                            <div style={{ position: 'relative' }}>
                                <button
                                    className="nav-user-btn"
                                    onClick={() => { setShowDropdown(v => !v); setShowNotifications(false); }}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '8px',
                                        padding: '5px 12px 5px 5px',
                                        borderRadius: 'var(--radius-full)',
                                        border: '1.5px solid var(--border)',
                                        background: 'var(--surface)',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        boxShadow: 'var(--shadow-xs)',
                                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                                        flexShrink: 0,
                                    }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.borderColor = 'var(--grey-400)';
                                        e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.borderColor = 'var(--border)';
                                        e.currentTarget.style.boxShadow = 'var(--shadow-xs)';
                                    }}
                                >
                                    {/* Avatar using the user's chosen avatar */}
                                    <AvatarIcon
                                        avatarId={user.avatarId || 1}
                                        name={user.name}
                                        size={28}
                                    />
                                    <span className="nav-user-name" style={{
                                        maxWidth: '80px', overflow: 'hidden',
                                        textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                        fontSize: '0.85rem', fontWeight: 700,
                                        color: 'var(--text-primary)',
                                    }}>
                                        {user.name.split(' ')[0]}
                                    </span>
                                    <span className="nav-user-chevron">
                                        <ChevronDown size={13} color="var(--grey-400)" style={{
                                            transition: 'transform 0.2s',
                                            transform: showDropdown ? 'rotate(180deg)' : 'rotate(0deg)',
                                        }} />
                                    </span>
                                </button>

                                {showDropdown && (
                                    <>
                                        {/* Click outside overlay */}
                                        <div
                                            onClick={() => setShowDropdown(false)}
                                            style={{ position: 'fixed', inset: 0, zIndex: 199 }}
                                        />
                                        <div className="animate-scale" style={{
                                            position: 'absolute', top: '50px', right: '0',
                                            background: 'var(--surface)',
                                            borderRadius: 'var(--radius-lg)', zIndex: 200,
                                            width: '200px',
                                            boxShadow: 'var(--shadow-xl)',
                                            border: '1px solid var(--border)',
                                            overflow: 'hidden',
                                        }}>
                                        <div style={{
                                            padding: '14px 16px',
                                            borderBottom: '1px solid var(--border)',
                                            background: 'var(--grey-50)',
                                        }}>
                                            <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                                                {user.name}
                                            </div>
                                            <div style={{
                                                fontSize: '0.7rem', marginTop: '3px',
                                                color: user.role === 'moderator' ? '#7c3aed' : 'var(--primary)',
                                                fontWeight: 700, textTransform: 'uppercase',
                                                letterSpacing: '0.06em',
                                                display: 'flex', alignItems: 'center', gap: '4px',
                                            }}>
                                                {user.role === 'moderator'
                                                    ? <><Shield size={10} /> {t('roleModerator')}</>
                                                    : <><Leaf size={10} /> {t('roleUser')}</>
                                                }
                                            </div>
                                        </div>

                                        {/* Menu items */}
                                        {[
                                            {
                                                to: '/profile', icon: <User size={15} />,
                                                label: t('myProfile'), color: 'var(--text-primary)',
                                                show: true,
                                            },
                                            {
                                                to: '/moderator', icon: <Shield size={15} />,
                                                label: t('moderation'), color: '#7c3aed',
                                                show: user.role === 'moderator',
                                            },
                                        ].filter(i => i.show).map((item, idx) => (
                                            <Link
                                                key={idx}
                                                to={item.to}
                                                style={{
                                                    display: 'flex', alignItems: 'center', gap: '10px',
                                                    padding: '12px 16px', textDecoration: 'none',
                                                    color: item.color, fontSize: '0.875rem', fontWeight: 600,
                                                    borderTop: idx > 0 ? '1px solid var(--border)' : 'none',
                                                    transition: 'background 0.15s',
                                                }}
                                                onMouseEnter={e => e.currentTarget.style.background = 'var(--grey-50)'}
                                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                                onClick={() => setShowDropdown(false)}
                                            >
                                                {item.icon} {item.label}
                                            </Link>
                                        ))}

                                        <div
                                            style={{
                                                display: 'flex', alignItems: 'center', gap: '10px',
                                                padding: '12px 16px', cursor: 'pointer',
                                                color: 'var(--danger)', fontSize: '0.875rem', fontWeight: 600,
                                                borderTop: '1px solid var(--border)',
                                                transition: 'background 0.15s',
                                            }}
                                            onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'}
                                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                            onClick={() => { logout(); setShowDropdown(false); }}
                                        >
                                            <LogOut size={15} /> {t('logout')}
                                        </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </>
                    ) : (
                        <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                            <button
                                className="btn btn-outline btn-sm"
                                onClick={() => openAuth('login')}
                                style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 12px', fontSize: '0.78rem', whiteSpace: 'nowrap' }}
                            >
                                <User size={14} />
                                <span className="nav-auth-text">{t('login')}</span>
                            </button>
                            <button
                                className="btn btn-sm"
                                onClick={() => openAuth('register')}
                                style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 12px', fontSize: '0.78rem', whiteSpace: 'nowrap' }}
                            >
                                <Leaf size={14} />
                                <span className="nav-auth-text">{t('register')}</span>
                            </button>
                        </div>
                    )}
                </div>
            </header>

            {authMode && <AuthModal mode={authMode} onClose={() => setAuthMode(null)} />}
        </>
    );
};

export default Navbar;
