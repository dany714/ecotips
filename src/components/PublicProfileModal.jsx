import { useState, useEffect, useMemo } from 'react';
import { X, UserPlus, UserCheck, Shield, Leaf, Copy, UserMinus, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../utils/firebaseSetup';
import AvatarIcon from './AvatarIcon';
import TipCard from './TipCard';
import { useModalBodyClass } from '../hooks/useModalBodyClass';

export default function PublicProfileModal({ targetUserId, onClose }) {
    const { user } = useAuth();
    const { t } = useLanguage();
    const { tips, connections, toggleFollow, sendFriendRequest, removeFriend, cancelFriendRequest, acceptFriendRequest } = useData();
    useModalBodyClass();

    const [targetUser, setTargetUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    // Fetch user profile stats
    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }
        if (!targetUserId) return;
        const fetchUser = async () => {
            try {
                const d = await getDoc(doc(db, 'users', targetUserId));
                if (d.exists()) setTargetUser({ id: d.id, ...d.data() });
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [targetUserId]);

    const isSelf = user?.id === targetUserId;
    const isFollowing = connections.following.includes(targetUserId);
    const isFriend = connections.friends.includes(targetUserId);
    const sentRequest = connections.sentRequests.includes(targetUserId);
    const receivedRequest = connections.receivedRequests.some(r => r.fromUserId === targetUserId);

    const userTips = useMemo(() => tips.filter(tip => tip.authorId === targetUserId), [tips, targetUserId]);

    const handleCopyId = () => {
        if (!targetUser?.searchId) return;
        navigator.clipboard.writeText(targetUser.searchId);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleFollow = async () => {
        await toggleFollow(targetUserId);
        setTargetUser(prev => ({ ...prev, followersCount: prev.followersCount + (isFollowing ? -1 : 1) }));
    };

    const handleFriendAction = async () => {
        if (isFriend) {
            if (window.confirm(t('confirmDeleteFriend') || '¿Seguro que deseas eliminar a este usuario de tus amigos?')) {
                await removeFriend(null, targetUserId); 
                setTargetUser(prev => ({ ...prev, friendsCount: Math.max(0, prev.friendsCount - 1) }));
            }
        } else if (sentRequest) {
            await cancelFriendRequest(targetUserId);
        } else if (receivedRequest) {
            const req = connections.receivedRequests.find(r => r.fromUserId === targetUserId);
            if (req) {
                 await acceptFriendRequest(req.connId, targetUserId);
                 setTargetUser(prev => ({ ...prev, friendsCount: (prev.friendsCount || 0) + 1 }));
            }
        } else {
            await sendFriendRequest(targetUserId);
        }
    };

    if (loading) return null; // o un skeleton
    
    // Guest User Catch - Authentication Wall
    if (!user) {
        return (
            <div className="modal-overlay animate-fade" onClick={e => e.target === e.currentTarget && onClose()}>
                <div className="modal animate-scale" style={{ maxWidth: '400px', width: '90%', padding: '32px 24px', textAlign: 'center', background: 'var(--surface)', borderRadius: 'var(--radius-xl)' }}>
                    <div style={{ background: 'var(--green-50)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: 'var(--primary)' }}>
                        <Shield size={32} />
                    </div>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0 0 12px', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                        Únete a Eco Tips
                    </h2>
                    <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: 1.5, fontWeight: 500 }}>
                        Crea una cuenta gratuita para ver los perfiles completos de la comunidad, seguir a tus autores favoritos y descubrir todos sus tips ecológicos.
                    </p>
                    <button onClick={onClose} className="btn" style={{ width: '100%', padding: '12px', fontSize: '1rem', fontWeight: 700, borderRadius: '99px' }}>
                        Entendido
                    </button>
                </div>
            </div>
        );
    }

    if (!targetUser) return (
        <div className="modal-overlay">
            <div className="modal" style={{ padding: '24px', textAlign: 'center' }}>
                <p>{t('noUsersFound')}</p>
                <button className="btn" onClick={onClose}>{t('close')}</button>
            </div>
        </div>
    );

    return (
        <div className="modal-overlay animate-fade" onClick={e => e.target === e.currentTarget && onClose()}>
            <div className="modal animate-scale hide-scrollbar" style={{ maxWidth: '600px', width: '90%', maxHeight: '90vh', overflowX: 'hidden', overflowY: 'auto', padding: 0, display: 'flex', flexDirection: 'column', background: 'var(--surface)' }}>
                
                {/* Banner */}
                <div style={{
                    flexShrink: 0, position: 'relative', height: '140px',
                    background: 'linear-gradient(135deg, var(--grey-900) 0%, #0f2518 100%)'
                }}>
                    {/* Decorative glows */}
                    <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 85% 50%, rgba(34,197,94,0.18) 0%, transparent 55%), radial-gradient(circle at 15% 80%, rgba(34,197,94,0.08) 0%, transparent 40%)', pointerEvents: 'none' }} />
                    <div style={{ position: 'absolute', inset: 0, opacity: 0.08, backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '24px 24px', pointerEvents: 'none' }} />

                    <button className="btn btn-ghost btn-sm" onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(0,0,0,0.3)', color: 'rgba(255,255,255,0.9)', padding: '6px', borderRadius: '50%', backdropFilter: 'blur(8px)' }}>
                        <X size={18} />
                    </button>
                </div>

                <div style={{ padding: '0 24px 24px 24px', flex: 1 }}>
                    {/* Avatar row with Action Buttons */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '-46px', marginBottom: '16px', position: 'relative', zIndex: 2 }}>
                        <div style={{
                            border: '4px solid var(--surface)',
                            borderRadius: '50%',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                            background: 'var(--green-100)',
                            display: 'inline-block'
                        }}>
                            <AvatarIcon avatarId={targetUser.avatarId || 1} name={targetUser.name} size={92} />
                        </div>
                        
                        {/* Action Buttons Right-Aligned */}
                        {user && !isSelf && (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                                <button onClick={handleFollow} style={{ 
                                    padding: '8px 16px', borderRadius: '99px', fontSize: '0.85rem', fontWeight: 800, cursor: 'pointer', border: 'none',
                                    background: isFollowing ? 'var(--grey-100)' : 'var(--text-primary)',
                                    color: isFollowing ? 'var(--text-primary)' : 'var(--surface)',
                                    boxShadow: isFollowing ? 'none' : '0 4px 12px rgba(0,0,0,0.1)'
                                }}>
                                    {isFollowing ? t('unfollow') || 'Siguiendo' : t('follow') || 'Seguir'}
                                </button>
                                
                                {isFriend ? (
                                    <button onClick={handleFriendAction} title="Eliminar amigo" style={{ padding: '7px 14px', borderRadius: '99px', fontSize: '0.85rem', fontWeight: 800, color: 'var(--green-800)', background: 'var(--green-100)', display: 'flex', alignItems: 'center', gap: '6px', border: '1px solid var(--green-200)', cursor: 'pointer', transition: 'all 0.2s', opacity: 0.9 }}>
                                        <UserCheck size={16} /> <span>{t('friends') || 'Amigos'}</span>
                                    </button>
                                ) : sentRequest ? (
                                    <button onClick={handleFriendAction} style={{ padding: '7px 14px', borderRadius: '99px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', background: 'var(--grey-100)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', border: '1px solid var(--border)' }}>
                                        <span>{t('cancelRequest') || 'Cancelar'}</span>
                                    </button>
                                ) : receivedRequest ? (
                                    <button onClick={handleFriendAction} style={{ padding: '7px 14px', borderRadius: '99px', fontSize: '0.85rem', fontWeight: 800, background: 'var(--success)', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 4px 12px rgba(34,197,94,0.3)' }}>
                                        <span>{t('accept') || 'Aceptar'}</span>
                                    </button>
                                ) : (
                                    <button onClick={handleFriendAction} style={{ padding: '7px 14px', borderRadius: '99px', fontSize: '0.85rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--surface)', color: 'var(--text-primary)', border: '1px solid var(--border)', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                                        <UserPlus size={16} /> <span>{t('addFriend') || 'Añadir'}</span>
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Name and ID section */}
                    <div style={{ marginBottom: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)', letterSpacing: '-0.02em', wordBreak: 'break-word', lineHeight: 1.1 }}>{targetUser.name}</h2>
                            {targetUser.role === 'moderator' && (
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
                        {targetUser.searchId && (
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: '6px', cursor: 'pointer', color: 'var(--text-muted)' }} 
                                 onClick={handleCopyId}>
                                <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{targetUser.searchId}</span>
                                {copied ? <Check size={14} color="var(--success)" /> : <Copy size={13} opacity={0.6} />}
                                {copied && <span style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: 700, marginLeft: '4px' }}>{t('copied') || 'Copiado'}</span>}
                            </div>
                        )}
                    </div>

                    {/* Stats Row */}
                    <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', marginBottom: '24px', paddingBottom: '20px', borderBottom: '1px solid var(--border)' }}>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                            <span style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--text-primary)' }}>{targetUser.followersCount || 0}</span>
                            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{t('followers') || 'Seguidores'}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                            <span style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--text-primary)' }}>{targetUser.followingCount || 0}</span>
                            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{t('following') || 'Siguiendo'}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                            <span style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--text-primary)' }}>{targetUser.friendsCount || 0}</span>
                            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{t('friends') || 'Amigos'}</span>
                        </div>
                    </div>

                    {/* Tips Grid */}
                    <div>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '16px', color: 'var(--text-primary)' }}>Tips de {targetUser.name}</h3>
                        {userTips.length > 0 ? (
                            <div className="tips-grid">
                                {userTips.map(tip => (
                                    <TipCard key={tip.id} tip={tip} onClick={() => {}} />
                                ))}
                            </div>
                        ) : (
                            <div style={{ padding: '40px 20px', textAlign: 'center', background: 'var(--grey-50)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--border)' }}>
                                <Leaf size={32} color="var(--grey-300)" style={{ margin: '0 auto 12px' }} />
                                <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.95rem', fontWeight: 500 }}>Este usuario aún no ha publicado tips recientes.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
