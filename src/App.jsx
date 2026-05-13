import { Routes, Route } from 'react-router-dom';
import { useEffect, useRef, Suspense, lazy } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const Home = lazy(() => import('./pages/Home'));
const Profile = lazy(() => import('./pages/Profile'));
const ModeratorDashboard = lazy(() => import('./pages/ModeratorDashboard'));
const LegalAndStandards = lazy(() => import('./pages/LegalAndStandards'));
const NotFound = lazy(() => import('./pages/NotFound'));
import './App.css';
import { LanguageProvider } from './context/LanguageContext';
import { collection, getDocs, setDoc, doc } from 'firebase/firestore';
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { db, auth } from './utils/firebaseSetup';

function App() {
  const seededRef = useRef(false);

  // Global Seeder (Runs only once and only if the remote DB is completely empty)
  useEffect(() => {
    const seedDatabase = async () => {
      if (seededRef.current) return;

      try {
        // Inject Moderator Account independently (if DB is empty or users collection is empty)
        const usersSnap = await getDocs(collection(db, 'users'));
        if (usersSnap.empty) {
          console.log("Inyectando cuenta de moderador y usuarios demo...");
          try {
            // Moderador
            const modCreds = await createUserWithEmailAndPassword(auth, 'mod@ecotips.com', 'mod123456');
            await setDoc(doc(db, 'users', modCreds.user.uid), {
              name: 'Moderador',
              role: 'moderator',
              createdAt: new Date().toISOString()
            });

            // Demo User (so the user has an account to play with immediately)
            const demoCreds = await createUserWithEmailAndPassword(auth, 'usuario@ecotips.com', 'usuario123');
            await setDoc(doc(db, 'users', demoCreds.user.uid), {
              name: 'Usuario Demo',
              role: 'user',
              createdAt: new Date().toISOString()
            });

            await signOut(auth); // Sign out so the user starts fresh
            console.log("Cuentas listas: mod@ecotips.com y usuario@ecotips.com");
          } catch (authErr) {
            console.log("Nota: El moderador ya existe en Auth o hubo un error:", authErr.message);
          }
        }
      } catch (e) {
        console.info("Info: Inicialización de DB omitida localmente (el entorno está productivo o protegido).");
      }
    };

    seedDatabase();
  }, []);

  return (
    <LanguageProvider>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Suspense fallback={<div style={{ padding: '60px', textAlign: 'center', opacity: 0.6 }}>Cargando EcoTips...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/moderator" element={<ModeratorDashboard />} />
            <Route path="/legal" element={<LegalAndStandards />} />
            <Route path="*" element={<NotFound />} />
          </Routes>

        </Suspense>
      </main>
      <Footer />
    </LanguageProvider>
  );
}

export default App;
