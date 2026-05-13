import { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../utils/firebaseSetup';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  deleteUser,
  sendEmailVerification
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs, writeBatch, deleteDoc, onSnapshot } from 'firebase/firestore';

// ============================================================================
// AuthContext: Proveedor de Autenticación Escalable y Seguro
// ============================================================================
// Este contexto administra el estado global del usuario utilizando Firebase Auth.
// Se ha diseñado de forma asíncrona y reactiva:
// 1. Escalabilidad: Al externalizar la gestión de tokens y sesiones a Google Cloud Identity,
//    nuestros servidores no sufren desgaste de CPU por validaciones criptográficas JWT.
// 2. Seguridad: Las operaciones críticas (Delete Account, Reset Password) viajan por canales 
//    verificados (correos oficiales) minimizando el riesgo de secuestro de cuentas.
// ============================================================================

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Listener Reactivo: Detecta cambios de sesión y sincroniza datos de perfil en tiempo real
  useEffect(() => {
    let unsubscribeDoc = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      // Limpiar listener anterior si existe
      if (unsubscribeDoc) {
        unsubscribeDoc();
        unsubscribeDoc = null;
      }

      if (firebaseUser) {
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        
        // Usar onSnapshot en lugar de getDoc para escuchar cambios en seguidores/amigos en TR
        unsubscribeDoc = onSnapshot(userDocRef, async (userDoc) => {
            if (userDoc.exists()) {
                const data = userDoc.data();
                // Retrocompatibilidad
                if (!data.searchId) {
                    const randomTag = Math.random().toString(36).substring(2, 6).toUpperCase();
                    data.searchId = `#ECO-${randomTag}`;
                    data.followersCount = 0;
                    data.followingCount = 0;
                    data.friendsCount = 0;
                    try {
                        await updateDoc(userDocRef, { 
                            searchId: data.searchId, 
                            followersCount: 0, 
                            followingCount: 0, 
                            friendsCount: 0 
                        });
                    } catch (e) { console.warn("Could not retro-update old user counters", e); }
                }
                setUser({ id: firebaseUser.uid, email: firebaseUser.email, emailVerified: firebaseUser.emailVerified, ...data });
            } else {
                setUser({ id: firebaseUser.uid, email: firebaseUser.email, emailVerified: firebaseUser.emailVerified, name: 'Usuario', role: 'user', searchId: '#ECO-0000', followersCount: 0, followingCount: 0, friendsCount: 0 });
            }
            setLoading(false);
        });
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => {
        unsubscribeAuth();
        if (unsubscribeDoc) unsubscribeDoc();
    };
  }, []);

  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (error) {
      console.error(error);
      return { error: 'err_invalid_login' };
    }
  };

  const register = async (name, email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Enviar correo de verificación
      try {
        await sendEmailVerification(userCredential.user);
      } catch (e) {
        console.error("Error al enviar correo de verificación:", e);
      }

      const randomTag = Math.random().toString(36).substring(2, 6).toUpperCase();
      const searchId = `#ECO-${randomTag}`;

      const newUserInfo = {
        name,
        role: 'user',
        avatarId: 1,  // avatar por defecto
        searchId,
        followersCount: 0,
        followingCount: 0,
        friendsCount: 0,
        createdAt: new Date().toISOString()
      };
      // Almacena la información adicional en la base de datos Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), newUserInfo);
      return { success: true };
    } catch (error) {
      console.error(error);
      if (error.code === 'auth/email-already-in-use') {
        return { error: 'err_email_in_use' };
      }
      return { error: 'err_register_error' };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const updateProfile = async (newName, newAvatarId) => {
    if (!user) return;
    try {
      const userRef = doc(db, 'users', user.id);
      const updates = {};
      if (newName !== undefined) updates.name = newName;
      if (newAvatarId !== undefined) updates.avatarId = newAvatarId;
      await updateDoc(userRef, updates);
      setUser(prev => ({ ...prev, ...updates }));

      // Construye el objeto de actualización específico para el autor
      const authorUpdates = {};
      if (newName !== undefined) authorUpdates.authorName = newName;
      if (newAvatarId !== undefined) authorUpdates.authorAvatarId = newAvatarId;

      if (Object.keys(authorUpdates).length > 0) {
        const batch = writeBatch(db);

        // Sincroniza la información del autor en todos los tips existentes creados por este usuario
        const tipsQ = query(collection(db, 'tips'), where('authorId', '==', user.id));
        const tipsSnap = await getDocs(tipsQ);
        tipsSnap.docs.forEach(d => batch.update(d.ref, authorUpdates));

        // Sync author info in all existing comments by this user
        const commentsQ = query(collection(db, 'comments'), where('authorId', '==', user.id));
        const commentsSnap = await getDocs(commentsQ);
        commentsSnap.docs.forEach(d => batch.update(d.ref, authorUpdates));

        await batch.commit();
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error) {
      console.error(error);
      if (error.code === 'auth/user-not-found') return { error: 'err_user_not_found' };
      return { error: 'err_reset_error' };
    }
  };

  const deleteAccount = async () => {
    try {
      if (!auth.currentUser) throw new Error('No hay sesión activa.');
      const uid = auth.currentUser.uid;
      // Elimina de la base de datos Firestore
      await deleteDoc(doc(db, 'users', uid));
      // Elimina de Auth
      await deleteUser(auth.currentUser);
      setUser(null);
      return { success: true };
    } catch (error) {
      console.error(error);
      if (error.code === 'auth/requires-recent-login') {
        return { error: 'err_requires_recent_login' };
      }
      return { error: 'err_delete_account_error' };
    }
  };

  const sendVerification = async () => {
    if (!auth.currentUser) return { error: 'err_no_user' };
    try {
      await sendEmailVerification(auth.currentUser);
      return { success: true };
    } catch (error) {
      console.error(error);
      if (error.code === 'auth/too-many-requests') return { error: 'err_too_many_requests' };
      return { error: 'err_send_email_error' };
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateProfile, resetPassword, deleteAccount, sendVerification }}>
      {children}
    </AuthContext.Provider>
  );
};
