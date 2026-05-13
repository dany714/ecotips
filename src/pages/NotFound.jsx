import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function NotFound() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    if (countdown === 0) {
      navigate('/');
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, navigate]);

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.imageWrapper}>
            <img
              src="/404.png"
              alt={t('errorTitle')}
              style={styles.illustration}
            />
          </div>

          <div style={styles.content}>
            <h1 style={styles.title}>{t('errorTitle')}</h1>
            <p style={styles.subtitle}>
              {t('errorSubtitle')}
            </p>

            <div style={styles.timerSection}>
              <div style={styles.barTrack}>
                <div
                  style={{
                    ...styles.barFill,
                    width: `${(countdown / 10) * 100}%`,
                  }}
                />
              </div>
              <p style={styles.countdownText}>
                {t('errorRedirecting')} <strong style={{ color: '#16a34a' }}>{countdown}</strong> {t('errorSeconds')}
              </p>
            </div>

            <button
              style={styles.btn}
              onClick={() => navigate('/')}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#15803d';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(22, 163, 74, 0.3)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = '#16a34a';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(22, 163, 74, 0.2)';
              }}
            >
              {t('errorBtn')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: '100dvh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f9fafb',
    padding: '24px',
    fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
  },
  container: {
    width: '100%',
    maxWidth: '480px',
    animation: 'fadeIn 0.6s ease-out',
  },
  card: {
    background: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '24px',
    padding: '48px 32px',
    textAlign: 'center',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageWrapper: {
    marginBottom: '32px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  illustration: {
    width: '180px',
    height: '180px',
    objectFit: 'contain',
    filter: 'drop-shadow(0 10px 15px rgba(22, 163, 74, 0.1))',
  },
  content: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },

  title: {
    fontSize: '28px',
    fontWeight: 800,
    color: '#111827',
    margin: '0 0 12px',
    letterSpacing: '-0.02em',
  },
  subtitle: {
    fontSize: '15px',
    color: '#6b7280',
    lineHeight: 1.6,
    margin: '0 0 32px',
    maxWidth: '320px',
  },
  timerSection: {
    width: '100%',
    maxWidth: '240px',
    marginBottom: '32px',
  },
  barTrack: {
    height: '6px',
    background: '#f3f4f6',
    borderRadius: '99px',
    overflow: 'hidden',
    marginBottom: '12px',
  },
  barFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #22c55e, #16a34a)',
    borderRadius: '99px',
    transition: 'width 1s linear',
  },
  countdownText: {
    fontSize: '14px',
    color: '#9ca3af',
    margin: 0,
    fontWeight: 500,
  },
  btn: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '14px 40px',
    background: '#16a34a',
    color: '#ffffff',
    fontWeight: 700,
    fontSize: '15px',
    fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
    border: 'none',
    borderRadius: '16px',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(22, 163, 74, 0.2)',
    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
  },
};

// Se recomienda agregar esto al index.css para la animación:
// @keyframes fadeIn {
//   from { opacity: 0; transform: translateY(10px); }
//   to { opacity: 1; transform: translateY(0); }
// }

