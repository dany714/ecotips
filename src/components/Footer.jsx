import { Link } from 'react-router-dom';
import { Leaf, Heart } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
    const { t } = useLanguage();
    return (
        <footer style={{
            background: 'var(--grey-900)',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            padding: '32px 36px',
            marginTop: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            alignItems: 'center',
        }}>
            {/* Brand */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                <div style={{
                    background: 'linear-gradient(135deg, var(--green-600), var(--green-800))',
                    width: '32px', height: '32px', borderRadius: '8px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                    <Leaf size={16} color="white" />
                </div>
                <span style={{
                    fontWeight: 800, fontStyle: 'italic',
                    fontSize: '1.05rem', color: '#fff',
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    letterSpacing: '-0.01em',
                }}>
                    Eco Tips
                </span>
            </div>

            {/* Nav links */}
            <div style={{ display: 'flex', gap: '28px', fontSize: '0.85rem' }}>
                {[
                    { to: '/', label: t('footerHome') },
                    { to: '/legal', label: t('footerLegal') },
                ].map(({ to, label }) => (
                    <Link
                        key={to}
                        to={to}
                        style={{
                            color: 'rgba(255,255,255,0.55)',
                            textDecoration: 'none', fontWeight: 600,
                            transition: 'color 0.18s',
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                        }}
                        onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                        onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.55)'}
                    >
                        {label}
                    </Link>
                ))}
            </div>

            {/* Copyright */}
            <div style={{
                fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)',
                textAlign: 'center', display: 'flex',
                alignItems: 'center', gap: '5px', justifyContent: 'center',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}>
                © {new Date().getFullYear()} Eco Tips. {t('footerDev')}
                <Heart size={11} color="#22c55e" fill="#22c55e" />
                {t('footerText')}
            </div>
        </footer>
    );
}
