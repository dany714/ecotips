import { useState, useEffect } from 'react';
import { X, Search, UserCheck, UserPlus, Users, Bell, ChevronRight, UserMinus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../utils/firebaseSetup';
import AvatarIcon from './AvatarIcon';
import PublicProfileModal from './PublicProfileModal';
import { useModalBodyClass } from '../hooks/useModalBodyClass';

export default function ConnectionsModal({ initialTab = 'search', onClose }) {
    const { user } = useAuth();
    const { t } = useLanguage();
    const { connections, searchUsers, toggleFollow, sendFriendRequest, acceptFriendRequest, rejectFriendRequest, removeFriend } = useData();
    useModalBodyClass();

    const [activeTab, setActiveTab] = useState(initialTab); // 'search', 'friends', 'followers', 'following', 'requests'
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    
    const [loadedProfiles, setLoadedProfiles] = useState({});
    const [viewProfileId, setViewProfileId] = useState(null);

    // Fetch batch of profiles by ID
    const loadProfiles = async (uids) => {
        const missing = uids.filter(uid => !loadedProfiles[uid] && uid !== user.id);
        if (missing.length === 0) return;
        
        const newProfiles = { ...loadedProfiles };
        await Promise.all(missing.map(async (uid) => {
            try {
                const d = await getDoc(doc(db, 'users', uid));
                if (d.exists()) newProfiles[uid] = { id: d.id, ...d.data() };
            } catch(e) {}
        }));
        setLoadedProfiles(newProfiles);
    };

    // Auto-load profiles when tabs change
    useEffect(() => {
        let uidsToLoad = [];
        if (activeTab === 'friends') uidsToLoad = connections.friends;
        else if (activeTab === 'followers') uidsToLoad = connections.followers;
        else if (activeTab === 'following') uidsToLoad = connections.following;
        else if (activeTab === 'requests') uidsToLoad = connections.receivedRequests.map(r => r.fromUserId);
        
        loadProfiles(uidsToLoad);
    }, [activeTab, connections]);

    // Handle search dynamically
    useEffect(() => {
        if (activeTab !== 'search' || searchQuery.length < 3) {
            setSearchResults([]);
            return;
        }
        const timer = setTimeout(async () => {
            setIsSearching(true);
            const results = await searchUsers(searchQuery);
            // Filter out self
            setSearchResults(results.filter(u => u.id !== user.id));
            setIsSearching(false);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery, activeTab, searchUsers, user.id]);

    const renderUserList = (uids, emptyMessage) => {
        if (uids.length === 0) return <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>{emptyMessage}</div>;
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>
                {uids.map(uid => {
                    const profile = loadedProfiles[uid];
                    if (!profile) return <div key={uid} className="skeleton-card card-h-sm" style={{ height: '60px' }} />;
                    
                    return (
                        <div key={uid} onClick={() => setViewProfileId(uid)} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'var(--grey-50)', borderRadius: 'var(--radius-lg)', cursor: 'pointer', border: '1px solid transparent', transition: 'all 0.2s', ':hover': { borderColor: 'var(--green-200)', background: 'white' } }}>
                            <AvatarIcon avatarId={profile.avatarId || 1} name={profile.name} size={42} />
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{profile.name}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{profile.searchId || ''}</div>
                            </div>
                            <ChevronRight size={18} color="var(--text-muted)" />
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <>
            <div className="modal-overlay animate-fade" onClick={e => e.target === e.currentTarget && onClose()}>
                <div className="modal animate-scale" style={{ maxWidth: '500px', width: '100%', minHeight: '60vh', maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', padding: 0 }}>
                    
                    <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--surface)' }}>
                        <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>{t('connections')}</h2>
                        <button className="modal-close-btn" onClick={onClose}><X size={20} /></button>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', padding: '16px 24px', background: 'var(--grey-50)', borderBottom: '1px solid var(--border)' }}>
                        {[
                            { id: 'search', label: t('searchUsers') || 'Buscar', icon: Search },
                            { id: 'friends', label: t('friends'), icon: Users },
                            { id: 'requests', label: t('friendRequests') || 'Peticiones', icon: Bell, badge: connections.receivedRequests.length },
                            { id: 'followers', label: t('followers'), icon: UserCheck },
                            { id: 'following', label: t('following'), icon: UserPlus },
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap',
                                    padding: '8px 16px', borderRadius: '99px', fontSize: '0.85rem', fontWeight: 600,
                                    border: 'none', cursor: 'pointer', transition: 'all 0.2s', position: 'relative',
                                    background: activeTab === tab.id ? 'var(--green-100)' : 'transparent',
                                    color: activeTab === tab.id ? 'var(--green-800)' : 'var(--text-secondary)'
                                }}
                            >
                                <tab.icon size={15} /> {tab.label}
                                {tab.badge > 0 && (
                                    <div style={{ position: 'absolute', top: '-4px', right: '-4px', background: 'var(--danger)', color: 'white', fontSize: '0.65rem', fontWeight: 800, width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}>
                                        {tab.badge}
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>

                    <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', background: 'var(--surface)' }}>
                        
                        {activeTab === 'search' && (
                            <div>
                                <div style={{ position: 'relative', marginBottom: '20px' }}>
                                    <div style={{ position: 'absolute', top: 0, left: '14px', height: '100%', display: 'flex', alignItems: 'center', pointerEvents: 'none' }}>
                                        <Search size={18} color="var(--text-muted)" />
                                    </div>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder={t('searchUsersPlaceholder') || 'Busca por nombre o #ID...'}
                                        style={{ paddingLeft: '40px', margin: 0, borderRadius: 'var(--radius-full)' }}
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        autoFocus
                                    />
                                </div>
                                
                                {isSearching ? (
                                    <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}><div className="spinner" /></div>
                                ) : searchResults.length > 0 ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        {searchResults.map(u => (
                                            <div key={u.id} onClick={() => setViewProfileId(u.id)} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'var(--grey-50)', borderRadius: 'var(--radius-lg)', cursor: 'pointer' }}>
                                                <AvatarIcon avatarId={u.avatarId || 1} name={u.name} size={42} />
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{u.name}</div>
                                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{u.searchId || ''}</div>
                                                </div>
                                                <ChevronRight size={18} color="var(--text-muted)" />
                                            </div>
                                        ))}
                                    </div>
                                ) : searchQuery.length >= 3 ? (
                                    <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>{t('noUsersFound') || 'No se encontraron usuarios.'}</div>
                                ) : (
                                    <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                                        <Users size={32} opacity={0.3} />
                                        <span style={{ fontSize: '0.9rem' }}>Busca a tus amigos en la red sostenible.</span>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'friends' && renderUserList(connections.friends, 'Aún no tienes amigos agregados.')}
                        {activeTab === 'followers' && renderUserList(connections.followers, 'Nadie te sigue aún.')}
                        {activeTab === 'following' && renderUserList(connections.following, 'No sigues a nadie todavía.')}

                        {activeTab === 'requests' && (
                            connections.receivedRequests.length === 0 ? (
                                <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>No tienes peticiones de amistad pendientes.</div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {connections.receivedRequests.map(req => {
                                        const profile = loadedProfiles[req.fromUserId];
                                        if (!profile) return <div key={req.connId} className="skeleton-card card-h-sm" />;
                                        return (
                                            <div key={req.connId} style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '12px', padding: '12px', background: 'white', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)' }}>
                                                <div onClick={() => setViewProfileId(profile.id)} style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: '150px', cursor: 'pointer' }}>
                                                    <AvatarIcon avatarId={profile.avatarId || 1} name={profile.name} size={42} />
                                                    <div style={{ minWidth: 0 }}>
                                                        <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{profile.name}</div>
                                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Quiere ser tu amigo</div>
                                                    </div>
                                                </div>
                                                <div style={{ display: 'flex', gap: '6px', marginLeft: 'auto' }}>
                                                    <button onClick={() => acceptFriendRequest(req.connId, req.fromUserId)} className="btn" style={{ padding: '6px 14px', fontSize: '0.8rem', background: 'var(--success)', border: 'none', color: 'white', boxShadow: '0 2px 8px rgba(34,197,94,0.2)' }}>{t('accept') || 'Aceptar'}</button>
                                                    <button onClick={() => rejectFriendRequest(req.connId)} className="btn btn-outline" style={{ padding: '6px 14px', fontSize: '0.8rem', color: 'var(--danger)', borderColor: 'var(--danger)' }}>{t('reject') || 'Rechazar'}</button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )
                        )}

                    </div>
                </div>
            </div>

            {viewProfileId && (
                <PublicProfileModal targetUserId={viewProfileId} onClose={() => setViewProfileId(null)} />
            )}
        </>
    );
}
