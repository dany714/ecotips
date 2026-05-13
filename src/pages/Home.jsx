import { useState, useEffect, useRef } from 'react';
import { Plus, ClipboardList } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import TipCard from '../components/TipCard';
import CreateTipModal from '../components/CreateTipModal';
import TipDetailsModal from '../components/TipDetailsModal';
import ReportModal from '../components/ReportModal';
import WelcomeModal from '../components/WelcomeModal';
import AuthModal from '../components/AuthModal';
import PublicProfileModal from '../components/PublicProfileModal';

const CATEGORIES_KEYS = ['all', 'waste', 'recycling', 'energy', 'nature'];
const CATEGORIES_VALUES = ['Todos', 'Residuos', 'Reciclaje', 'Energía', 'Naturaleza'];

export default function Home() {
    const { tips, loadMoreTips, hasMoreTips, loadingData, comments } = useData();
    const { t } = useLanguage();
    const [filter, setFilter] = useState('Todos');
    const [sortBy, setSortBy] = useState('recent'); // 'recent' | 'popular' | 'oldest'
    const [selectedTip, setSelectedTip] = useState(null);
    const [publicProfileId, setPublicProfileId] = useState(null);
    const [reportTip, setReportTip] = useState(null);
    const [showCreate, setShowCreate] = useState(false);
    const [showWelcome, setShowWelcome] = useState(false);
    const [authModal, setAuthModal] = useState(null);
    const [showFab, setShowFab] = useState(false);

    // One-time welcome banner on first visit
    useEffect(() => {
        if (!localStorage.getItem('ecotips_visited')) {
            setShowWelcome(true);
            localStorage.setItem('ecotips_visited', 'true');
        }
    }, []);

    // Infinite scroll + FAB visibility
    const isLoadingMore = useRef(false);

    useEffect(() => {
        const handleScroll = () => {
            const isNearBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 300;
            if (window.scrollY > 200 && !isNearBottom) {
                setShowFab(true);
            } else {
                setShowFab(false);
            }

            if (
                hasMoreTips &&
                !isLoadingMore.current &&
                window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 150
            ) {
                isLoadingMore.current = true;
                loadMoreTips();
                // Release guard after a short delay to allow state to propagate
                setTimeout(() => { isLoadingMore.current = false; }, 1200);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [hasMoreTips, loadMoreTips]);

    const toMs = (ts) => {
        if (!ts) return Date.now() + 5000; 
        if (typeof ts.toMillis === 'function') return ts.toMillis();
        if (typeof ts.toDate === 'function') return ts.toDate().getTime();
        if (typeof ts === 'number') return ts;
        return new Date(ts).getTime();
    };

    const visibleTips = [...tips]
        .filter(t => !t.isSuspended)
        .filter(t => filter === 'Todos' || t.category === filter)
        .sort((a, b) => {
            if (sortBy === 'recent')  return toMs(b.createdAt) - toMs(a.createdAt);
            if (sortBy === 'oldest')  return toMs(a.createdAt) - toMs(b.createdAt);
            if (sortBy === 'popular') {
                const diff = (b.likes ?? 0) - (a.likes ?? 0);
                return diff !== 0 ? diff : toMs(b.createdAt) - toMs(a.createdAt);
            }
            return 0;
        });

    const handleTipClick = (tip) => {
        if (tip._openReport) {
            setReportTip({ ...tip, _openReport: undefined });
        } else if (tip._filterAuthor) {
            setPublicProfileId(tip._filterAuthor.id);
        } else {
            setSelectedTip(tip);
        }
    };

    return (
        <div className="home-container">
            <div className="home-toolbar">
                <div className="filters-wrapper">
                    <div className="categories-scroll desktop-only">
                        {CATEGORIES_KEYS.map((key, i) => (
                            <button
                                key={key}
                                onClick={() => setFilter(CATEGORIES_VALUES[i])}
                                className={`cat-pill ${filter === CATEGORIES_VALUES[i] ? 'active' : 'inactive'}`}
                            >
                                {t(key)}
                            </button>
                        ))}
                    </div>
                    <select
                        className="form-input mobile-only"
                        value={filter}
                        onChange={e => setFilter(e.target.value)}
                        style={{ padding: '6px 36px 6px 14px', width: 'auto', fontSize: '0.8rem', borderRadius: '99px', backgroundPosition: 'right 12px center', margin: 0, flexShrink: 0 }}
                    >
                        {CATEGORIES_KEYS.map((key, i) => (
                            <option key={key} value={CATEGORIES_VALUES[i]}>{t(key)}</option>
                        ))}
                    </select>
                    <div style={{ flex: 1 }} className="hidden-mobile" />
                    <div style={{ height: '24px', width: '2px', background: '#e5e7eb', flexShrink: 0 }} className="hidden-mobile" />
                    <select
                        className="form-input"
                        value={sortBy}
                        onChange={e => setSortBy(e.target.value)}
                        style={{ padding: '6px 36px 6px 14px', width: 'auto', fontSize: '0.8rem', borderRadius: '99px', backgroundPosition: 'right 12px center', margin: 0, flexShrink: 0 }}
                    >
                        <option value="recent">{t('mostRecent')}</option>
                        <option value="popular">{t('mostPopular')}</option>
                        <option value="oldest">{t('oldest')}</option>
                    </select>
                </div>
                <button className="btn btn-mobile-fab" onClick={() => setShowCreate(true)}>
                    <Plus size={20} /> <span>{t('publishTip')}</span>
                </button>
            </div>

            <section
                className="tips-board"
                aria-label="Tablero de tips sustentables"
            >

                {loadingData ? (
                    [...Array(8)].map((_, i) => (
                        <div
                            key={i}
                            className={`skeleton-card ${['card-h-sm','card-h-md','card-h-md','card-h-lg'][i % 4]}`}
                        />
                    ))
                ) : visibleTips.length === 0 ? (
                    <div style={{ columnSpan: 'all', textAlign: 'center', color: 'var(--text-muted)', padding: '60px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', width: '100%' }}>
                        <div style={{ width: '60px', height: '60px', background: 'var(--grey-100)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <ClipboardList size={26} style={{ opacity: 0.4 }} />
                        </div>
                        <p style={{ fontWeight: 600, fontSize: '0.95rem', margin: 0 }}>{t('noTipsCategory')}</p>
                    </div>
                ) : (
                    visibleTips.map(tip => (
                        <TipCard 
                            key={tip.id} 
                            tip={tip} 
                            onClick={handleTipClick} 
                            onAuthRequired={() => setAuthModal('login')} 
                            commentCount={comments.filter(c => c.tipId === tip.id).length}
                        />
                    ))
                )}
            </section>

            {hasMoreTips && tips.length > 0 && (
                <div style={{ textAlign: 'center', padding: '36px 0' }}>
                    <button className="btn btn-outline" onClick={loadMoreTips}>
                        {t('loadMore')}
                    </button>
                </div>
            )}
            {!hasMoreTips && tips.length > 0 && (
                <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-muted)', fontSize: '0.82rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                    ─ {t('endOfList')} ─
                </div>
            )}

            <CreateTipModal isOpen={showCreate} onClose={() => setShowCreate(false)} />

            {selectedTip && (
                <TipDetailsModal
                    tip={selectedTip}
                    onClose={() => setSelectedTip(null)}
                    onAuthorClick={(id, name) => {
                        setPublicProfileId(id);
                        setSelectedTip(null);
                    }}
                    onReport={(t) => {
                        setSelectedTip(null);
                        setReportTip(t);
                    }}
                    openAuth={() => setAuthModal('login')}
                />
            )}

            {publicProfileId && (
                <PublicProfileModal targetUserId={publicProfileId} onClose={() => setPublicProfileId(null)} />
            )}

            {reportTip && (
                <ReportModal tip={reportTip} onClose={() => setReportTip(null)} />
            )}

            <WelcomeModal isOpen={showWelcome} onClose={() => setShowWelcome(false)} />

            {authModal && <AuthModal mode={authModal} onClose={() => setAuthModal(null)} />}

            {/* Mobile FAB */}
            <button
                className={`fab-btn ${showFab && !showCreate && !selectedTip && !reportTip && !showWelcome && !authModal ? 'visible' : ''}`}
                onClick={() => setShowCreate(true)}
                aria-label={t('publishTipBtn')}
                title={t('publishTipTitle')}
            >
                <Plus size={26} strokeWidth={2.5} />
            </button>
        </div>
    );
}
