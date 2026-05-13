import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import {
    Pencil, Shield, Leaf, ClipboardList, Heart, Bell,
    CheckCircle2, AlertTriangle, Ban, MessageSquare, Mail, ChevronLeft,
    Key, Trash2, MailWarning, Settings, Copy, Check, Search, X
} from 'lucide-react';
import TipCard from '../components/TipCard';
import TipDetailsModal from '../components/TipDetailsModal';
import AvatarIcon from '../components/AvatarIcon';
import EditProfileModal from '../components/EditProfileModal';
import ReportModal from '../components/ReportModal';
import CustomAlertModal from '../components/CustomAlertModal';
import ConnectionsModal from '../components/ConnectionsModal';
import PublicProfileModal from '../components/PublicProfileModal';

const TABS = ['myTips', 'likedTips', 'notificationTab'];

export default function Profile() {
    const { user, updateProfile, deleteAccount, resetPassword, sendVerification, logout } = useAuth();
    const { tips, notifications, markNotificationRead, markAllRead, hasLiked, connections, deleteNotification } = useData();
    const { t, lang } = useLanguage();
    const navigate = useNavigate();
    const [selectedTip, setSelectedTip] = useState(null);
    const [reportTip, setReportTip] = useState(null);
    const [tab, setTab] = useState('myTips');
    const [showEditProfile, setShowEditProfile] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [alertConfig, setAlertConfig] = useState(null);
    const [connectionsTab, setConnectionsTab] = useState(null);
    const [publicProfileId, setPublicProfileId] = useState(null);
    const [copiedId, setCopiedId] = useState(false);

    if (!user) return <Navigate to="/" />;

    const myTips = tips.filter(t => t.authorId === user.id);
    const likedTips = tips.filter(t => hasLiked(t.id) && !t.isSuspended);
    const myNotifs = notifications.filter(n => n.userId === user.id);
    const unread = myNotifs.filter(n => !n.read).length;

    const totalLikes = myTips.reduce((sum, t) => sum + (t.likes || 0), 0);
    const suspended = myTips.filter(t => t.isSuspended).length;
    const active = myTips.filter(t => !t.isSuspended).length;

    const notifTypeColors = { success: '#dcfce7', warning: '#fef9c3', danger: '#fee2e2', info: '#dbeafe' };
    const notifTypeText = { success: '#166534', warning: '#854d0e', danger: '#991b1b', info: '#1e40af' };
    const parseMsg = (msg = '') => { if (!msg.includes('|')) return msg; const p = msg.split('|'); return lang === 'es' ? p[0] : p[1] || p[0]; };

    const handleDeleteAccount = () => {
        setAlertConfig({
            title: t('deleteAccountTitle'),
            message: t('deleteAccountMsg'),
            type: 'danger',
            confirmText: t('deleteYes'),
            cancelText: t('cancelBtn'),
            onConfirm: async () => {
                setAlertConfig(null);
                const res = await deleteAccount();
                if (res?.error) {
                    setTimeout(() => setAlertConfig({ title: t('errorTitle'), message: t(res.error), type: 'danger', confirmText: t('understood'), onConfirm: () => setAlertConfig(null) }), 300);
                }
            },
            onCancel: () => setAlertConfig(null)
        });
    };

    const handleChangePassword = () => {
        // Si el correo no está verificado, bloquear y pedir verificación primero
        if (!user.emailVerified) {
            setAlertConfig({
                title: t('changePasswordTitle'),
                message: t('changePasswordNeedsVerification'),
                type: 'warning',
                confirmText: t('resendVerification'),
                cancelText: t('cancelBtn'),
                onConfirm: async () => {
                    setAlertConfig(null);
                    const res = await sendVerification();
                    setTimeout(() => {
                        if (res?.error) {
                            setAlertConfig({ title: t('errorTitle'), message: t(res.error), type: 'danger', confirmText: t('understood'), onConfirm: () => setAlertConfig(null) });
                        } else {
                            setAlertConfig({ title: t('emailSentTitle'), message: t('verificationSentMsg'), type: 'success', confirmText: t('understood'), onConfirm: () => setAlertConfig(null) });
                        }
                    }, 300);
                },
                onCancel: () => setAlertConfig(null)
            });
            return;
        }
        setAlertConfig({
            title: t('changePasswordTitle'),
            message: t('changePasswordMsg'),
            type: 'warning',
            confirmText: t('sendEmailBtn'),
            cancelText: t('cancelBtn'),
            onConfirm: async () => {
                setAlertConfig(null);
                const res = await resetPassword(user.email);
                setTimeout(() => {
                    if (res?.error) {
                        setAlertConfig({ title: t('errorTitle'), message: t(res.error), type: 'danger', confirmText: t('understood'), onConfirm: () => setAlertConfig(null) });
                    } else {
                        setAlertConfig({ title: t('emailSentTitle'), message: t('emailSentMsg'), type: 'success', confirmText: t('understood'), onConfirm: () => setAlertConfig(null) });
                    }
                }, 300);
            },
            onCancel: () => setAlertConfig(null)
        });
    };

    const handleSendVerification = async () => {
        const res = await sendVerification();
        if (res?.error) {
            setAlertConfig({ title: t('errorTitle'), message: t(res.error), type: 'warning', confirmText: t('close'), onConfirm: () => setAlertConfig(null) });
        } else {
            setAlertConfig({ title: t('emailSentTitle'), message: t('verificationSentMsg'), type: 'success', confirmText: t('understood'), onConfirm: () => setAlertConfig(null) });
        }
    };

    const handleTipClick = (tip) => {
        if (tip._filterAuthor) {
            setPublicProfileId(tip._filterAuthor.id);
        } else if (!tip.isSuspended) {
            setSelectedTip(tip);
        }
    };

    return (
        <div style={{ padding: '0 24px 40px', maxWidth: '980px', margin: '0 auto' }}>
            <CustomAlertModal 
                isOpen={!!alertConfig} 
                {...(alertConfig || {})} 
            />
            {/* Profile Header */}
            <div className="card" style={{ margin: '20px 0 24px', padding: 0, position: 'relative', overflow: 'hidden' }}>
                {/* Banner */}
                <div style={{
                    background: 'linear-gradient(135deg, var(--grey-900) 0%, #0f2518 100%)',
                    height: '140px',
                    position: 'relative',
                }}>
                    {/* Decorative glows */}
                    <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 85% 50%, rgba(34,197,94,0.18) 0%, transparent 55%), radial-gradient(circle at 15% 80%, rgba(34,197,94,0.08) 0%, transparent 40%)', pointerEvents: 'none' }} />
                    <div style={{ position: 'absolute', inset: 0, opacity: 0.08, backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '24px 24px', pointerEvents: 'none' }} />

                    {/* Back button */}
                    <button
                        onClick={() => navigate('/')}
                        className="btn btn-ghost btn-sm"
                        style={{
                            position: 'absolute', top: '16px', left: '16px',
                            display: 'flex', alignItems: 'center', gap: '6px',
                            color: 'rgba(255,255,255,0.9)', fontSize: '0.85rem', fontWeight: 600,
                            padding: '6px 14px', background: 'rgba(0,0,0,0.3)', borderRadius: '99px', backdropFilter: 'blur(8px)'
                        }}
                    >
                        <ChevronLeft size={16} /> {t('backToFeed') || 'Volver al feed'}
                    </button>
                </div>

                <div style={{ padding: '0 24px 24px 24px' }}>
                    {/* Avatar row with Action Button */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '-46px', marginBottom: '16px', position: 'relative', zIndex: 2 }}>
                        <div style={{
                            border: '4px solid var(--surface)',
                            borderRadius: '50%',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                            background: 'var(--green-100)',
                            display: 'inline-block'
                        }}>
                            <AvatarIcon avatarId={user.avatarId || 1} name={user.name} size={92} />
                        </div>
                        
                        {/* Settings Button Right-Aligned */}
                        <button onClick={() => setShowMobileMenu(true)} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '99px', fontSize: '0.85rem', fontWeight: 700, borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
                            <Settings size={16} /> <span className="hide-mobile">{t('settings') || 'Ajustes'}</span>
                        </button>
                    </div>

                    {/* Name and ID section */}
                    <div style={{ marginBottom: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)', letterSpacing: '-0.02em', wordBreak: 'break-word', lineHeight: 1.1 }}>{user.name}</h1>
                            {user.role === 'moderator' && (
                                <span style={{
                                    display: 'inline-flex', alignItems: 'center', gap: '4px',
                                    padding: '4px 10px', borderRadius: '99px',
                                    background: '#ede9fe', color: '#5b21b6',
                                    fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.02em'
                                }}>
                                    <Shield size={12} /> {t('roleModerator') || 'Moderador'}
                                </span>
                            )}
                        </div>
                        {user.searchId && (
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: '6px', cursor: 'pointer', color: 'var(--text-muted)' }} 
                                 onClick={() => {
                                     navigator.clipboard.writeText(user.searchId);
                                     setCopiedId(true);
                                     setTimeout(() => setCopiedId(false), 2000);
                                 }}>
                                <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{user.searchId}</span>
                                {copiedId ? <Check size={14} color="var(--success)" /> : <Copy size={13} opacity={0.6} />}
                                {copiedId && <span style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: 700, marginLeft: '4px' }}>{t('copied') || 'Copiado'}</span>}
                            </div>
                        )}
                    </div>

                    {/* Social Stats Line */}
                    <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', marginBottom: '28px', paddingBottom: '20px', borderBottom: '1px solid var(--border)' }}>
                        <div onClick={() => setConnectionsTab('followers')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                            <span style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--text-primary)' }}>{user.followersCount || 0}</span>
                            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{t('followers') || 'Seguidores'}</span>
                        </div>
                        <div onClick={() => setConnectionsTab('following')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                            <span style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--text-primary)' }}>{user.followingCount || 0}</span>
                            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{t('following') || 'Siguiendo'}</span>
                        </div>
                        <div onClick={() => setConnectionsTab('friends')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                            <span style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--text-primary)' }}>{user.friendsCount || 0}</span>
                            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{t('friends') || 'Amigos'}</span>
                        </div>
                        
                        {/* New Explicit Trigger for Finding Friends as requested */}
                        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
                            <button onClick={() => setConnectionsTab('search')} className="btn-secondary" style={{ padding: '6px 14px', borderRadius: '99px', fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', border: 'none', background: 'var(--green-100)', color: 'var(--green-800)', cursor: 'pointer' }}>
                                <Search size={14} /> {t('addFriend') || 'Buscar amigos'}
                            </button>
                        </div>
                    </div>

                    {/* App Stats Box */}
                    <div style={{ display: 'flex', gap: '24px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--green-700)' }}>{active}</span>
                            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>{t('activeTips') || 'Tips activos'}</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent)' }}>{totalLikes}</span>
                            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>{t('totalLikes') || 'Me gustas'}</span>
                        </div>
                        {suspended > 0 && (
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--danger)' }}>{suspended}</span>
                                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>{t('suspended') || 'Suspendidos'}</span>
                            </div>
                        )}
                    </div>

                    {!user.emailVerified && (
                        <div style={{ marginTop: '24px', background: '#fefce8', border: '1px solid #fef08a', padding: '12px 16px', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#a16207', fontSize: '0.85rem', fontWeight: 600 }}>
                                <div style={{ background: '#fef08a', padding: '6px', borderRadius: '50%', color: '#854d0e', display: 'flex' }}>
                                    <MailWarning size={16} />
                                </div>
                                {t('unverifiedAlert') || 'Verifica tu correo, por favor'}
                            </div>
                            <button onClick={handleSendVerification} className="btn btn-sm" style={{ background: '#ca8a04', color: 'white', padding: '8px 16px', fontSize: '0.8rem', border: 'none' }}>
                                {t('resendVerification') || 'Enviar'}
                            </button>
                        </div>
                    )}
                </div>

                {/* Bottom Sheet Settings Form */}
                {showMobileMenu && (
                    <div className="animate-fade" style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(2px)' }} onClick={() => setShowMobileMenu(false)} />
                        <div className="animate-slide-up" style={{ width: '100%', maxWidth: '600px', background: 'var(--surface)', borderRadius: '24px 24px 0 0', padding: '24px', position: 'relative', zIndex: 1, paddingBottom: 'max(24px, env(safe-area-inset-bottom))' }}>
                            <div style={{ width: '36px', height: '5px', background: 'var(--border)', borderRadius: '99px', margin: '0 auto 24px' }} />
                            <h3 style={{ margin: '0 0 20px', fontSize: '1.2rem', fontWeight: 800, textAlign: 'center', color: 'var(--text-primary)' }}>{t('settings') || 'Ajustes de Perfil'}</h3>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <button onClick={() => { setShowMobileMenu(false); setShowEditProfile(true); }} className="btn btn-outline" style={{ justifyContent: 'flex-start', padding: '16px 20px', border: '1px solid var(--border)', fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                                    <Pencil size={18} color="var(--text-secondary)" /> {t('editProfileTitle')}
                                </button>
                                <button onClick={() => { setShowMobileMenu(false); handleChangePassword(); }} className="btn btn-outline" style={{ justifyContent: 'flex-start', padding: '16px 20px', border: '1px solid var(--border)', fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                                    <Key size={18} color="var(--text-secondary)" /> {t('changePassword')}
                                </button>
                                <button onClick={() => { setShowMobileMenu(false); handleDeleteAccount(); }} className="btn btn-outline" style={{ justifyContent: 'flex-start', padding: '16px 20px', border: '1px solid var(--danger)', color: 'var(--danger)', fontSize: '0.95rem', background: 'rgba(220,38,38,0.05)' }}>
                                    <Trash2 size={18} /> {t('deleteAccount')}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Tabs */}
            <div style={{ overflowX: 'auto', marginBottom: '20px', paddingBottom: '2px' }}>
                <div style={{ display: 'flex', gap: '4px', background: 'var(--grey-100)', borderRadius: 'var(--radius-md)', padding: '4px', width: 'max-content', minWidth: '100%', border: '1px solid var(--border)' }}>
                    {TABS.map(key => (
                        <button
                            key={key}
                            onClick={() => setTab(key)}
                            style={{
                                padding: '8px 18px', borderRadius: 'var(--radius-sm)', border: 'none', cursor: 'pointer',
                                background: tab === key ? 'var(--surface)' : 'transparent',
                                color: tab === key ? 'var(--text-primary)' : 'var(--text-muted)',
                                fontWeight: tab === key ? 800 : 600, fontSize: '0.875rem',
                                boxShadow: tab === key ? 'var(--shadow-xs)' : 'none',
                                transition: 'all 0.15s', position: 'relative', whiteSpace: 'nowrap',
                                fontFamily: "'Plus Jakarta Sans', sans-serif", flex: 1, textAlign: 'center'
                            }}
                        >
                            {t(key)}
                            {key === 'notificationTab' && unread > 0 && (
                                <span style={{ position: 'absolute', top: '-4px', right: '-4px', background: 'var(--danger)', color: 'white', borderRadius: '99px', padding: '0 5px', fontSize: '0.62rem', fontWeight: 800, minWidth: '16px', textAlign: 'center' }}>
                                    {unread}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {tab === 'myTips' && (
                <>
                    {myTips.length === 0 ? (
                        <div className="card" style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
                            <ClipboardList size={44} style={{ marginBottom: '12px', opacity: 0.3 }} />
                            <p style={{ fontWeight: 600 }}>{t('noMyTips')}</p>
                        </div>
                    ) : (
                        <div className="tips-board">
                            {myTips.map(tip => (
                                <TipCard key={tip.id} tip={tip} onClick={handleTipClick} />
                            ))}
                        </div>
                    )}
                </>
            )}

            {tab === 'likedTips' && (
                <>
                    {likedTips.length === 0 ? (
                        <div className="card" style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
                            <Heart size={44} style={{ marginBottom: '12px', opacity: 0.3 }} />
                            <p style={{ fontWeight: 600 }}>{t('noLikedTips')}</p>
                            <p style={{ fontSize: '0.85rem', marginTop: '8px' }}>{t('doubleTapHint')}</p>
                        </div>
                    ) : (
                        <div className="tips-board">
                            {likedTips.map(tip => (
                                <TipCard key={tip.id} tip={tip} onClick={handleTipClick} />
                            ))}
                        </div>
                    )}
                </>
            )}

            {tab === 'notificationTab' && (
                <div className="card">
                    <div style={{ padding: '16px 20px', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ fontWeight: 700, margin: 0, fontSize: '0.95rem' }}>{t('notificationTab')}</h3>
                        {unread > 0 && (
                            <button onClick={markAllRead} style={{ background: 'transparent', border: 'none', color: 'var(--primary)', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600 }}>
                                {t('markAllRead')}
                            </button>
                        )}
                    </div>
                    {myNotifs.length === 0 ? (
                        <div style={{ padding: '48px', textAlign: 'center', color: '#9ca3af' }}>
                            <Bell size={40} style={{ marginBottom: '8px', opacity: 0.35 }} />
                            <p style={{ fontSize: '0.875rem' }}>{t('noNotifText')}</p>
                        </div>
                    ) : (
                        <div style={{ maxHeight: '460px', overflowY: 'auto' }}>
                            {myNotifs.map(n => (
                                <div
                                    key={n.id}
                                    style={{
                                        padding: '14px 20px', borderBottom: '1px solid #f9fafb',
                                        background: n.read ? 'white' : notifTypeColors[n.type] || '#f0fdf4',
                                        display: 'flex', gap: '12px', alignItems: 'flex-start', transition: 'background 0.15s'
                                    }}
                                >
                                    <div style={{ flexShrink: 0, marginTop: '2px', cursor: 'pointer' }} onClick={() => markNotificationRead(n.id)}>
                                        {({
                                            success: <CheckCircle2 size={17} color="#16a34a" />,
                                            warning: <AlertTriangle size={17} color="#d97706" />,
                                            danger:  <Ban size={17} color="#dc2626" />,
                                            info:    <MessageSquare size={17} color="#2563eb" />,
                                        })[n.type] || <Mail size={17} color="#6b7280" />}
                                    </div>
                                    <div style={{ flex: 1, cursor: 'pointer' }} onClick={() => markNotificationRead(n.id)}>
                                        <p style={{ margin: '0 0 4px', fontSize: '0.875rem', color: '#374151' }}>{parseMsg(n.message)}</p>
                                        <small style={{ color: '#9ca3af', fontSize: '0.72rem' }}>
                                            {new Date(n.createdAt).toLocaleDateString(lang === 'es' ? 'es-MX' : 'en-US', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                        </small>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0, marginTop: '2px' }}>
                                        {!n.read && <div style={{ width: '8px', height: '8px', background: 'var(--primary)', borderRadius: '50%', cursor: 'pointer' }} onClick={() => markNotificationRead(n.id)} />}
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); deleteNotification(n.id); }}
                                            style={{ background: 'transparent', border: 'none', color: '#9ca3af', cursor: 'pointer', padding: '2px', display: 'flex' }}
                                            title="Eliminar notificación"
                                        >
                                            <X size={15} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {selectedTip && (
                <TipDetailsModal 
                    tip={selectedTip} 
                    onClose={() => setSelectedTip(null)} 
                    onAuthorClick={(id) => {
                        setPublicProfileId(id);
                        setSelectedTip(null);
                    }}
                    onReport={(t) => {
                        setSelectedTip(null);
                        setReportTip(t);
                    }}
                />
            )}

            {publicProfileId && (
                <PublicProfileModal targetUserId={publicProfileId} onClose={() => setPublicProfileId(null)} />
            )}

            {reportTip && (
                <ReportModal tip={reportTip} onClose={() => setReportTip(null)} />
            )}

            {showEditProfile && (
                <EditProfileModal onClose={() => setShowEditProfile(false)} />
            )}

            {connectionsTab && (
                <ConnectionsModal initialTab={connectionsTab} onClose={() => setConnectionsTab(null)} />
            )}
        </div>
    );
}
