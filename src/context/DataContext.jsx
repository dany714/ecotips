import { createContext, useState, useEffect, useContext, useCallback, useMemo, useRef } from 'react';
import { useAuth } from './AuthContext';
import { db } from '../utils/firebaseSetup';
import { sanitize, truncate } from '../utils/sanitize';
import {
    collection, onSnapshot, query, where,
    addDoc, updateDoc, deleteDoc, doc,
    serverTimestamp, increment, setDoc, getDocs,
    orderBy, limit, writeBatch
} from 'firebase/firestore';


export const SCALING_CONFIG = {
    USE_CLOUD_FUNCTIONS_FOR_COUNTS: false,

    ENABLE_OFFLINE_MODE: true
};

const DataContext = createContext();
export const useData = () => useContext(DataContext);


// Caché simple en memoria para prevenir dobles clics rápidos o llamadas dobles en React StrictMode
const recentNotificationsCache = new Set();

export const DataProvider = ({ children }) => {
    const { user } = useAuth();

    const [tips, setTips] = useState([]);
    const [comments, setComments] = useState([]);
    const [reports, setReports] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [likedTips, setLikedTips] = useState({});
    const [connections, setConnections] = useState({ followers: [], following: [], friends: [], sentRequests: [], receivedRequests: [] });
    const [loadingData, setLoadingData] = useState(true);

    // Referencias para Limitación de Tasa (Rate Limiting)
    const lastTipTime = useRef(0);
    const lastCommentTime = useRef(0);
    const [tipLimit, setTipLimit] = useState(15);
    const [hasMoreTips, setHasMoreTips] = useState(true);

    // ---- Escuchadores en Tiempo Real (Realtime Listeners) ----
    useEffect(() => {
        // 1. Escuchar Tips (Paginados)
        const qTips = query(collection(db, 'tips'), orderBy('createdAt', 'desc'), limit(tipLimit));
        const unsubTips = onSnapshot(qTips, (snapshot) => {
            const tipsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setTips(tipsData);
            setHasMoreTips(tipsData.length === tipLimit); // Si obtuvimos exactamente lo que pedimos, podría haber más
            setLoadingData(false);
        });

        // 2. Escuchar todos los comentarios (para simplicidad del demo, podría optimizarse por tip después)
        const unsubComments = onSnapshot(collection(db, 'comments'), (snapshot) => {
            const commentsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            commentsData.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            setComments(commentsData);
        });


        return () => {
            unsubTips();
            unsubComments();
        };
    }, [tipLimit]);

    useEffect(() => {
        if (!user || user.role !== 'moderator') {
            setReports([]);
            return;
        }

        const unsubReports = onSnapshot(collection(db, 'reports'), (snapshot) => {
            const reportsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            reportsData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setReports(reportsData);
        });

        return () => unsubReports();
    }, [user]);


    const loadMoreTips = useCallback(() => {
        if (!hasMoreTips) return;
        setTipLimit(prev => prev + 15);
    }, [hasMoreTips]);

    // 3. Escuchar Notificaciones, Likes y Conexiones Sociales
    useEffect(() => {
        if (!user) {
            setNotifications([]);
            setLikedTips({});
            setConnections({ followers: [], following: [], friends: [], sentRequests: [], receivedRequests: [] });
            return;
        }

        const qNotifs = query(collection(db, 'notifications'), where('userId', '==', user.id));
        const unsubNotifs = onSnapshot(qNotifs, (snapshot) => {
            const notifsMap = new Map();
            snapshot.docs.forEach(doc => {
                notifsMap.set(doc.id, { id: doc.id, ...doc.data() });
            });
            const notifsData = Array.from(notifsMap.values());
            notifsData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setNotifications(notifsData);
        });

        const qLikes = query(collection(db, 'likes'), where('userId', '==', user.id));
        const unsubLikes = onSnapshot(qLikes, (snapshot) => {
            const likesObj = {};
            snapshot.docs.forEach(d => {
                likesObj[`${user.id}-${d.data().tipId}`] = true;
            });
            setLikedTips(likesObj);
        });

        // Escuchar colecciones donde actúo como emisor (Mando follow, Mando solicitud de amistad)
        const qSender = query(collection(db, 'connections'), where('fromUserId', '==', user.id));
        // Escuchar colecciones donde actúo como receptor (Me siguen, Me mandan solicitud)
        const qReceiver = query(collection(db, 'connections'), where('toUserId', '==', user.id));

        let senderDocs = [];
        let receiverDocs = [];

        const processConnections = () => {
            const newConn = { followers: [], following: [], friends: [], sentRequests: [], receivedRequests: [] };
            senderDocs.forEach(d => {
                const data = d.data();
                if (data.type === 'follow') newConn.following.push(data.toUserId);
                else if (data.type === 'friend') {
                    if (data.status === 'pending') newConn.sentRequests.push(data.toUserId);
                    else if (data.status === 'accepted') newConn.friends.push(data.toUserId);
                }
            });
            receiverDocs.forEach(d => {
                const data = d.data();
                if (data.type === 'follow') newConn.followers.push(data.fromUserId);
                else if (data.type === 'friend') {
                    if (data.status === 'pending') newConn.receivedRequests.push({ connId: d.id, fromUserId: data.fromUserId });
                    else if (data.status === 'accepted') {
                        if (!newConn.friends.includes(data.fromUserId)) newConn.friends.push(data.fromUserId);
                    }
                }
            });
            setConnections(newConn);
        };

        const unsubSender = onSnapshot(qSender, (snap) => {
            senderDocs = snap.docs;
            processConnections();
        });
        const unsubReceiver = onSnapshot(qReceiver, (snap) => {
            receiverDocs = snap.docs;
            processConnections();
        });

        return () => {
            unsubNotifs();
            unsubLikes();
            unsubSender();
            unsubReceiver();
        };
    }, [user]);

    const pushNotification = useCallback(async (userId, message, type = 'info') => {
        if (!userId) return;

        // Guardia de memoria para StrictMode / doble clic rápido
        const cacheKey = `${userId}-${message}`;
        if (recentNotificationsCache.has(cacheKey)) return;
        recentNotificationsCache.add(cacheKey);
        setTimeout(() => recentNotificationsCache.delete(cacheKey), 5000); // limpiar después de 5s

        try {
            await addDoc(collection(db, 'notifications'), {
                userId,
                message,
                type,
                read: false,
                createdAt: new Date().toISOString()
            });
        } catch (e) { console.error(e); }
    }, []);

    const deleteNotification = useCallback(async (id) => {
        try {
            await deleteDoc(doc(db, 'notifications', id));
        } catch (e) { console.error('Error deleting notification:', e); }
    }, []);

    // ---- Tips ----
    const addTip = useCallback(async (tipData) => {
        // Limitación de Tasa: 30 segundos entre tips
        const now = Date.now();
        if (now - lastTipTime.current < 30000) {
            console.warn("Please wait before posting another tip.");
            return;
        }
        lastTipTime.current = now;

        try {
            const newTip = {
                ...tipData,
                title: truncate(sanitize(tipData.title), 70),
                description: truncate(sanitize(tipData.description), 1000),
                authorId: user ? user.id : null,
                likes: 0,
                reportsCount: 0,
                reports: [],
                stickers: tipData.stickers || [],
                isSuspended: false,
                createdAt: new Date().toISOString()
            };
            await addDoc(collection(db, 'tips'), newTip);
        } catch (e) { console.error(e); }
    }, [user]);

    const editTip = useCallback(async (id, updates) => {
        try {
            const safeUpdates = { ...updates };
            if (safeUpdates.title) safeUpdates.title = truncate(sanitize(safeUpdates.title), 70);
            if (safeUpdates.description) safeUpdates.description = truncate(sanitize(safeUpdates.description), 1000);
            await updateDoc(doc(db, 'tips', id), safeUpdates);
        } catch (e) { console.error(e); }
    }, []);

    const deleteTip = useCallback(async (id) => {
        try {
            // Primero encontrar y eliminar todos los comentarios asociados a este tip
            const commentsQuery = query(collection(db, 'comments'), where('tipId', '==', id));
            const commentsSnap = await getDocs(commentsQuery);

            const batch = writeBatch(db);
            // Poner en cola la eliminación del tip
            batch.delete(doc(db, 'tips', id));
            // Poner en cola las eliminaciones de comentarios
            commentsSnap.forEach(docSnap => {
                batch.delete(docSnap.ref);
            });

            await batch.commit();
        } catch (e) {
            console.error("Error deleting tip and comments", e);
        }
    }, []);

    const moderatorDeleteTip = useCallback(async (id, reason = 'incumplir las normas de la comunidad') => {
        const tip = tips.find(t => t.id === id);
        if (tip?.authorId) {
            pushNotification(tip.authorId, `Un moderador eliminó tu tip "${tip.title}" por: ${reason}|A moderator deleted your tip "${tip.title}" for: ${reason}`, 'danger');
        }
        await deleteTip(id);
    }, [tips, pushNotification, deleteTip]);

    const moderatorEditTip = useCallback(async (id, updates, reason = 'ajuste a las normas de la comunidad') => {
        const tip = tips.find(t => t.id === id);
        if (tip?.authorId) {
            pushNotification(tip.authorId, `Un moderador editó tu tip "${tip.title}" por: ${reason}|A moderator edited your tip "${tip.title}" for: ${reason}`, 'warning');
        }
        await editTip(id, updates);
    }, [tips, pushNotification, editTip]);

    const likeTip = useCallback(async (id) => {
        if (!user) return false;
        const key = `${user.id}-${id}`;
        const likeRef = doc(db, 'likes', key);
        const tipRef = doc(db, 'tips', id);

        // Capturar estado actual (snapshot local)
        const isCurrentlyLiked = !!likedTips[key];

        // Optimistic Update: Cambiar la UI instantáneamente para evitar clics dobles 
        // mientras Firebase procesa y el onSnapshot regresa.
        setLikedTips(prev => ({ ...prev, [key]: !isCurrentlyLiked }));

        try {
            if (isCurrentlyLiked) {
                // Quitar Like de la colección del usuario
                await deleteDoc(likeRef);

                if (!SCALING_CONFIG.USE_CLOUD_FUNCTIONS_FOR_COUNTS) {
                    try {
                        // Startup Mode: El cliente actualiza el contador global directamente
                        await updateDoc(tipRef, { likes: increment(-1) });
                    } catch (err) { console.warn("Counter decrement blocked/failed", err); }
                }
                return 'unliked';
            } else {
                // Agregar Like a la colección del usuario
                await setDoc(likeRef, { userId: user.id, tipId: id, createdAt: serverTimestamp() });

                if (!SCALING_CONFIG.USE_CLOUD_FUNCTIONS_FOR_COUNTS) {
                    try {
                        // Startup Mode: El cliente actualiza el contador global directamente
                        await updateDoc(tipRef, { likes: increment(1) });
                    } catch (err) { console.warn("Counter increment blocked/failed", err); }
                }
                return 'liked';
            }
        } catch (e) {
            console.error("Error toggling like:", e);
            // Hacer rollback del UI solo si la eliminación/creación del doc personal falló
            setLikedTips(prev => ({ ...prev, [key]: isCurrentlyLiked }));
        }
    }, [user, likedTips]);

    const hasLiked = useCallback((tipId) => {
        if (!user) return false;
        return !!likedTips[`${user.id}-${tipId}`];
    }, [user, likedTips]);

    const reportTip = useCallback(async (id, reason, details = '') => {
        if (!user) return;
        const tip = tips.find(t => t.id === id);
        if (!tip) return;

        const alreadyReported = (tip.reports || []).includes(user.id);
        if (alreadyReported) return;

        const newReports = [...(tip.reports || []), user.id];
        const newCount = newReports.length;
        const justSuspended = newCount >= 3 && !tip.isSuspended;

        if (justSuspended && tip.authorId) {
            pushNotification(tip.authorId, `Tu tip "${tip.title}" fue suspendido temporalmente por recibir múltiples reportes. Un moderador lo revisará pronto.|Your tip "${tip.title}" has been temporarily suspended due to multiple reports. A moderator will review it soon.`, 'warning');
        }

        try {
            // Actualizar contadores del Tip
            await updateDoc(doc(db, 'tips', id), {
                reports: newReports,
                reportsCount: newCount,
                isSuspended: newCount >= 3
            });
            // Crear documento de Reporte independiente
            await addDoc(collection(db, 'reports'), {
                tipId: id,
                tipTitle: tip.title,
                reportedBy: user.id,
                reason,
                details,
                createdAt: new Date().toISOString()
            });
        } catch (e) { console.error(e); }
    }, [user, tips, pushNotification]);

    const restoreTip = useCallback(async (id) => {
        const tip = tips.find(t => t.id === id);
        if (tip?.authorId) {
            pushNotification(tip.authorId, `¡Buenas noticias! Un moderador revisó y restauró tu tip "${tip.title}".|Good news! A moderator reviewed and restored your tip "${tip.title}".`, 'success');
        }
        try {
            await updateDoc(doc(db, 'tips', id), {
                isSuspended: false,
                reportsCount: 0,
                reports: []
            });
        } catch (e) { console.error(e); }
    }, [tips, pushNotification]);

    // ---- Comentarios ----
    const addComment = useCallback(async (tipId, text, name) => {
        // Limitación de Tasa: 10 segundos entre comentarios
        const now = Date.now();
        if (now - lastCommentTime.current < 10000) {
            console.warn("Please wait before posting another comment.");
            return;
        }
        lastCommentTime.current = now;

        const authorName = name || (user ? user.name : 'Anónimo');
        const newComment = {
            tipId,
            authorName: truncate(sanitize(authorName), 30),
            authorId: user?.id || null,
            authorAvatarId: user?.avatarId || 1,
            text: truncate(sanitize(text), 400),
            createdAt: new Date().toISOString()
        };

        try {
            await addDoc(collection(db, 'comments'), newComment);

            // Notify tip author if different from commenter
            const tip = tips.find(t => t.id === tipId);
            if (tip && tip.authorId && tip.authorId !== (user?.id)) {
                const snippet = text.slice(0, 50) + (text.length > 50 ? '...' : '');
                pushNotification(tip.authorId, `${authorName} comentó en tu tip "${tip.title}": "${snippet}"|${authorName} commented on your tip "${tip.title}": "${snippet}"`, 'info');
            }
        } catch (e) { console.error(e); }
    }, [user, tips, pushNotification]);

    const deleteComment = useCallback(async (commentId) => {
        try {
            const comment = comments.find(c => c.id === commentId);
            if (comment && user?.role === 'moderator' && comment.authorId && comment.authorId !== user.id) {
                const snippet = comment.text.slice(0, 30) + (comment.text.length > 30 ? '...' : '');
                pushNotification(
                    comment.authorId,
                    `Un moderador eliminó tu comentario: "${snippet}" por incumplir las normas.|A moderator deleted your comment: "${snippet}" for violating community guidelines.`,
                    'danger'
                );
            }
            await deleteDoc(doc(db, 'comments', commentId));
        } catch (e) { console.error(e); }
    }, [comments, user, pushNotification]);

    // ---- Notificaciones (Acciones Secundarias) ----
    const markNotificationRead = useCallback(async (notifId) => {
        try {
            await updateDoc(doc(db, 'notifications', notifId), { read: true });
        } catch (e) { console.error(e); }
    }, []);

    const markAllRead = useCallback(async () => {
        if (!user) return;
        try {
            const unread = notifications.filter(n => !n.read && n.userId === user.id);
            // En un entorno de producción real usaríamos un 'batch write', aquí hacemos un bucle por simplicidad
            for (const notif of unread) {
                await updateDoc(doc(db, 'notifications', notif.id), { read: true });
            }
        } catch (e) { console.error(e); }
    }, [user, notifications]);

    // ---- Funciones Sociales (Amigos y Seguidores) ----
    const toggleFollow = useCallback(async (toUserId) => {
        if (!user || user.id === toUserId) return;
        try {
            const isFollowing = connections.following.includes(toUserId);
            const qFilter = query(collection(db, 'connections'), where('type', '==', 'follow'), where('fromUserId', '==', user.id), where('toUserId', '==', toUserId));
            const snap = await getDocs(qFilter);

            const batch = writeBatch(db);
            const myRef = doc(db, 'users', user.id);
            const targetRef = doc(db, 'users', toUserId);

            if (isFollowing || !snap.empty) {
                snap.docs.forEach(d => batch.delete(d.ref));
                batch.update(myRef, { followingCount: increment(-1) });
                batch.update(targetRef, { followersCount: increment(-1) });
            } else {
                const newConnRef = doc(collection(db, 'connections'));
                batch.set(newConnRef, { type: 'follow', fromUserId: user.id, toUserId, status: 'active', createdAt: serverTimestamp() });
                batch.update(myRef, { followingCount: increment(1) });
                batch.update(targetRef, { followersCount: increment(1) });
                pushNotification(toUserId, `${user.name} ha comenzado a seguirte.|${user.name} started following you.`, 'info');
            }
            await batch.commit();
        } catch (e) { console.error('Error in toggleFollow:', e); }
    }, [user, connections.following, pushNotification]);

    const sendFriendRequest = useCallback(async (toUserId) => {
        if (!user || user.id === toUserId) return;
        try {
            await addDoc(collection(db, 'connections'), {
                type: 'friend',
                fromUserId: user.id,
                toUserId,
                status: 'pending',
                createdAt: serverTimestamp()
            });
            pushNotification(toUserId, `${user.name} te envió una solicitud de amistad.|${user.name} sent you a friend request.`, 'info');
        } catch (e) { console.error('Error sending friend request:', e); }
    }, [user, pushNotification]);

    const acceptFriendRequest = useCallback(async (connId, fromUserId) => {
        if (!user) return;
        try {
            const batch = writeBatch(db);
            const connRef = doc(db, 'connections', connId);
            batch.update(connRef, { status: 'accepted' });

            const myRef = doc(db, 'users', user.id);
            const senderRef = doc(db, 'users', fromUserId);

            batch.update(myRef, { friendsCount: increment(1) });
            batch.update(senderRef, { friendsCount: increment(1) });

            await batch.commit();
            pushNotification(fromUserId, `${user.name} aceptó tu solicitud de amistad.|${user.name} accepted your friend request.`, 'success');
        } catch (e) { console.error('Error accepting friend request:', e); }
    }, [user, pushNotification]);

    const rejectFriendRequest = useCallback(async (connId) => {
        if (!user) return;
        try { await deleteDoc(doc(db, 'connections', connId)); }
        catch (e) { console.error('Error rejecting friend request:', e); }
    }, [user]);

    const cancelFriendRequest = useCallback(async (toUserId) => {
        if (!user || user.id === toUserId) return;
        try {
            const qFilter = query(collection(db, 'connections'), where('type', '==', 'friend'), where('fromUserId', '==', user.id), where('toUserId', '==', toUserId));
            const snap = await getDocs(qFilter);
            if (!snap.empty) {
                const batch = writeBatch(db);
                snap.docs.forEach(d => batch.delete(d.ref));
                await batch.commit();
            }
        } catch (e) { console.error('Error canceling friend request:', e); }
    }, [user]);

    const removeFriend = useCallback(async (connId, otherUserId) => {
        if (!user || user.id === otherUserId) return;
        try {
            let refToDelete = connId ? doc(db, 'connections', connId) : null;
            if (!refToDelete) {
                const q1 = query(collection(db, 'connections'), where('type', '==', 'friend'), where('fromUserId', '==', user.id), where('toUserId', '==', otherUserId));
                const snap1 = await getDocs(q1);
                if (!snap1.empty) refToDelete = snap1.docs[0].ref;
                else {
                    const q2 = query(collection(db, 'connections'), where('type', '==', 'friend'), where('fromUserId', '==', otherUserId), where('toUserId', '==', user.id));
                    const snap2 = await getDocs(q2);
                    if (!snap2.empty) refToDelete = snap2.docs[0].ref;
                }
            }
            if (refToDelete) {
                const batch = writeBatch(db);
                batch.delete(refToDelete);
                batch.update(doc(db, 'users', user.id), { friendsCount: increment(-1) });
                batch.update(doc(db, 'users', otherUserId), { friendsCount: increment(-1) });
                await batch.commit();
            }
        } catch (e) { console.error('Error removing friend:', e); }
    }, [user]);

    const searchUsers = useCallback(async (queryStr) => {
        if (!queryStr || queryStr.length < 3) return [];
        try {
            const isTag = queryStr.startsWith('#');
            let qUsers;
            if (isTag) {
                qUsers = query(collection(db, 'users'), where('searchId', '==', queryStr.toUpperCase()), limit(1));
            } else {
                // Buscamos prefijo usando sufijo de escape \uf8ff
                const startQuery = queryStr;
                // El siguiente término para cerrar el rango de string prefix en firestore
                const endQuery = queryStr + '\uf8ff';
                qUsers = query(collection(db, 'users'), where('name', '>=', startQuery), where('name', '<=', endQuery), limit(20));
            }
            const snap = await getDocs(qUsers);
            return snap.docs.map(d => ({ id: d.id, ...d.data() }));
        } catch (e) { console.error('Error searching users:', e); return []; }
    }, []);

    const value = useMemo(() => ({
        tips, comments, reports, notifications, likedTips, connections,
        hasMoreTips, loadMoreTips, loadingData,
        addTip, editTip, deleteTip, moderatorDeleteTip, moderatorEditTip,
        likeTip, hasLiked, reportTip, restoreTip,
        addComment, deleteComment,
        markNotificationRead, markAllRead, pushNotification, deleteNotification,
        toggleFollow, sendFriendRequest, acceptFriendRequest, rejectFriendRequest, cancelFriendRequest, removeFriend, searchUsers
    }), [
        tips, comments, reports, notifications, likedTips, connections,
        hasMoreTips, loadMoreTips, loadingData,
        addTip, editTip, deleteTip, moderatorDeleteTip, moderatorEditTip,
        likeTip, hasLiked, reportTip, restoreTip,
        addComment, deleteComment,
        markNotificationRead, markAllRead, pushNotification, deleteNotification,
        toggleFollow, sendFriendRequest, acceptFriendRequest, rejectFriendRequest, cancelFriendRequest, removeFriend, searchUsers
    ]);

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
};
